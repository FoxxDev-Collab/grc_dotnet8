/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { FormComponentProps, RiskProfile, RiskLevels } from '../types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MAX_BUSINESS_FUNCTIONS_LENGTH = 1000;
const MAX_KEY_ASSETS_LENGTH = 1000;

const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

const COMMON_DATA_TYPES = [
  {
    id: 'personal-info',
    label: 'Personal Information',
    description: 'Names, addresses, SSNs, etc.'
  },
  {
    id: 'financial-data',
    label: 'Financial Data',
    description: 'Payment info, bank details, etc.'
  },
  {
    id: 'health-records',
    label: 'Health Records',
    description: 'Medical history, treatments, etc.'
  },
  {
    id: 'intellectual-property',
    label: 'Intellectual Property',
    description: 'Patents, trade secrets, etc.'
  },
  {
    id: 'customer-data',
    label: 'Customer Data',
    description: 'Customer profiles, preferences, etc.'
  },
  {
    id: 'employee-data',
    label: 'Employee Data',
    description: 'HR records, performance data, etc.'
  },
  {
    id: 'operational-data',
    label: 'Operational Data',
    description: 'Business processes, procedures, etc.'
  },
] as const;

const COMMON_FRAMEWORKS = [
  {
    id: 'nist-800-53',
    label: 'NIST 800-53',
    description: 'Security and Privacy Controls for Information Systems'
  },
  {
    id: 'iso-27001',
    label: 'ISO 27001',
    description: 'Information Security Management System'
  },
  {
    id: 'hipaa',
    label: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act'
  },
  {
    id: 'pci-dss',
    label: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard'
  },
  {
    id: 'soc2',
    label: 'SOC 2',
    description: 'Service Organization Control 2'
  },
  {
    id: 'gdpr',
    label: 'GDPR',
    description: 'General Data Protection Regulation'
  },
  {
    id: 'cmmc',
    label: 'CMMC',
    description: 'Cybersecurity Maturity Model Certification'
  },
] as const;

type RiskProfileValue<K extends keyof RiskProfile> = RiskProfile[K];

export default function InitialRiskProfile({ data, onChange }: FormComponentProps<RiskProfile>) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: keyof RiskProfile, value: any): string => {
    switch (field) {
      case 'businessFunctions':
        if (!value?.trim()) return 'Business functions are required';
        if (value.length > MAX_BUSINESS_FUNCTIONS_LENGTH) 
          return `Cannot exceed ${MAX_BUSINESS_FUNCTIONS_LENGTH} characters`;
        return '';
      case 'keyAssets':
        if (!value?.trim()) return 'Key assets are required';
        if (value.length > MAX_KEY_ASSETS_LENGTH) 
          return `Cannot exceed ${MAX_KEY_ASSETS_LENGTH} characters`;
        return '';
      case 'complianceFrameworks':
        return value.length === 0 ? 'At least one compliance framework is required' : '';
      case 'dataTypes':
        return value.length === 0 ? 'At least one data type is required' : '';
      default:
        return '';
    }
  };

  const handleChange = <K extends keyof RiskProfile>(
    field: K,
    value: RiskProfileValue<K>
  ) => {
    const newData = {
      ...data,
      [field]: value
    };
    
    // Validate if field has been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
    
    onChange(newData);
  };

  const handleBlur = (field: keyof RiskProfile) => {
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }));
      const error = validateField(field, data[field]);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const toggleFramework = (framework: string) => {
    const frameworks = data.complianceFrameworks.includes(framework)
      ? data.complianceFrameworks.filter(f => f !== framework)
      : [...data.complianceFrameworks, framework];
    handleChange('complianceFrameworks', frameworks);
  };

  const toggleDataType = (dataType: string) => {
    const dataTypes = data.dataTypes.includes(dataType)
      ? data.dataTypes.filter(t => t !== dataType)
      : [...data.dataTypes, dataType];
    handleChange('dataTypes', dataTypes);
  };

  const handleRiskLevelChange = (key: keyof RiskLevels, value: string) => {
    handleChange('riskLevels', {
      ...data.riskLevels,
      [key]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Business Functions */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessFunctions">
            Business Functions *
            <span className="text-sm text-gray-500 ml-2">
              ({data.businessFunctions.length}/{MAX_BUSINESS_FUNCTIONS_LENGTH})
            </span>
          </Label>
          <Textarea
            id="businessFunctions"
            value={data.businessFunctions}
            onChange={(e: { target: { value: string; }; }) => handleChange('businessFunctions', e.target.value)}
            onBlur={() => handleBlur('businessFunctions')}
            className={errors.businessFunctions ? 'border-red-500' : ''}
            maxLength={MAX_BUSINESS_FUNCTIONS_LENGTH}
            placeholder="Describe your organization's main business functions, operations, and key processes..."
          />
          {errors.businessFunctions && (
            <p className="text-sm text-red-500">{errors.businessFunctions}</p>
          )}
        </div>

        {/* Key Assets */}
        <div className="space-y-2">
          <Label htmlFor="keyAssets">
            Key Assets *
            <span className="text-sm text-gray-500 ml-2">
              ({data.keyAssets.length}/{MAX_KEY_ASSETS_LENGTH})
            </span>
          </Label>
          <Textarea
            id="keyAssets"
            value={data.keyAssets}
            onChange={(e: { target: { value: string; }; }) => handleChange('keyAssets', e.target.value)}
            onBlur={() => handleBlur('keyAssets')}
            className={errors.keyAssets ? 'border-red-500' : ''}
            maxLength={MAX_KEY_ASSETS_LENGTH}
            placeholder="List your organization's key assets, including systems, data, and infrastructure..."
          />
          {errors.keyAssets && (
            <p className="text-sm text-red-500">{errors.keyAssets}</p>
          )}
        </div>
      </div>

      {/* Compliance Frameworks */}
      <div className="space-y-4">
        <Label className="text-base">
          Compliance Frameworks *
          <span className="block text-sm font-normal text-gray-500 mt-1">
            Select all frameworks that apply to your organization
          </span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMON_FRAMEWORKS.map(({ id, label, description }) => (
            <Card
              key={id}
              className={`cursor-pointer transition-colors ${
                data.complianceFrameworks.includes(label)
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleFramework(label)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={`framework-${id}`}
                    checked={data.complianceFrameworks.includes(label)}
                    onCheckedChange={() => toggleFramework(label)}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor={`framework-${id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {label}
                    </Label>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {errors.complianceFrameworks && (
          <p className="text-sm text-red-500">{errors.complianceFrameworks}</p>
        )}
      </div>

      {/* Data Types */}
      <div className="space-y-4">
        <Label className="text-base">
          Data Types *
          <span className="block text-sm font-normal text-gray-500 mt-1">
            Select all types of data your organization handles
          </span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMON_DATA_TYPES.map(({ id, label, description }) => (
            <Card
              key={id}
              className={`cursor-pointer transition-colors ${
                data.dataTypes.includes(label)
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleDataType(label)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={`datatype-${id}`}
                    checked={data.dataTypes.includes(label)}
                    onCheckedChange={() => toggleDataType(label)}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor={`datatype-${id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {label}
                    </Label>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {errors.dataTypes && (
          <p className="text-sm text-red-500">{errors.dataTypes}</p>
        )}
      </div>

      {/* Risk Levels */}
      <div className="space-y-4">
        <Label className="text-base">
          Risk Levels
          <span className="block text-sm font-normal text-gray-500 mt-1">
            Assess the risk level for each category
          </span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(data.riskLevels).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-sm font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)} Risk
              </Label>
              <Select
                value={value}
                onValueChange={(newValue) => 
                  handleRiskLevelChange(key as keyof RiskLevels, newValue)
                }
              >
                <SelectTrigger id={key} className="w-full">
                  <SelectValue placeholder="Select Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  {RISK_LEVELS.map((level) => (
                    <SelectItem
                      key={level}
                      value={level}
                      className="flex items-center space-x-2"
                    >
                      <Badge 
                        variant={level === 'LOW' ? 'default' :
                                level === 'MEDIUM' ? 'secondary' :
                                level === 'HIGH' ? 'warning' : 'destructive'}
                      >
                        {level}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}