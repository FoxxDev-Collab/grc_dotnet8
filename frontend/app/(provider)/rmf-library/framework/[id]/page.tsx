'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import NISTFrameworkViewer from '@/app/(provider)/rmf-library/nist/NISTFrameworkViewer';
import nistFrameworkData from '@/framework_storage/nist/nist_sp-800-53_rev4_LOW-baseline_profile.json';
import { Badge } from '@/components/ui/badge';

export default function FrameworkPage() {
  const params = useParams();
  const { id } = params;

  // Only show NIST viewer for nist-800-53-rev4
  if (id !== 'nist-800-53-rev4') {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Framework not found
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const frameworkMetrics = {
    lastModified: nistFrameworkData.catalog.metadata['last-modified'],
    version: nistFrameworkData.catalog.metadata.version,
    title: nistFrameworkData.catalog.metadata.title,
    controlFamilies: nistFrameworkData.catalog.groups.length,
    totalControls: nistFrameworkData.catalog.groups.reduce((total, group) => 
      total + (group.controls?.length || 0), 0)
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{frameworkMetrics.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Version</p>
              <p className="text-lg font-medium">{frameworkMetrics.version}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Control Families</p>
              <p className="text-lg font-medium">{frameworkMetrics.controlFamilies}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Controls</p>
              <p className="text-lg font-medium">{frameworkMetrics.totalControls}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-lg font-medium">
                {new Date(frameworkMetrics.lastModified).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Badge variant="default">Active</Badge>
            <Badge variant="secondary">Local JSON</Badge>
          </div>
        </CardContent>
      </Card>

      <NISTFrameworkViewer />
    </div>
  );
}
