import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, FileArchive, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SCORMUploaderProps {
  courseId?: string;
  onUploadComplete?: (result: any) => void;
  onCancel?: () => void;
}

export default function SCORMUploader({ courseId, onUploadComplete, onCancel }: SCORMUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('package', file);
      
      const response = await fetch('/api/scorm/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Validation failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.valid) {
        toast({
          title: "Package validated",
          description: `SCORM ${data.package.version} package with ${data.package.scosCount} SCOs`,
        });
      } else {
        toast({
          title: "Validation failed",
          description: data.errors?.join(', ') || 'Invalid SCORM package',
          variant: "destructive",
        });
      }
    },
  });

  const importMutation = useMutation({
    mutationFn: async ({ file, courseId }: { file: File; courseId: string }) => {
      const formData = new FormData();
      formData.append('package', file);
      formData.append('courseId', courseId);
      formData.append('createModules', 'true');
      
      const response = await fetch('/api/scorm/import', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Import failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `SCORM package imported successfully with ${data.scos?.length || 0} SCOs`,
      });
      if (onUploadComplete) {
        onUploadComplete(data);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Import failed",
        description: error.message || "Failed to import SCORM package",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.zip')) {
      toast({
        title: "Invalid file",
        description: "Please select a ZIP file",
        variant: "destructive",
      });
      return;
    }
    setFile(selectedFile);
    // Auto-validate
    validateMutation.mutate(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file || !courseId) {
      toast({
        title: "Error",
        description: "Please select a file and ensure course ID is provided",
        variant: "destructive",
      });
      return;
    }

    importMutation.mutate({ file, courseId });
  };

  const validationResult = validateMutation.data;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileArchive className="h-5 w-5" />
            Import SCORM Package
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <div className="text-lg font-medium text-gray-900 mb-2">
              {file ? file.name : 'Drag and drop SCORM package (ZIP)'}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              or click to browse
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose ZIP File
            </Button>
            <div className="text-xs text-gray-400 mt-2">
              SCORM 1.2 and SCORM 2004 packages are supported
            </div>
          </div>

          {/* Validation Results */}
          {validateMutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Validating package...
            </div>
          )}

          {validationResult && (
            <Alert variant={validationResult.valid ? "default" : "destructive"}>
              {validationResult.valid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {validationResult.valid ? "Package Valid" : "Validation Failed"}
              </AlertTitle>
              <AlertDescription>
                {validationResult.valid ? (
                  <div className="space-y-1">
                    <p>Version: SCORM {validationResult.package.version}</p>
                    <p>SCOs: {validationResult.package.scosCount}</p>
                    {validationResult.warnings && validationResult.warnings.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Warnings:</p>
                        <ul className="list-disc list-inside text-sm">
                          {validationResult.warnings.map((w: string, i: number) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p>Errors found:</p>
                    <ul className="list-disc list-inside text-sm mt-1">
                      {validationResult.errors?.map((e: string, i: number) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* File Info */}
          {file && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileArchive className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null);
                  validateMutation.reset();
                }}
              >
                Remove
              </Button>
            </div>
          )}

          {/* Import Progress */}
          {importMutation.isPending && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importing package...</span>
                <span>Processing</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              onClick={handleImport}
              disabled={
                !file ||
                !courseId ||
                !validationResult?.valid ||
                importMutation.isPending
              }
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import Package'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

