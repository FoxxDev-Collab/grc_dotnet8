'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CatalogUploader } from './CatalogUploader';
import { NISTFramework } from './NISTFramework';
import { ISOFramework } from './ISOFramework';
import { Api } from '@/lib/api';
import { CatalogApi } from '@/lib/api/catalog';
import type { FrameworkDisplay, CatalogDto } from '@/types/catalog';
import { useState, useEffect } from 'react';

export default function RmfLibraryPage() {
  const [frameworks, setFrameworks] = useState<FrameworkDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const transformCatalogToFramework = (catalog: CatalogDto): FrameworkDisplay => ({
    ...catalog,
    lastUpdated: catalog.lastModified,
    controlFamilies: catalog.groups.length,
    totalControls: catalog.groups.reduce((total, group) => total + (group.totalControls || group.controls.length), 0),
    status: 'active'
  });

  useEffect(() => {
    // Check authentication
    if (!Api.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Verify user type
    const userType = Api.getUserType();
    if (userType !== 'system') {
      router.push('/unauthorized');
      return;
    }

    // Only fetch non-NIST frameworks since NIST is now local
    async function fetchFrameworks() {
      try {
        const response = await CatalogApi.getAllCatalogs();
        if ('error' in response) {
          throw new Error(response.error);
        }
        if (!response.data) {
          throw new Error('No data received from server');
        }
        const transformedFrameworks = response.data
          .filter(framework => !framework.title.toLowerCase().includes('nist'))
          .map(transformCatalogToFramework);
        setFrameworks(transformedFrameworks);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load frameworks');
      } finally {
        setLoading(false);
      }
    }

    fetchFrameworks();
  }, [router]);

  const handleUploadComplete = async () => {
    // Refresh only non-NIST frameworks
    setLoading(true);
    try {
      const response = await CatalogApi.getAllCatalogs();
      if ('error' in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error('No data received from server');
      }
      const transformedFrameworks = response.data
        .filter(framework => !framework.title.toLowerCase().includes('nist'))
        .map(transformCatalogToFramework);
      setFrameworks(transformedFrameworks);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load frameworks');
    } finally {
      setLoading(false);
    }
  };

  const handleFrameworkSelect = (framework: FrameworkDisplay) => {
    router.push(`/rmf-library/framework/${framework.id}`);
  };

  // Don't render content if not authenticated
  if (!Api.isAuthenticated()) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">RMF Master Library</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Manage security frameworks, control families, and controls
        </p>
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <CatalogUploader onUploadComplete={handleUploadComplete} />
        </div>
      </div>

      <div className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="nist" className="border rounded-lg shadow-sm">
            <AccordionTrigger className="text-xl font-semibold px-6 py-4 hover:bg-muted/50">
              NIST Frameworks
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-2">
              <Suspense fallback={
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              }>
                <NISTFramework />
              </Suspense>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="iso" className="border rounded-lg shadow-sm mt-4">
            <AccordionTrigger className="text-xl font-semibold px-6 py-4 hover:bg-muted/50">
              ISO 27001 Frameworks
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-2">
              <Suspense fallback={
                <div className="grid gap-4">
                  {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                          <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              }>
                <ISOFramework 
                  frameworks={frameworks}
                  loading={loading}
                  error={error}
                  onFrameworksUpdate={setFrameworks}
                  onFrameworkSelect={handleFrameworkSelect}
                />
              </Suspense>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
