'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { BookOpen, Loader2, RefreshCw } from 'lucide-react';
import { CatalogApi } from '@/lib/api/catalog';
import type { FrameworkDisplay, CatalogDto } from '@/types/catalog';

interface ISOFrameworkProps {
  frameworks: FrameworkDisplay[];
  loading: boolean;
  error: string | null;
  onFrameworksUpdate: (frameworks: FrameworkDisplay[]) => void;
  onFrameworkSelect: (framework: FrameworkDisplay) => void;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

const transformCatalogToFramework = (catalog: CatalogDto): FrameworkDisplay => ({
  ...catalog,
  lastUpdated: catalog.lastModified,
  controlFamilies: catalog.groups.length,
  totalControls: catalog.groups.reduce((total, group) => total + (group.totalControls || group.controls.length), 0),
  status: 'active'
});

export function ISOFramework({ 
  frameworks = [], // Provide default empty array
  loading, 
  error, 
  onFrameworksUpdate,
  onFrameworkSelect
}: ISOFrameworkProps) {
  const [refreshing, setRefreshing] = useState(false);

  // Filter for ISO frameworks only with null checks
  const isoFrameworks = frameworks.filter(framework => 
    framework?.title?.toLowerCase().includes('iso') ?? false
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await CatalogApi.getAllCatalogs();
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data) {
        const transformedFrameworks = response.data.map(transformCatalogToFramework);
        onFrameworksUpdate(transformedFrameworks);
      }
    } catch (err) {
      console.error('Error refreshing frameworks:', err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ISO Frameworks</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh Catalog
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : isoFrameworks.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No ISO frameworks available
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Framework</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Control Families</TableHead>
                  <TableHead>Total Controls</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isoFrameworks.map((framework) => (
                  <TableRow key={framework.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        {framework.title}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {framework.description}
                      </div>
                    </TableCell>
                    <TableCell>{framework.version}</TableCell>
                    <TableCell>{framework.controlFamilies}</TableCell>
                    <TableCell>{framework.totalControls}</TableCell>
                    <TableCell>
                      <Badge variant={framework.status === 'active' ? 'default' : 'secondary'}>
                        {framework.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(framework.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost"
                        onClick={() => onFrameworkSelect(framework)}
                      >
                        View Controls
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
