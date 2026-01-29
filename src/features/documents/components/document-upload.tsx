'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'success' | 'error';
  error?: string;
}

interface DocumentUploadProps {
  patientId: string;
  onUploadComplete?: (documentId: string) => void;
  onError?: (error: string) => void;
}

export function DocumentUpload({
  patientId,
  onUploadComplete,
  onError
}: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: crypto.randomUUID(),
      progress: 0,
      status: 'pending' as const
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    // Auto-start upload for each file
    newFiles.forEach((uploadFile) => {
      uploadDocument(uploadFile);
    });
  }, []);

  const uploadDocument = async (uploadFile: UploadedFile) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 10 } : f
      )
    );

    try {
      // Simulate upload progress
      for (let i = 20; i <= 90; i += 20) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress: i } : f
          )
        );
      }

      // TODO: Replace with actual Supabase upload
      // const formData = new FormData();
      // formData.append('file', uploadFile.file);
      // formData.append('patientId', patientId);
      // const response = await fetch('/api/documents/upload', {
      //   method: 'POST',
      //   body: formData
      // });

      // Simulate processing
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: 'processing', progress: 95 } : f
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: 'success', progress: 100 } : f
        )
      );

      onUploadComplete?.(uploadFile.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );
      onError?.(errorMessage);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-sm text-primary">Drop files here...</p>
          ) : (
            <>
              <p className="text-sm font-medium">
                Drag & drop files here, or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, PNG, JPG up to 10MB
              </p>
            </>
          )}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((uploadFile) => (
              <div
                key={uploadFile.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadFile.file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {uploadFile.status === 'uploading' && (
                      <>
                        <Progress value={uploadFile.progress} className="h-1 flex-1" />
                        <span className="text-xs text-muted-foreground">
                          {uploadFile.progress}%
                        </span>
                      </>
                    )}
                    {uploadFile.status === 'processing' && (
                      <Badge variant="secondary" className="gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing OCR...
                      </Badge>
                    )}
                    {uploadFile.status === 'success' && (
                      <Badge variant="default" className="gap-1 bg-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Uploaded
                      </Badge>
                    )}
                    {uploadFile.status === 'error' && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {uploadFile.error || 'Failed'}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(uploadFile.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
