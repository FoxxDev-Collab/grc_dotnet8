'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { CatalogUploadResponse } from '@/types/catalog';
import { Api } from '@/lib/api';
import { CatalogApi } from '@/lib/api/catalog';

interface UploadState {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  message?: string;
  stats?: CatalogUploadResponse['details']['stats'];
}

export function CatalogUploader({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.json')) {
        setUploadState({
          status: 'error',
          progress: 0,
          message: 'Please select a JSON file'
        });
        return;
      }
      setSelectedFile(file);
      setUploadState({ status: 'idle', progress: 0 });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadState({ status: 'uploading', progress: 0 });

    try {
      // Upload progress simulation
      const uploadInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 500);

      const response = await CatalogApi.uploadCatalog(selectedFile);
      clearInterval(uploadInterval);

      if ('error' in response) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Show processing state
      setUploadState({
        status: 'processing',
        progress: 95,
        message: 'Processing catalog...'
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { catalog, stats } = response.data.details;
      
      setUploadState({
        status: 'success',
        progress: 100,
        message: `Successfully imported ${catalog.title} (${catalog.version})`,
        stats
      });

      onUploadComplete();
      
      // Reset after success
      setTimeout(() => {
        setSelectedFile(null);
        setUploadState({ status: 'idle', progress: 0 });
      }, 3000);

    } catch (error) {
      setUploadState({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Upload failed'
      });
    }
  };

  if (!Api.isAuthenticated()) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Please log in to upload frameworks</AlertDescription>
      </Alert>
    );
  }

  if (Api.getUserType() !== 'system') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Only system administrators can upload frameworks</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Security Framework
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uploadState.status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadState.message}</AlertDescription>
            </Alert>
          )}

          {uploadState.status === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <div>{uploadState.message}</div>
                {uploadState.stats && (
                  <div className="mt-2 text-sm">
                    <div>Groups: {uploadState.stats.groups}</div>
                    <div>Controls: {uploadState.stats.controls}</div>
                    <div>Parts: {uploadState.stats.parts}</div>
                    <div>Parameters: {uploadState.stats.parameters}</div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={uploadState.status === 'uploading' || uploadState.status === 'processing'}
            />
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadState.status === 'uploading' || uploadState.status === 'processing'}
            >
              {uploadState.status === 'uploading' ? 'Uploading...' : 
               uploadState.status === 'processing' ? 'Processing...' : 
               'Upload'}
            </Button>
          </div>

          {(uploadState.status === 'uploading' || uploadState.status === 'processing') && (
            <div className="space-y-2">
              <Progress value={uploadState.progress} />
              <p className="text-sm text-muted-foreground">
                {uploadState.status === 'uploading' ? 'Uploading framework...' : 'Processing framework...'} {uploadState.progress}%
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
