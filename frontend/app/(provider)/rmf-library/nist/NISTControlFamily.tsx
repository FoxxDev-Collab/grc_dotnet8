'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface NISTControlFamilyProps {
  familyId: string;
  controls: Control[];
  isExpanded: boolean;
  onToggle: () => void;
  onControlSelect?: (controlId: string) => void;
  selectedControl?: string;
}

export function NISTControlFamily({
  familyId,
  controls,
  isExpanded,
  onToggle,
  onControlSelect,
  selectedControl,
}: NISTControlFamilyProps) {
  // Group enhancements under their base controls
  const organizedControls = controls.reduce((acc: { [key: string]: Control[] }, control) => {
    if (control.isEnhancement) {
      const baseId = control.baseControlId!;
      if (!acc[baseId]) {
        acc[baseId] = [];
      }
      acc[baseId].push(control);
    }
    return acc;
  }, {});

  const baseControls = controls.filter(c => !c.isEnhancement);

  const renderControl = (control: Control, isEnhancement = false) => {
    const enhancements = organizedControls[control.id] || [];
    const isSelected = control.id === selectedControl;

    return (
      <div key={control.id} className={cn(
        "transition-all duration-200",
        isEnhancement ? 'ml-8 mt-1' : 'mt-2 first:mt-0'
      )}>
        <div 
          className={cn(
            "flex items-center p-3 rounded-md transition-colors",
            isSelected ? 'bg-muted' : 'hover:bg-muted/50',
            isEnhancement ? 'border border-muted' : 'bg-card shadow-sm'
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onControlSelect?.(control.id)}
          >
            {enhancements.length > 0 ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <span className="w-4" />
            )}
          </Button>
          <span className="ml-2 font-medium">{control.label || control.id}</span>
          <Badge className="ml-3" variant={getPriorityVariant(control.priority)}>
            {control.priority}
          </Badge>
          {enhancements.length > 0 && (
            <Badge variant="secondary" className="ml-3">
              {enhancements.length} Enhancement{enhancements.length !== 1 ? 's' : ''}
            </Badge>
          )}
          {control.title && (
            <span className="ml-3 text-sm text-muted-foreground truncate max-w-[400px]">
              {control.title}
            </span>
          )}
        </div>
        {isExpanded && enhancements.map(enhancement => 
          renderControl(enhancement, true)
        )}
      </div>
    );
  };

  const getPriorityVariant = (priority: string): "default" | "destructive" | "outline" | "secondary" | "warning" => {
    switch (priority) {
      case 'P1':
        return 'destructive';
      case 'P2':
        return 'warning';
      case 'P3':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center p-4 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
        onClick={onToggle}
      >
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <h3 className="text-lg font-semibold ml-2">
          {familyId} Family
        </h3>
        <Badge variant="secondary" className="ml-3">
          {controls.length} Control{controls.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      {isExpanded && (
        <div className="p-4">
          <div className="space-y-2">
            {baseControls.map(control => renderControl(control))}
          </div>
        </div>
      )}
    </Card>
  );
}
