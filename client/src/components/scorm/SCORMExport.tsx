import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Download, FileArchive, Loader2 } from "lucide-react";

interface SCORMExportProps {
  courseId: string;
  courseTitle?: string;
}

export default function SCORMExport({ courseId, courseTitle }: SCORMExportProps) {
  const [version, setVersion] = useState<'1.2' | '2004'>('1.2');
  const { toast } = useToast();

  const exportMutation = useMutation({
    mutationFn: async ({ courseId, version }: { courseId: string; version: string }) => {
      const response = await fetch(`/api/scorm/export/${courseId}?version=${version}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Export failed');
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${courseTitle || 'course'}_scorm_${version}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Export successful",
        description: `Course exported as SCORM ${version} package`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export course as SCORM package",
        variant: "destructive",
      });
    },
  });

  const handleExport = () => {
    exportMutation.mutate({ courseId, version });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileArchive className="h-5 w-5" />
          Export as SCORM Package
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">SCORM Version</label>
          <Select value={version} onValueChange={(v) => setVersion(v as '1.2' | '2004')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.2">SCORM 1.2 (Recommended)</SelectItem>
              <SelectItem value="2004">SCORM 2004</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            SCORM 1.2 has wider compatibility with most LMS platforms
          </p>
        </div>

        <Button
          onClick={handleExport}
          disabled={exportMutation.isPending}
          className="w-full"
        >
          {exportMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Course
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500">
          The exported package will include all course modules, content, and metadata
          in SCORM-compliant format
        </div>
      </CardContent>
    </Card>
  );
}


