'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Label } from '../../../../../components/ui/label';
import { Edit2, Save, X } from 'lucide-react';
import { Organization, RiskMatrixEntry, UpdateOrganizationDto } from '../../../../../types/organizations';
import { OrganizationsApi } from '../../../../../lib/api/organizations';

interface RiskMatrixCardProps {
  organization: Organization;
  onUpdate: (updatedOrg: Organization) => void;
}

const IMPACT_LEVELS = [
  { value: 4, label: 'Critical' },
  { value: 3, label: 'High' },
  { value: 2, label: 'Medium' },
  { value: 1, label: 'Low' },
  { value: 0, label: 'Negligible' },
];

const LIKELIHOOD_LEVELS = [
  { value: 4, label: 'Almost Certain' },
  { value: 3, label: 'Likely' },
  { value: 2, label: 'Possible' },
  { value: 1, label: 'Unlikely' },
  { value: 0, label: 'Rare' },
];

const getRiskColor = (value: number): string => {
  if (value >= 12) return 'bg-red-500 hover:bg-red-600';
  if (value >= 8) return 'bg-orange-500 hover:bg-orange-600';
  if (value >= 4) return 'bg-yellow-500 hover:bg-yellow-600';
  return 'bg-green-500 hover:bg-green-600';
};

const getRiskLabel = (value: number): string => {
  if (value >= 12) return 'Critical';
  if (value >= 8) return 'High';
  if (value >= 4) return 'Medium';
  return 'Low';
};

export default function RiskMatrixCard({ organization, onUpdate }: RiskMatrixCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RiskMatrixEntry[]>(
    organization.riskMatrix || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getExistingEntry = (impact: number, likelihood: number): RiskMatrixEntry | undefined => {
    return formData.find(entry => entry.impact === impact && entry.likelihood === likelihood);
  };

  const handleCellClick = (impact: number, likelihood: number) => {
    if (!isEditing) return;
    
    const existingEntry = getExistingEntry(impact, likelihood);
    
    if (existingEntry) {
      // Remove the entry if it exists
      setFormData(formData.filter(entry => entry !== existingEntry));
    } else {
      // Add new entry
      const value = (impact + 1) * (likelihood + 1);
      setFormData([...formData, { impact, likelihood, value }]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create a proper update DTO that matches the backend expectations
      const updateDto: UpdateOrganizationDto = {
        riskMatrix: formData.map(entry => ({
          impact: entry.impact,
          likelihood: entry.likelihood,
          value: entry.value
        }))
      };

      const response = await OrganizationsApi.update(organization.id, updateDto);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Pass the organization data to the onUpdate callback
      onUpdate(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update risk matrix:', err);
      setError(err instanceof Error ? err.message : 'Failed to update risk matrix');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(organization.riskMatrix || []);
    setError(null);
    setIsEditing(false);
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Risk Assessment Matrix</CardTitle>
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
          <div>
            <Label className="text-lg">Risk Assessment Matrix</Label>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing 
                ? 'Click cells to identify risks based on their impact and likelihood'
                : 'View current risk assessment based on impact and likelihood'
              }
            </p>
          </div>

          {/* Matrix Grid */}
          <div className="relative overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Likelihood Labels (Y-axis) */}
              <div className="absolute left-0 top-0 bottom-0 w-32 flex flex-col justify-center">
                <div className="h-8" /> {/* Spacer for impact labels */}
                {LIKELIHOOD_LEVELS.map(({ label }, index) => (
                  <div
                    key={index}
                    className="h-20 flex items-center justify-end pr-4 text-sm font-medium"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Matrix Content */}
              <div className="ml-32">
                {/* Impact Labels (X-axis) */}
                <div className="h-8 flex">
                  {IMPACT_LEVELS.map(({ label }, index) => (
                    <div
                      key={index}
                      className="flex-1 flex items-center justify-center text-sm font-medium"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Matrix Cells */}
                <div className="border-t border-l">
                  {LIKELIHOOD_LEVELS.map((likelihood, y) => (
                    <div key={y} className="flex">
                      {IMPACT_LEVELS.map((impact, x) => {
                        const entry = getExistingEntry(impact.value, likelihood.value);
                        const value = (impact.value + 1) * (likelihood.value + 1);
                        return (
                          <button
                            key={`${x}-${y}`}
                            onClick={() => handleCellClick(impact.value, likelihood.value)}
                            disabled={!isEditing}
                            className={`
                              w-full h-20 border-r border-b flex items-center justify-center
                              transition-colors relative group
                              ${entry ? getRiskColor(value) : 'bg-gray-50 hover:bg-gray-100'}
                              ${entry ? 'text-white' : 'text-gray-700'}
                              ${!isEditing && 'cursor-default'}
                            `}
                          >
                            {entry && (
                              <>
                                <span className="font-medium text-lg">{value}</span>
                                {isEditing && (
                                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50">
                                    Click to remove
                                  </span>
                                )}
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Risks Summary */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">Selected Risks</h3>
            {formData.length === 0 ? (
              <p className="text-sm text-gray-500">No risks identified yet</p>
            ) : (
              <div className="space-y-2">
                {formData.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-white ${getRiskColor(entry.value)}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">
                          {IMPACT_LEVELS[4 - entry.impact].label} Impact × {LIKELIHOOD_LEVELS[4 - entry.likelihood].label} Likelihood
                        </span>
                        <p className="text-sm opacity-90">
                          Risk Score: {entry.value} ({getRiskLabel(entry.value)})
                        </p>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleCellClick(entry.impact, entry.likelihood)}
                          className="p-1 hover:bg-black/20 rounded"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
