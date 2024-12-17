'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import nistFrameworkData from "@/framework_storage/nist/nist_sp-800-53_rev4_LOW-baseline_profile.json";

export function NISTFramework() {
  const router = useRouter();

  // Calculate framework metrics for Rev4
  const rev4Metrics = {
    controlFamilies: nistFrameworkData.catalog.groups.length,
    totalControls: nistFrameworkData.catalog.groups.reduce((total, group) => 
      total + (group.controls?.length || 0), 0),
    lastModified: nistFrameworkData.catalog.metadata['last-modified'],
    version: nistFrameworkData.catalog.metadata.version,
    title: nistFrameworkData.catalog.metadata.title
  };

  const handleRev4Select = () => {
    router.push('/rmf-library/framework/nist-800-53-rev4');
  };

  const handleRev5Select = () => {
    router.push('/rmf-library/nist/rev5');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Available NIST Frameworks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Rev 4 Framework */}
          <Button
            variant="ghost"
            className="w-full p-4 h-auto"
            onClick={handleRev4Select}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-left">{rev4Metrics.title}</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="text-sm font-medium">{rev4Metrics.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Control Families</p>
                    <p className="text-sm font-medium">{rev4Metrics.controlFamilies}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Controls</p>
                    <p className="text-sm font-medium">{rev4Metrics.totalControls}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="default">Active</Badge>
                  <Badge variant="secondary">Local JSON</Badge>
                  <Badge variant="outline">
                    Last Updated: {new Date(rev4Metrics.lastModified).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Button>

          {/* Rev 5 Framework */}
          <Button
            variant="ghost"
            className="w-full p-4 h-auto"
            onClick={handleRev5Select}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-left">NIST SP 800-53 Rev. 5</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="text-sm font-medium">5.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Format</p>
                    <p className="text-sm font-medium">CSV</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-sm font-medium">Latest</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="default">Active</Badge>
                  <Badge variant="secondary">Local CSV</Badge>
                  <Badge variant="outline">Enhanced Search</Badge>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
