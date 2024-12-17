'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Badge } from '../../../../../components/ui/badge';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { Organization, MitigationPriority, TimeFrame, UpdateOrganizationDto } from '../../../../../types/organizations';
import { OrganizationsApi } from '../../../../../lib/api/organizations';

interface MitigationPrioritiesCardProps {
  organization: Organization;
  onUpdate: (updatedOrg: Organization) => void;
}

const emptyMitigationPriority: MitigationPriority = {
  risk: '',
  priority: 1,
  strategy: '',
  timeline: '',
  timeframe: TimeFrame.MEDIUM_TERM,
  riskArea: '',
  successCriteria: '',
  resources: '',
  estimatedCost: '',
  responsibleParty: '',
};

export default function MitigationPrioritiesCard({ organization, onUpdate }: MitigationPrioritiesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MitigationPriority[]>(
    organization.mitigationPriorities || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (index: number, field: keyof MitigationPriority, value: string | number | TimeFrame) => {
    const newPriorities = [...formData];
    newPriorities[index] = {
      ...newPriorities[index],
      [field]: value
    };
    setFormData(newPriorities);
  };

  const handleAddPriority = () => {
    setFormData([...formData, { ...emptyMitigationPriority }]);
  };

  const handleRemovePriority = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create a proper update DTO that matches the backend expectations
      const updateDto: UpdateOrganizationDto = {
        mitigationPriorities: formData.map(priority => ({
          risk: priority.risk,
          priority: priority.priority,
          strategy: priority.strategy,
          timeline: priority.timeline,
          timeframe: priority.timeframe,
          riskArea: priority.riskArea,
          successCriteria: priority.successCriteria,
          resources: priority.resources,
          estimatedCost: priority.estimatedCost,
          responsibleParty: priority.responsibleParty,
        }))
      };

      const response = await OrganizationsApi.update(organization.id, updateDto);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      onUpdate(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update mitigation priorities:', err);
      setError(err instanceof Error ? err.message : 'Failed to update mitigation priorities');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(organization.mitigationPriorities || []);
    setError(null);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Mitigation Priorities</CardTitle>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSubmit}
              className="h-8 w-8"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {formData.map((priority, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-2">
                {isEditing ? (
                  <div className="flex items-center justify-between">
                    <Input
                      value={priority.risk}
                      onChange={(e) => handleInputChange(index, 'risk', e.target.value)}
                      placeholder="Risk"
                      className="font-medium text-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePriority(index)}
                      className="h-8 w-8 ml-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg">{priority.risk}</h3>
                    <Badge variant="outline">{priority.timeframe}</Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent className="grid gap-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Priority Level</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={priority.priority}
                          onChange={(e) => handleInputChange(index, 'priority', parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Timeframe</Label>
                        <select
                          value={priority.timeframe}
                          onChange={(e) => handleInputChange(index, 'timeframe', e.target.value as TimeFrame)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {Object.values(TimeFrame).map((timeframe) => (
                            <option key={timeframe} value={timeframe}>
                              {timeframe.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label>Strategy</Label>
                      <Input
                        value={priority.strategy}
                        onChange={(e) => handleInputChange(index, 'strategy', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Timeline</Label>
                      <Input
                        value={priority.timeline}
                        onChange={(e) => handleInputChange(index, 'timeline', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Risk Area</Label>
                      <Input
                        value={priority.riskArea}
                        onChange={(e) => handleInputChange(index, 'riskArea', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Success Criteria</Label>
                      <Input
                        value={priority.successCriteria}
                        onChange={(e) => handleInputChange(index, 'successCriteria', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Resources</Label>
                      <Input
                        value={priority.resources}
                        onChange={(e) => handleInputChange(index, 'resources', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Estimated Cost</Label>
                      <Input
                        value={priority.estimatedCost}
                        onChange={(e) => handleInputChange(index, 'estimatedCost', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Responsible Party</Label>
                      <Input
                        value={priority.responsibleParty}
                        onChange={(e) => handleInputChange(index, 'responsibleParty', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : (
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Priority Level:</span>
                      <span>{priority.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Strategy:</span>
                      <span>{priority.strategy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Timeline:</span>
                      <span>{priority.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Risk Area:</span>
                      <span>{priority.riskArea}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Success Criteria:</span>
                      <span>{priority.successCriteria}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Resources:</span>
                      <span>{priority.resources}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Estimated Cost:</span>
                      <span>{priority.estimatedCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Responsible Party:</span>
                      <span>{priority.responsibleParty}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {isEditing && (
            <Button
              onClick={handleAddPriority}
              variant="outline"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Mitigation Priority
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
