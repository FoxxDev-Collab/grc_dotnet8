'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Organization, RiskLevel } from '@/types/organizations';
import RiskTypes from './RiskTypes';

interface RiskProfileCardProps {
  organization: Organization;
  onUpdate: (updatedOrg: Organization) => void;
}

export default function RiskProfileCard({ organization }: RiskProfileCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/organization/${organization.id}/risk-profile/edit`);
  };

  // Ensure we have a risk profile object even if it's undefined
  const riskProfile = organization.riskProfile || {
    id: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    businessFunctions: 'Not specified',
    keyAssets: 'Not specified',
    complianceFrameworks: [],
    dataTypes: [],
    operationalRisk: RiskLevel.LOW,
    dataSecurityRisk: RiskLevel.LOW,
    complianceRisk: RiskLevel.LOW,
    financialRisk: RiskLevel.LOW
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Risk Profile</CardTitle>
          <Button onClick={handleEdit} variant="outline">
            Edit
          </Button>
        </div>
        <CardDescription>Organization risk profile and key assets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Business Functions</Label>
          <p className="text-sm text-gray-600">{riskProfile.businessFunctions}</p>
        </div>
        <div>
          <Label>Key Assets</Label>
          <p className="text-sm text-gray-600">{riskProfile.keyAssets}</p>
        </div>
        <div>
          <Label>Compliance Frameworks</Label>
          {riskProfile.complianceFrameworks?.length ? (
            <ul className="list-disc list-inside text-sm text-gray-600">
              {riskProfile.complianceFrameworks.map((framework: string, i: number) => (
                <li key={i}>{framework}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No frameworks specified</p>
          )}
        </div>
        <div>
          <Label>Data Types</Label>
          {riskProfile.dataTypes?.length ? (
            <ul className="list-disc list-inside text-sm text-gray-600">
              {riskProfile.dataTypes.map((type: string, i: number) => (
                <li key={i}>{type}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No data types specified</p>
          )}
        </div>
        
        <RiskTypes
          isEditing={false}
          riskData={{
            operationalRisk: riskProfile.operationalRisk,
            dataSecurityRisk: riskProfile.dataSecurityRisk,
            complianceRisk: riskProfile.complianceRisk,
            financialRisk: riskProfile.financialRisk
          }}
        />
      </CardContent>
    </Card>
  );
}
