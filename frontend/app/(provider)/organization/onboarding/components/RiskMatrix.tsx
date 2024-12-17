'use client';

import { useState } from 'react';
import { FormComponentProps, RiskMatrixEntry } from '../types';
import { Label } from '@/components/ui/label';

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

export default function RiskMatrix({ data, onChange }: FormComponentProps<RiskMatrixEntry[]>) {
  const [touched, setTouched] = useState(false);

  const getExistingEntry = (impact: number, likelihood: number): RiskMatrixEntry | undefined => {
    return data.find(entry => entry.impact === impact && entry.likelihood === likelihood);
  };

  const handleCellClick = (impact: number, likelihood: number) => {
    setTouched(true);
    const existingEntry = getExistingEntry(impact, likelihood);
    
    if (existingEntry) {
      // Remove the entry if it exists
      onChange(data.filter(entry => entry !== existingEntry));
    } else {
      // Add new entry
      const value = (impact + 1) * (likelihood + 1);
      onChange([...data, { impact, likelihood, value }]);
    }
  };

  const getError = (): string => {
    if (!touched) return '';
    return data.length === 0 ? 'Please identify at least one risk in the matrix' : '';
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg">Risk Assessment Matrix</Label>
        <p className="text-sm text-gray-500 mt-1">
          Click cells to identify risks based on their impact and likelihood
        </p>
      </div>

      {/* Matrix Grid */}
      <div className="relative overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Likelihood Labels (Y-axis) */}
          <div className="absolute left-0 top-0 bottom-0 w-32 flex flex-col justify-center">
            <div className="h-8" /> {/* Spacer for impact labels */}
            {LIKELIHOOD_LEVELS.map(({ label }, index) => (
              <div
                key={index}
                className="h-16 flex items-center justify-end pr-4 text-sm font-medium"
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
                        className={`
                          w-full h-16 border-r border-b flex items-center justify-center
                          transition-colors relative group
                          ${entry ? getRiskColor(value) : 'bg-gray-50 hover:bg-gray-100'}
                          ${entry ? 'text-white' : 'text-gray-700'}
                        `}
                      >
                        {entry && (
                          <>
                            <span className="font-medium">{value}</span>
                            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50">
                              Click to remove
                            </span>
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
        {data.length === 0 ? (
          <p className="text-sm text-gray-500">No risks identified yet</p>
        ) : (
          <div className="space-y-2">
            {data.map((entry, index) => (
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
                  <button
                    onClick={() => handleCellClick(entry.impact, entry.likelihood)}
                    className="p-1 hover:bg-black/20 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {getError() && (
        <p className="text-sm text-red-500 mt-2">{getError()}</p>
      )}
    </div>
  );
}
