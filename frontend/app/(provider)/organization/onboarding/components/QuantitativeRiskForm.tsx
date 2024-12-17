'use client';

import { FormComponentProps, QuantitativeRisk } from '../types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: '#22c55e',     // green-500
  MODERATE: '#eab308', // yellow-500
  HIGH: '#ef4444',    // red-500
  SEVERE: '#7f1d1d'   // red-900
};

const PREDEFINED_AMOUNTS = [
  { value: 10000, label: '$10,000' },
  { value: 50000, label: '$50,000' },
  { value: 100000, label: '$100,000' },
  { value: 500000, label: '$500,000' },
  { value: 1000000, label: '$1,000,000' },
  { value: 5000000, label: '$5,000,000' },
  { value: 10000000, label: '$10,000,000' },
];

export default function QuantitativeRiskForm({ data, onChange }: FormComponentProps<QuantitativeRisk>) {
  const handleChange = (field: keyof QuantitativeRisk, value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const newData = {
      ...data,
      [field]: numValue
    };

    if (field === 'annualLoss' || field === 'probabilityOfOccurrence') {
      newData.riskScore = calculateRiskScore(
        field === 'annualLoss' ? numValue : data.annualLoss,
        field === 'probabilityOfOccurrence' ? numValue : data.probabilityOfOccurrence,
        data.impactScore
      );
    }

    if (field === 'impactScore') {
      newData.riskScore = calculateRiskScore(
        data.annualLoss,
        data.probabilityOfOccurrence,
        numValue
      );
    }

    onChange(newData);
  };

  const calculateRiskScore = (
    annualLoss: number,
    probability: number,
    impact: number
  ): number => {
    return annualLoss * probability * impact;
  };

  const getRiskLevel = (score: number): RiskLevel => {
    if (!data.annualLoss) return 'LOW';
    const normalizedScore = score / data.annualLoss;
    if (normalizedScore <= 2.5) return 'LOW';
    if (normalizedScore <= 5) return 'MODERATE';
    if (normalizedScore <= 7.5) return 'HIGH';
    return 'SEVERE';
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare data for the risk distribution chart
  const riskData = [
    {
      name: 'Risk Score',
      value: data.riskScore || 0,
      color: RISK_COLORS[getRiskLevel(data.riskScore || 0)]
    },
    {
      name: 'Remaining',
      value: Math.max(0, (data.annualLoss || 0) - (data.riskScore || 0)),
      color: '#e5e7eb' // gray-200
    }
  ];

  const calculateRiskRatio = (): string => {
    if (!data.annualLoss || !data.riskScore) return '0.0';
    return ((data.riskScore / data.annualLoss) * 100).toFixed(1);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Annual Loss Expectancy */}
            <div className="space-y-2">
              <Label htmlFor="annualLoss">Annual Loss Expectancy (ALE) *</Label>
              <Select
                value={data.annualLoss?.toString() || ''}
                onValueChange={(value) => handleChange('annualLoss', parseFloat(value))}
              >
                <SelectTrigger id="annualLoss">
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_AMOUNTS.map(({ value, label }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Estimated annual financial loss if the risk materializes
              </p>
            </div>

            {/* Probability Slider */}
            <div className="space-y-4">
              <Label>
                Probability of Occurrence: {((data.probabilityOfOccurrence || 0) * 100).toFixed(0)}%
              </Label>
              <Slider
                id="probabilitySlider"
                min={0}
                max={100}
                step={1}
                value={[(data.probabilityOfOccurrence || 0) * 100]}
                onValueChange={(value) => handleChange('probabilityOfOccurrence', value[0] / 100)}
                className="py-4"
              />
              <p className="text-sm text-gray-500">
                Likelihood of the risk occurring
              </p>
            </div>

            {/* Impact Score Slider */}
            <div className="space-y-4">
              <Label>
                Impact Score: {(data.impactScore || 0).toFixed(0)}/10
              </Label>
              <Slider
                id="impactSlider"
                min={1}
                max={10}
                step={1}
                value={[data.impactScore || 1]}
                onValueChange={(value) => handleChange('impactScore', value[0])}
                className="py-4"
              />
              <p className="text-sm text-gray-500">
                Severity of impact on business operations
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Risk Score Display */}
            <div className="text-center mb-6">
              <div className="text-3xl font-bold" style={{ color: RISK_COLORS[getRiskLevel(data.riskScore || 0)] }}>
                {formatCurrency(data.riskScore || 0)}
              </div>
              <div className="text-sm font-medium mt-1" style={{ color: RISK_COLORS[getRiskLevel(data.riskScore || 0)] }}>
                {getRiskLevel(data.riskScore || 0)} RISK
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Based on ALE × Probability × Impact
              </p>
            </div>

            {/* Risk Distribution Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Metrics */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">Risk Ratio</div>
                <div className="text-lg font-semibold">
                  {calculateRiskRatio()}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">Confidence</div>
                <div className="text-lg font-semibold">
                  {((data.probabilityOfOccurrence || 0) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
