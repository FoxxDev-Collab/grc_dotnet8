'use client';

import React, { useState } from 'react';
import { NISTControlFamily } from './NISTControlFamily';
import nistFrameworkData from '@/framework_storage/nist/nist_sp-800-53_rev4_LOW-baseline_profile.json';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Prop {
  name: string;
  value: string;
}

interface Link {
  href: string;
  rel: string;
}

interface Part {
  id: string;
  name: string;
  prose?: string;
  props?: Prop[];
  parts?: Part[];
  links?: Link[];
}

interface CatalogControl {
  id: string;
  class: string;
  title: string;
  params?: Array<{
    id: string;
    label: string;
  }>;
  props?: Prop[];
  links?: Link[];
  parts?: Part[];
}

interface CatalogGroup {
  id: string;
  class: string;
  title: string;
  controls?: CatalogControl[];
}

interface Control {
  id: string;
  priority: string;
  isEnhancement: boolean;
  baseControlId?: string;
  title?: string;
  prose?: string;
  label?: string;
  parts?: Part[];
  class?: string;
  params?: Array<{
    id: string;
    label: string;
  }>;
  props?: Prop[];
  links?: Link[];
}

interface ControlDetails {
  id: string;
  title: string;
  prose: string;
  label: string;
  parts: Part[];
}

export default function NISTFrameworkViewer() {
  const [expandedFamilies, setExpandedFamilies] = useState<string[]>([]);
  const [selectedControl, setSelectedControl] = useState<string | undefined>();
  const [controlDetails, setControlDetails] = useState<ControlDetails | null>(null);

  // Group controls by family and process control enhancements
  const controlsByFamily = React.useMemo(() => {
    const families: Record<string, Control[]> = {};

    // Process controls from the catalog groups
    (nistFrameworkData.catalog.groups as CatalogGroup[]).forEach((group) => {
      const familyId = group.id.toUpperCase();
      if (!families[familyId]) {
        families[familyId] = [];
      }

      group.controls?.forEach((control) => {
        const controlId = control.id;
        const isEnhancement = controlId.includes('.');
        const baseControlId = isEnhancement ? controlId.split('.')[0] : undefined;

        families[familyId].push({
          id: controlId,
          priority: control.props?.find(p => p.name === 'priority')?.value || 'Unknown',
          isEnhancement,
          baseControlId,
          title: control.title,
          prose: control.parts?.find(p => p.name === 'statement')?.prose,
          label: control.props?.find(p => p.name === 'label')?.value || controlId,
          parts: control.parts,
          class: control.class,
          params: control.params,
          props: control.props,
          links: control.links
        });
      });
    });

    // Sort controls within each family
    Object.keys(families).forEach((familyId) => {
      families[familyId].sort((a, b) => {
        // Sort by base control first
        const aBase = a.isEnhancement ? a.baseControlId! : a.id;
        const bBase = b.isEnhancement ? b.baseControlId! : b.id;
        
        if (aBase !== bBase) {
          return aBase.localeCompare(bBase);
        }
        
        // If same base control, enhancements come after
        if (a.isEnhancement !== b.isEnhancement) {
          return a.isEnhancement ? 1 : -1;
        }
        
        // Sort enhancements numerically
        if (a.isEnhancement && b.isEnhancement) {
          const aNum = parseInt(a.id.split('.')[1]);
          const bNum = parseInt(b.id.split('.')[1]);
          return aNum - bNum;
        }
        
        return 0;
      });
    });

    return families;
  }, []);

  const toggleFamily = (familyId: string) => {
    setExpandedFamilies((prev) =>
      prev.includes(familyId)
        ? prev.filter((id) => id !== familyId)
        : [...prev, familyId]
    );
  };

  const handleControlSelect = (controlId: string) => {
    setSelectedControl(controlId);
    
    // Find control details in the catalog
    const control = (nistFrameworkData.catalog.groups as CatalogGroup[])
      .flatMap(group => group.controls || [])
      .find((c) => c.id === controlId);

    if (control) {
      setControlDetails({
        id: control.id,
        title: control.title || '',
        prose: control.parts?.find(p => p.name === 'statement')?.prose || '',
        label: control.props?.find(p => p.name === 'label')?.value || control.id,
        parts: control.parts || []
      });
    }
  };

  const renderParts = (parts: Part[], level = 0) => {
    if (!parts || parts.length === 0) return null;

    return (
      <div className={`ml-${level * 4} mt-2`}>
        {parts.map((part, index) => (
          <div key={part.id || index} className="mb-4">
            {part.props?.find(p => p.name === 'label')?.value && (
              <Badge variant="outline" className="mb-2">
                {part.props.find(p => p.name === 'label')?.value}
              </Badge>
            )}
            {part.name && (
              <div className="text-sm font-medium mb-1">{part.name}</div>
            )}
            {part.prose && (
              <div className="text-sm text-muted-foreground">{part.prose}</div>
            )}
            {part.parts && renderParts(part.parts, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg border bg-card">
        <div className="p-6">
          <div className="grid gap-6">
            {Object.entries(controlsByFamily).map(([familyId, controls]) => (
              <NISTControlFamily
                key={familyId}
                familyId={familyId}
                controls={controls}
                isExpanded={expandedFamilies.includes(familyId)}
                onToggle={() => toggleFamily(familyId)}
                onControlSelect={handleControlSelect}
                selectedControl={selectedControl}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg border bg-card">
        <div className="p-6">
          {controlDetails ? (
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2">{controlDetails.label}</Badge>
                <CardTitle>{controlDetails.title || controlDetails.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {controlDetails.prose && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {controlDetails.prose}
                      </p>
                    </div>
                  )}
                  {controlDetails.parts && controlDetails.parts.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Control Elements</h4>
                      {renderParts(controlDetails.parts)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a control to view details
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
