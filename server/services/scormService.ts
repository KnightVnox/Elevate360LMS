import AdmZip from 'adm-zip';
import { parseString } from 'xml2js';
import { promisify } from 'util';
import type {
  SCORMPackage,
  SCORMManifest,
  SCORMVersion,
  SCORMSco,
  SCORMValidationResult,
  SCORMImportResult,
  CMIData,
} from '@shared/scormTypes';

const parseXML = promisify(parseString);

export class SCORMService {
  /**
   * Parse a SCORM package from a ZIP buffer
   */
  async parsePackage(zipBuffer: Buffer): Promise<SCORMPackage> {
    const zip = new AdmZip(zipBuffer);
    
    // Find and parse manifest
    const manifestEntry = zip.getEntry('imsmanifest.xml');
    if (!manifestEntry) {
      throw new Error('SCORM package is missing imsmanifest.xml');
    }

    const manifestXml = manifestEntry.getData().toString('utf-8');
    const manifest = await this.parseManifest(manifestXml);
    
    // Determine SCORM version
    const version = this.detectVersion(manifest);
    
    // Extract SCOs from manifest
    const scos = this.extractSCOs(manifest, zip);
    
    // Get organization identifier
    const organizationIdentifier = manifest.organizations?.[0]?.identifier || 'default';

    return {
      version,
      manifest,
      scos,
      organizationIdentifier,
    };
  }

  /**
   * Parse SCORM manifest XML
   */
  private async parseManifest(xml: string): Promise<SCORMManifest> {
    const result: any = await parseXML(xml, {
      explicitArray: false,
      mergeAttrs: true,
      ignoreAttrs: false,
    });

    const manifestEl = result.manifest || result['imscp:manifest'] || result['imsmanifest'];
    
    if (!manifestEl) {
      throw new Error('Invalid manifest structure');
    }

    // Extract metadata
    const metadata = manifestEl.metadata || {};
    
    // Extract organizations
    const organizationsEl = manifestEl.organizations || {};
    const organizations = Array.isArray(organizationsEl.organization)
      ? organizationsEl.organization
      : organizationsEl.organization ? [organizationsEl.organization] : [];

    // Extract resources
    const resourcesEl = manifestEl.resources || {};
    const resources = Array.isArray(resourcesEl.resource)
      ? resourcesEl.resource
      : resourcesEl.resource ? [resourcesEl.resource] : [];

    return {
      identifier: manifestEl.identifier || manifestEl.identifier_ || '',
      version: manifestEl.version || '1.0',
      title: this.extractTitle(manifestEl),
      organizations: organizations.map((org: any) => this.parseOrganization(org)),
      resources: resources.map((res: any) => this.parseResource(res)),
      metadata,
    };
  }

  /**
   * Extract title from manifest element
   */
  private extractTitle(element: any): string {
    if (typeof element.title === 'string') {
      return element.title;
    }
    if (element.title?._) {
      return element.title._;
    }
    if (element.title?.['#text']) {
      return element.title['#text'];
    }
    return 'Untitled Course';
  }

  /**
   * Parse organization element
   */
  private parseOrganization(org: any): any {
    const items = Array.isArray(org.item) ? org.item : org.item ? [org.item] : [];
    
    return {
      identifier: org.identifier || org.identifier_ || '',
      title: this.extractTitle(org),
      items: items.map((item: any) => this.parseItem(item)),
    };
  }

  /**
   * Parse item element recursively
   */
  private parseItem(item: any): any {
    const subItems = Array.isArray(item.item) ? item.item : item.item ? [item.item] : [];
    
    return {
      identifier: item.identifier || item.identifier_ || '',
      identifierref: item.identifierref || item.identifierref_ || null,
      title: this.extractTitle(item),
      items: subItems.length > 0 ? subItems.map((i: any) => this.parseItem(i)) : undefined,
      parameters: item.parameters || null,
    };
  }

  /**
   * Parse resource element
   */
  private parseResource(res: any): any {
    const files = Array.isArray(res.file) ? res.file : res.file ? [res.file] : [];
    
    return {
      identifier: res.identifier || res.identifier_ || '',
      type: res.type || 'webcontent',
      href: res.href || null,
      files: files.map((file: any) => ({
        href: file.href || file.$?.href || '',
      })),
    };
  }

  /**
   * Detect SCORM version from manifest
   */
  private detectVersion(manifest: SCORMManifest): SCORMVersion {
    // Check metadata for version hints
    const metadata = manifest.metadata;
    if (metadata?.schemaversion) {
      if (metadata.schemaversion.includes('2004')) {
        return '2004';
      }
      if (metadata.schemaversion.includes('1.2')) {
        return '1.2';
      }
    }

    // Default to 1.2 (more common)
    return '1.2';
  }

  /**
   * Extract SCOs from manifest and ZIP
   */
  private extractSCOs(manifest: SCORMManifest, zip: AdmZip): SCORMSco[] {
    const scos: SCORMSco[] = [];
    
    if (!manifest.organizations || manifest.organizations.length === 0) {
      return scos;
    }

    const organization = manifest.organizations[0];
    const items = this.flattenItems(organization.items);
    
    items.forEach((item, index) => {
      if (!item.identifierref) {
        return; // Not a reference to a resource
      }

      const resource = manifest.resources.find(r => r.identifier === item.identifierref);
      if (!resource) {
        return;
      }

      // Find the launch file
      const launchFile = resource.href || (resource.files && resource.files[0]?.href);
      if (!launchFile) {
        return;
      }

      // Check if file exists in ZIP
      const fileEntry = zip.getEntry(launchFile);
      if (!fileEntry) {
        return;
      }

      scos.push({
        identifier: item.identifier,
        title: item.title,
        launchUrl: launchFile,
        entryPoint: launchFile,
        metadata: {
          resourceType: resource.type,
          parameters: item.parameters,
        },
        orderIndex: index,
      });
    });

    return scos;
  }

  /**
   * Flatten nested items into a single array
   */
  private flattenItems(items: any[]): any[] {
    const result: any[] = [];
    
    items.forEach(item => {
      result.push(item);
      if (item.items && item.items.length > 0) {
        result.push(...this.flattenItems(item.items));
      }
    });
    
    return result;
  }

  /**
   * Validate SCORM manifest
   */
  validateManifest(manifest: SCORMManifest): SCORMValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!manifest.identifier) {
      errors.push('Manifest is missing identifier');
    }
    if (!manifest.title) {
      warnings.push('Manifest is missing title');
    }
    if (!manifest.organizations || manifest.organizations.length === 0) {
      errors.push('Manifest must contain at least one organization');
    }
    if (!manifest.resources || manifest.resources.length === 0) {
      warnings.push('Manifest contains no resources');
    }

    // Validate organizations
    manifest.organizations?.forEach((org, idx) => {
      if (!org.identifier) {
        errors.push(`Organization ${idx} is missing identifier`);
      }
      if (!org.items || org.items.length === 0) {
        warnings.push(`Organization ${idx} contains no items`);
      }
    });

    // Validate resources
    manifest.resources?.forEach((res, idx) => {
      if (!res.identifier) {
        errors.push(`Resource ${idx} is missing identifier`);
      }
      if (!res.files || res.files.length === 0) {
        warnings.push(`Resource ${idx} contains no files`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      manifest,
    };
  }

  /**
   * Convert SCORM SCOs to course modules
   */
  convertToCourseModules(scos: SCORMSco[], courseId: string): any[] {
    return scos.map((sco, index) => ({
      courseId,
      title: sco.title,
      description: `SCORM content: ${sco.identifier}`,
      content: `SCORM SCO: ${sco.launchUrl}`,
      orderIndex: index,
      scormScoId: sco.identifier,
      estimatedDuration: null,
      prerequisites: null,
    }));
  }

  /**
   * Update SCORM tracking data
   */
  parseCMIData(data: any): CMIData {
    const cmiData: CMIData = {};

    if (data.student_id) cmiData.student_id = data.student_id;
    if (data.student_name) cmiData.student_name = data.student_name;
    if (data.lesson_location) cmiData.lesson_location = data.lesson_location;
    if (data.lesson_status) cmiData.lesson_status = data.lesson_status;
    if (data.entry) cmiData.entry = data.entry;
    if (data.exit) cmiData.exit = data.exit;
    if (data.suspend_data) cmiData.suspend_data = data.suspend_data;
    if (data.launch_data) cmiData.launch_data = data.launch_data;
    if (data.comments) cmiData.comments = data.comments;
    if (data.comments_from_lms) cmiData.comments_from_lms = data.comments_from_lms;

    // Score data
    if (data.score) {
      cmiData.score = {
        raw: data.score.raw || data.score_raw,
        min: data.score.min || data.score_min,
        max: data.score.max || data.score_max,
        scaled: data.score.scaled || data.score_scaled,
      };
    }

    // Time data
    if (data.time) {
      cmiData.time = {
        session_time: data.time.session_time || data.session_time,
        total_time: data.time.total_time || data.total_time,
      };
    }

    // SCORM 2004 specific
    if (data.completion_status) cmiData.completion_status = data.completion_status;
    if (data.success_status) cmiData.success_status = data.success_status;

    // Interactions
    if (data.interactions && Array.isArray(data.interactions)) {
      cmiData.interactions = data.interactions;
    }

    // Objectives
    if (data.objectives && Array.isArray(data.objectives)) {
      cmiData.objectives = data.objectives;
    }

    return cmiData;
  }

  /**
   * Extract completion status from CMI data
   */
  extractCompletionStatus(cmiData: CMIData): string | null {
    // SCORM 2004
    if (cmiData.completion_status) {
      return cmiData.completion_status;
    }
    
    // SCORM 1.2
    if (cmiData.lesson_status) {
      if (cmiData.lesson_status === 'passed' || cmiData.lesson_status === 'completed') {
        return 'completed';
      }
      if (cmiData.lesson_status === 'incomplete' || cmiData.lesson_status === 'browsed') {
        return 'incomplete';
      }
      if (cmiData.lesson_status === 'not attempted') {
        return 'not attempted';
      }
    }
    
    return null;
  }

  /**
   * Extract success status from CMI data
   */
  extractSuccessStatus(cmiData: CMIData): string | null {
    // SCORM 2004
    if (cmiData.success_status) {
      return cmiData.success_status;
    }
    
    // SCORM 1.2
    if (cmiData.lesson_status === 'passed') {
      return 'passed';
    }
    if (cmiData.lesson_status === 'failed') {
      return 'failed';
    }
    
    return null;
  }

  /**
   * Parse time string to seconds
   */
  parseTimeToSeconds(timeString?: string): number {
    if (!timeString) return 0;
    
    // Format: HH:MM:SS.SS or HH:MM:SS
    const parts = timeString.split(':');
    if (parts.length !== 3) return 0;
    
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    
    return Math.floor(hours * 3600 + minutes * 60 + seconds);
  }
}

export const scormService = new SCORMService();

