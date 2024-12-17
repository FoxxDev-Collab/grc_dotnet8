'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CatalogApi } from '@/lib/api/catalog';
import type { FrameworkDisplay, CatalogDto } from '@/types/catalog';
import { useRouter } from 'next/navigation';

interface FrameworkListProps {
  frameworkType: 'NIST' | 'ISO';
}

export function FrameworkList({ frameworkType }: FrameworkListProps) {
  const [frameworks, setFrameworks] = useState<FrameworkDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchFrameworks() {
      try {
        const response = await CatalogApi.getAllCatalogs();
        if ('error' in response) {
          throw new Error(response.error);
        }
        if (!response.data) {
          throw new Error('No data received from server');
        }
        // Filter frameworks based on type and transform to FrameworkDisplay
        const filteredFrameworks = response.data
          .filter(framework => 
            frameworkType === 'NIST' 
              ? framework.title.toLowerCase().includes('nist') 
              : framework.title.toLowerCase().includes('iso')
          )
          .map((catalog: CatalogDto): FrameworkDisplay => ({
            ...catalog,
            lastUpdated: catalog.lastModified,
            controlFamilies: catalog.groups.length,
            totalControls: catalog.groups.reduce((total, group) => total + (group.totalControls || group.controls.length), 0),
            status: 'active'
          }));
        setFrameworks(filteredFrameworks);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load frameworks');
      } finally {
        setLoading(false);
      }
    }

    fetchFrameworks();
  }, [frameworkType]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-8 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-8 bg-gray-200 rounded animate-pulse w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (frameworks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No {frameworkType} frameworks imported yet.</p>
        <p className="text-muted-foreground">Use the uploader above to import a framework.</p>
      </div>
    );
  }

  const handleViewDetails = (frameworkId: string) => {
    router.push(`/rmf-library/framework/${frameworkId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Framework</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Control Families</TableHead>
            <TableHead>Total Controls</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {frameworks.map((framework) => (
            <TableRow key={framework.id}>
              <TableCell className="font-medium">{framework.title}</TableCell>
              <TableCell>{framework.version}</TableCell>
              <TableCell>{framework.controlFamilies}</TableCell>
              <TableCell>{framework.totalControls}</TableCell>
              <TableCell>{new Date(framework.lastUpdated).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(framework.id)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
