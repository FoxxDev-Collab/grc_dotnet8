import React from 'react';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Shield, FileText, DollarSign } from 'lucide-react';
import { RiskLevel } from '@/types/organizations';

interface RiskTypesProps {
  isEditing: boolean;
  riskData: {
    operationalRisk?: RiskLevel;
    dataSecurityRisk?: RiskLevel;
    complianceRisk?: RiskLevel;
    financialRisk?: RiskLevel;
  };
  onRiskChange?: (name: string, value: RiskLevel) => void;
}

type RiskTypeConfig = {
  id: keyof RiskTypesProps['riskData'];
  icon: React.ElementType;
  label: string;
};

// Define risk types configuration for consistent usage
const RISK_TYPES: RiskTypeConfig[] = [
  { id: 'operationalRisk', icon: AlertTriangle, label: 'Operational Risk' },
  { id: 'dataSecurityRisk', icon: Shield, label: 'Data Security Risk' },
  { id: 'complianceRisk', icon: FileText, label: 'Compliance Risk' },
  { id: 'financialRisk', icon: DollarSign, label: 'Financial Risk' }
];

// Helper function to determine risk level color
const getRiskLevelColor = (level?: RiskLevel): string => {
  if (!level) return 'text-gray-600';
  
  const colors: Record<RiskLevel, string> = {
    [RiskLevel.LOW]: 'text-green-600',
    [RiskLevel.MEDIUM]: 'text-yellow-600',
    [RiskLevel.HIGH]: 'text-orange-600',
    [RiskLevel.CRITICAL]: 'text-red-600',
  };
  return colors[level] || 'text-gray-600';
};

export default function RiskTypes({ isEditing, riskData, onRiskChange }: RiskTypesProps) {
  if (isEditing) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {RISK_TYPES.map(({ id, icon: Icon, label }) => (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="flex items-center gap-2 text-sm">
              <Icon className="w-4 h-4 text-gray-600" />
              {label}
            </Label>
            <select
              id={id}
              name={id}
              value={riskData[id] || RiskLevel.LOW}
              onChange={(e) => onRiskChange?.(id, e.target.value as RiskLevel)}
              className="w-full border rounded-md p-2 text-sm bg-white"
            >
              {Object.values(RiskLevel).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {RISK_TYPES.map(({ id, icon: Icon, label }) => (
        <div key={id} className="space-y-1">
          <Label className="flex items-center gap-2 text-xs">
            <Icon className="w-4 h-4 text-gray-600" />
            {label}
          </Label>
          <p className={`text-sm font-medium ${getRiskLevelColor(riskData[id])}`}>
            {riskData[id] || 'Not set'}
          </p>
        </div>
      ))}
    </div>
  );
}
