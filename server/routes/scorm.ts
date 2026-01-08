import type { Express } from "express";
import multer from "multer";
import { storage } from "../storage";
import { scormService } from "../services/scormService";
import { isAuthenticated } from "../replitAuth";
import { insertSCORMPackageSchema, insertSCORMScoSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept ZIP files
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed'));
    }
  },
});

export default function scormRoutes(app: Express) {
  // SCORM Import - Upload and parse package
  app.post('/api/scorm/import', isAuthenticated, upload.single('package'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'mentor' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only mentors and admins can import SCORM packages" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { courseId } = req.body;
      if (!courseId) {
        return res.status(400).json({ message: "courseId is required" });
      }

      // Verify course exists and belongs to user
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (user.role !== 'admin' && course.mentorId !== userId) {
        return res.status(403).json({ message: "You can only import SCORM packages to your own courses" });
      }

      // Parse SCORM package
      const scormPackage = await scormService.parsePackage(req.file.buffer);
      
      // Validate manifest
      const validation = scormService.validateManifest(scormPackage.manifest);
      
      if (!validation.valid) {
        return res.status(400).json({
          message: "Invalid SCORM package",
          errors: validation.errors,
          warnings: validation.warnings,
        });
      }

      // TODO: Upload package file to cloud storage
      // For now, we'll store the manifest data and references
      const packageUrl = `/scorm/packages/${courseId}/${Date.now()}.zip`;

      // Create SCORM package record
      const packageData = {
        courseId,
        title: scormPackage.manifest.title || 'Imported SCORM Package',
        version: scormPackage.version,
        manifestData: scormPackage.manifest as any,
        packageUrl,
        organizationIdentifier: scormPackage.organizationIdentifier,
      };

      const pkg = await storage.createSCORMPackage(packageData);

      // Create SCO records
      const scos = await Promise.all(
        scormPackage.scos.map((sco, index) =>
          storage.createSCORMSco({
            packageId: pkg.id,
            identifier: sco.identifier,
            title: sco.title,
            launchUrl: sco.launchUrl,
            metadata: sco.metadata as any,
            orderIndex: sco.orderIndex,
            entryPoint: sco.entryPoint,
          })
        )
      );

      // Optionally create course modules from SCOs
      if (req.body.createModules === 'true') {
        const modules = scormService.convertToCourseModules(scormPackage.scos, courseId);
        // TODO: Create modules in database
        // await storage.createCourseModules(modules);
      }

      res.status(201).json({
        success: true,
        packageId: pkg.id,
        courseId,
        scos: scos.map(s => ({
          id: s.id,
          identifier: s.identifier,
          title: s.title,
          launchUrl: s.launchUrl,
        })),
        warnings: validation.warnings,
      });
    } catch (error: any) {
      console.error("Error importing SCORM package:", error);
      res.status(500).json({
        message: "Failed to import SCORM package",
        error: error.message,
      });
    }
  });

  // Validate SCORM package without importing
  app.post('/api/scorm/validate', isAuthenticated, upload.single('package'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const scormPackage = await scormService.parsePackage(req.file.buffer);
      const validation = scormService.validateManifest(scormPackage.manifest);

      res.json({
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
        package: {
          version: scormPackage.version,
          title: scormPackage.manifest.title,
          scosCount: scormPackage.scos.length,
          organizationIdentifier: scormPackage.organizationIdentifier,
        },
      });
    } catch (error: any) {
      console.error("Error validating SCORM package:", error);
      res.status(500).json({
        message: "Failed to validate SCORM package",
        error: error.message,
      });
    }
  });

  // Get SCORM package preview
  app.get('/api/scorm/packages/:id/preview', isAuthenticated, async (req: any, res) => {
    try {
      const packageId = req.params.id;
      const pkg = await storage.getSCORMPackage(packageId);
      
      if (!pkg) {
        return res.status(404).json({ message: "SCORM package not found" });
      }

      const scos = await storage.getSCORMScosByPackage(packageId);

      res.json({
        id: pkg.id,
        title: pkg.title,
        version: pkg.version,
        courseId: pkg.courseId,
        organizationIdentifier: pkg.organizationIdentifier,
        scos: scos.map(s => ({
          id: s.id,
          identifier: s.identifier,
          title: s.title,
          launchUrl: s.launchUrl,
          orderIndex: s.orderIndex,
        })),
        createdAt: pkg.createdAt,
      });
    } catch (error: any) {
      console.error("Error fetching SCORM package:", error);
      res.status(500).json({ message: "Failed to fetch SCORM package" });
    }
  });

  // Get SCORM packages for a course
  app.get('/api/scorm/courses/:courseId/packages', isAuthenticated, async (req: any, res) => {
    try {
      const courseId = req.params.courseId;
      const packages = await storage.getSCORMPackagesByCourse(courseId);

      res.json(packages.map(pkg => ({
        id: pkg.id,
        title: pkg.title,
        version: pkg.version,
        createdAt: pkg.createdAt,
      })));
    } catch (error: any) {
      console.error("Error fetching SCORM packages:", error);
      res.status(500).json({ message: "Failed to fetch SCORM packages" });
    }
  });

  // Launch SCORM content
  app.get('/api/scorm/content/:scoId/launch', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const scoId = req.params.scoId;
      
      const sco = await storage.getSCORMSco(scoId);
      if (!sco) {
        return res.status(404).json({ message: "SCO not found" });
      }

      // Get or create tracking record
      let tracking = await storage.getSCORMTracking(userId, scoId);
      if (!tracking) {
        tracking = await storage.createSCORMTracking({
          userId,
          scoId,
          cmiData: {
            student_id: userId,
            entry: 'ab-initio',
            lesson_status: 'not attempted',
          } as any,
          completionStatus: 'not attempted',
        });
      }

      // TODO: Serve the actual SCORM content file
      // For now, return the launch URL
      res.json({
        scoId: sco.id,
        launchUrl: sco.launchUrl,
        entryPoint: sco.entryPoint,
        trackingId: tracking.id,
      });
    } catch (error: any) {
      console.error("Error launching SCORM content:", error);
      res.status(500).json({ message: "Failed to launch SCORM content" });
    }
  });

  // SCORM API endpoint for tracking
  app.post('/api/scorm/tracking/:scoId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const scoId = req.params.scoId;
      const { cmiData } = req.body;

      if (!cmiData) {
        return res.status(400).json({ message: "cmiData is required" });
      }

      // Parse CMI data
      const parsedCMI = scormService.parseCMIData(cmiData);
      
      // Get existing tracking or create new
      let tracking = await storage.getSCORMTracking(userId, scoId);
      
      const trackingData = {
        cmiData: parsedCMI as any,
        completionStatus: scormService.extractCompletionStatus(parsedCMI) || null,
        successStatus: scormService.extractSuccessStatus(parsedCMI) || null,
        scoreScaled: parsedCMI.score?.scaled ? String(parsedCMI.score.scaled) : null,
        scoreRaw: parsedCMI.score?.raw || null,
        scoreMin: parsedCMI.score?.min || null,
        scoreMax: parsedCMI.score?.max || null,
        sessionTime: parsedCMI.time?.session_time ? scormService.parseTimeToSeconds(parsedCMI.time.session_time) : null,
        totalTime: parsedCMI.time?.total_time ? scormService.parseTimeToSeconds(parsedCMI.time.total_time) : null,
        location: parsedCMI.lesson_location || null,
        suspendData: parsedCMI.suspend_data || null,
      };

      if (tracking) {
        tracking = await storage.updateSCORMTracking(tracking.id, trackingData);
      } else {
        tracking = await storage.createSCORMTracking({
          userId,
          scoId,
          ...trackingData,
        });
      }

      res.json({
        success: true,
        tracking: {
          id: tracking.id,
          completionStatus: tracking.completionStatus,
          successStatus: tracking.successStatus,
          scoreScaled: tracking.scoreScaled,
          scoreRaw: tracking.scoreRaw,
        },
      });
    } catch (error: any) {
      console.error("Error updating SCORM tracking:", error);
      res.status(500).json({ message: "Failed to update SCORM tracking" });
    }
  });

  // Get SCORM tracking data
  app.get('/api/scorm/tracking/:userId/:courseId?', isAuthenticated, async (req: any, res) => {
    try {
      const requestedUserId = req.params.userId;
      const courseId = req.params.courseId;
      const currentUserId = req.user.claims.sub;
      const user = await storage.getUser(currentUserId);

      // Users can only view their own tracking, unless admin
      if (user?.role !== 'admin' && requestedUserId !== currentUserId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const tracking = await storage.getSCORMTrackingByUser(requestedUserId, courseId);
      res.json(tracking);
    } catch (error: any) {
      console.error("Error fetching SCORM tracking:", error);
      res.status(500).json({ message: "Failed to fetch SCORM tracking" });
    }
  });

  // SCORM Export - Export course to SCORM format
  app.get('/api/scorm/export/:courseId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = req.params.courseId;
      const { version = '1.2' } = req.query;

      const user = await storage.getUser(userId);
      if (user?.role !== 'mentor' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only mentors and admins can export courses" });
      }

      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (user.role !== 'admin' && course.mentorId !== userId) {
        return res.status(403).json({ message: "You can only export your own courses" });
      }

      // TODO: Implement SCORM export
      // This would generate a SCORM-compliant ZIP file
      res.status(501).json({ message: "SCORM export not yet implemented" });
    } catch (error: any) {
      console.error("Error exporting SCORM package:", error);
      res.status(500).json({ message: "Failed to export SCORM package" });
    }
  });
}


