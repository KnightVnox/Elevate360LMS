import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SCORMPlayerProps {
  scoId: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export default function SCORMPlayer({ scoId, onProgress, onComplete }: SCORMPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { data: launchData, isLoading: isLoadingLaunch } = useQuery({
    queryKey: ['/api/scorm/content', scoId],
    queryFn: async () => {
      return await apiRequest('GET', `/api/scorm/content/${scoId}/launch`);
    },
    enabled: !!scoId,
  });

  useEffect(() => {
    if (launchData?.launchUrl && iframeRef.current) {
      setIsLoading(true);
      // Load SCORM content in iframe
      // Note: In production, you'd need to serve the actual SCORM files
      // and inject the SCORM API JavaScript
      iframeRef.current.src = `/api/scorm/content/${scoId}/launch`;
      setIsLoading(false);
    }
  }, [launchData, scoId]);

  useEffect(() => {
    if (progress > 0 && onProgress) {
      onProgress(progress);
    }
    if (progress >= 100 && onComplete) {
      onComplete();
    }
  }, [progress, onProgress, onComplete]);

  if (isLoadingLaunch) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
          <iframe
            ref={iframeRef}
            className="absolute top-0 left-0 w-full h-full border-0"
            title="SCORM Content"
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
        {progress > 0 && (
          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}


