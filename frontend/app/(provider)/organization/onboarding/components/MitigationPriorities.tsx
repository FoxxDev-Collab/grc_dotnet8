'use client';

import { useState } from 'react';
import { FormComponentProps, MitigationPriority } from '../types';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/text-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, AlertTriangle, DollarSign, Users, ChevronDown, ChevronUp } from 'lucide-react';

const TIME_FRAMES = [
  { value: 'IMMEDIATE', label: 'Immediate (< 1 month)', color: 'bg-red-500' },
  { value: 'SHORT_TERM', label: 'Short Term (1-3 months)', color: 'bg-orange-500' },
  { value: 'MEDIUM_TERM', label: 'Medium Term (3-6 months)', color: 'bg-yellow-500' },
  { value: 'LONG_TERM', label: 'Long Term (6+ months)', color: 'bg-green-500' },
] as const;

const RISK_AREAS = [
  { value: 'Operational', icon: '🔧', description: 'Day-to-day business operations' },
  { value: 'Financial', icon: '💰', description: 'Financial and budgetary concerns' },
  { value: 'Technical', icon: '💻', description: 'Technology and infrastructure' },
  { value: 'Compliance', icon: '📋', description: 'Regulatory and policy compliance' },
  { value: 'Strategic', icon: '🎯', description: 'Long-term business objectives' },
  { value: 'Reputational', icon: '🤝', description: 'Public image and trust' },
] as const;

const COST_RANGES = [
  { value: 'LOW', label: '< $10,000', color: 'bg-green-500' },
  { value: 'MEDIUM', label: '$10,000 - $50,000', color: 'bg-yellow-500' },
  { value: 'HIGH', label: '$50,000 - $200,000', color: 'bg-orange-500' },
  { value: 'VERY_HIGH', label: '> $200,000', color: 'bg-red-500' },
];

const emptyMitigation: MitigationPriority = {
  risk: '',
  priority: 1,
  strategy: '',
  timeline: '',
  timeframe: 'IMMEDIATE',
  riskArea: '',
  successCriteria: '',
  resources: '',
  estimatedCost: '',
  responsibleParty: '',
};

export default function MitigationPriorities({ data, onChange }: FormComponentProps<MitigationPriority[]>) {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const addMitigation = () => {
    const newMitigation = { ...emptyMitigation };
    const newData = [...data, newMitigation];
    onChange(newData);
    setExpandedCards([...expandedCards, data.length]);
  };

  const removeMitigation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
    setExpandedCards(expandedCards.filter(i => i !== index));
  };

  const updateMitigation = (index: number, field: keyof MitigationPriority, value: string | number) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: value
    };
    onChange(newData);
  };

  const toggleCardExpansion = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const validateMitigation = (mitigation: MitigationPriority): string[] => {
    const errors: string[] = [];
    if (!mitigation.risk.trim()) errors.push('Risk description is required');
    if (!mitigation.strategy.trim()) errors.push('Mitigation strategy is required');
    if (!mitigation.riskArea) errors.push('Risk area is required');
    if (!mitigation.successCriteria.trim()) errors.push('Success criteria is required');
    return errors;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mitigation Priorities</h2>
          <p className="text-sm text-gray-500 mt-1">
            Define and prioritize risk mitigation strategies
          </p>
        </div>
        <Button onClick={addMitigation} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Mitigation</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">No Mitigation Priorities</h3>
            <p className="text-sm text-gray-500 mb-4">
              Start by adding your first mitigation priority
            </p>
            <Button onClick={addMitigation} variant="outline">
              Add Mitigation Priority
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((mitigation, index) => {
            const errors = validateMitigation(mitigation);
            const isExpanded = expandedCards.includes(index);
            const timeframe = TIME_FRAMES.find(t => t.value === mitigation.timeframe);
            
            return (
              <Card
                key={index}
                className={`border-l-4 ${
                  errors.length > 0 ? 'border-l-red-500' : 'border-l-primary'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">Priority {index + 1}</h3>
                          {mitigation.riskArea && (
                            <Badge variant="secondary">
                              {RISK_AREAS.find(r => r.value === mitigation.riskArea)?.icon}{' '}
                              {mitigation.riskArea}
                            </Badge>
                          )}
                          {timeframe && (
                            <Badge className={`${timeframe.color} text-white`}>
                              {timeframe.label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {mitigation.risk.slice(0, 100)}
                          {mitigation.risk.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCardExpansion(index)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-1" />
                        )}
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMitigation(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Risk Description */}
                        <div className="space-y-2">
                          <Label>Risk Description *</Label>
                          <Textarea
                            value={mitigation.risk}
                            onChange={(e: { target: { value: string | number; }; }) => updateMitigation(index, 'risk', e.target.value)}
                            placeholder="Describe the risk to be mitigated..."
                            className="min-h-[100px]"
                          />
                        </div>

                        {/* Mitigation Strategy */}
                        <div className="space-y-2">
                          <Label>Mitigation Strategy *</Label>
                          <Textarea
                            value={mitigation.strategy}
                            onChange={(e: { target: { value: string | number; }; }) => updateMitigation(index, 'strategy', e.target.value)}
                            placeholder="Describe how you plan to address this risk..."
                            className="min-h-[100px]"
                          />
                        </div>

                        {/* Risk Area */}
                        <div className="space-y-2">
                          <Label>Risk Area *</Label>
                          <Select
                            value={mitigation.riskArea}
                            onValueChange={(value) => updateMitigation(index, 'riskArea', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk area" />
                            </SelectTrigger>
                            <SelectContent>
                              {RISK_AREAS.map(({ value, icon, description }) => (
                                <SelectItem key={value} value={value}>
                                  <div className="flex items-center space-x-2">
                                    <span>{icon}</span>
                                    <span>{value}</span>
                                    <span className="text-gray-400 text-sm">
                                      - {description}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Implementation Timeframe */}
                        <div className="space-y-2">
                          <Label>Implementation Timeframe *</Label>
                          <Select
                            value={mitigation.timeframe}
                            onValueChange={(value) => updateMitigation(index, 'timeframe', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_FRAMES.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Priority Level */}
                        <div className="space-y-4">
                          <Label>
                            Priority Level: {mitigation.priority}
                          </Label>
                          <Slider
                            value={[mitigation.priority]}
                            onValueChange={([value]) => updateMitigation(index, 'priority', value)}
                            min={1}
                            max={5}
                            step={1}
                            className="py-4"
                          />
                        </div>

                        {/* Success Criteria */}
                        <div className="space-y-2">
                          <Label>Success Criteria *</Label>
                          <Textarea
                            value={mitigation.successCriteria}
                            onChange={(e: { target: { value: string | number; }; }) => updateMitigation(index, 'successCriteria', e.target.value)}
                            placeholder="Define measurable success criteria..."
                          />
                        </div>

                        {/* Bottom Row */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Resources */}
                          <div className="space-y-2">
                            <Label className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>Required Resources</span>
                            </Label>
                            <Input
                              value={mitigation.resources}
                              onChange={(e) => updateMitigation(index, 'resources', e.target.value)}
                              placeholder="List required resources..."
                            />
                          </div>

                          {/* Estimated Cost */}
                          <div className="space-y-2">
                            <Label className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4" />
                              <span>Estimated Cost</span>
                            </Label>
                            <Select
                              value={mitigation.estimatedCost}
                              onValueChange={(value) => updateMitigation(index, 'estimatedCost', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select cost range" />
                              </SelectTrigger>
                              <SelectContent>
                                {COST_RANGES.map(({ value, label }) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Responsible Party */}
                          <div className="space-y-2">
                            <Label className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>Responsible Party</span>
                            </Label>
                            <Input
                              value={mitigation.responsibleParty}
                              onChange={(e) => updateMitigation(index, 'responsibleParty', e.target.value)}
                              placeholder="Who will implement this?"
                            />
                          </div>
                        </div>
                      </div>

                      {errors.length > 0 && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex items-center space-x-2 text-red-600 mb-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-medium">Please address the following:</span>
                          </div>
                          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                            {errors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
