'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Organization, RiskLevel, UpdateRiskProfileDto } from '@/types/organizations'
import { OrganizationsApi } from '@/lib/api/organizations'
import { RiskProfilesApi } from '@/lib/api/risk-profiles';
import RiskTypes from '../../components/RiskTypes';

interface RiskProfileFormData extends UpdateRiskProfileDto {
  id?: string;
  businessFunctions: string;
  keyAssets: string;
  complianceFrameworks: string[];
  operationalRisk: RiskLevel;
  dataSecurityRisk: RiskLevel;
  complianceRisk: RiskLevel;
  financialRisk: RiskLevel;
  dataTypes: string[];
}

interface EditRiskProfilePageProps {
  params: {
    organizationId: string;
  };
}

export default function EditRiskProfilePage({ params }: EditRiskProfilePageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<RiskProfileFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFramework, setNewFramework] = useState('');
  const [newDataType, setNewDataType] = useState('');

  // Fetch organization data when component mounts
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await OrganizationsApi.getById(params.organizationId);
        if (response.error) {
          throw new Error(response.error);
        }
        if (!response.data) {
          throw new Error('Invalid response from server');
        }

        const org = response.data;
        setOrganization(org);
        
        // Initialize form data with current risk profile or empty values
        setFormData(org.riskProfile ? {
          id: org.riskProfile.id, // Preserve the ID
          businessFunctions: org.riskProfile.businessFunctions,
          keyAssets: org.riskProfile.keyAssets,
          complianceFrameworks: [...org.riskProfile.complianceFrameworks],
          operationalRisk: org.riskProfile.operationalRisk,
          dataSecurityRisk: org.riskProfile.dataSecurityRisk,
          complianceRisk: org.riskProfile.complianceRisk,
          financialRisk: org.riskProfile.financialRisk,
          dataTypes: [...org.riskProfile.dataTypes],
        } : {
          businessFunctions: '',
          keyAssets: '',
          complianceFrameworks: [],
          operationalRisk: RiskLevel.LOW,
          dataSecurityRisk: RiskLevel.LOW,
          complianceRisk: RiskLevel.LOW,
          financialRisk: RiskLevel.LOW,
          dataTypes: [],
        });
      } catch (err) {
        console.error('Failed to fetch organization:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch organization');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [params.organizationId]);

  if (isLoading || !organization || !formData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  const handleRiskChange = (name: string, value: RiskLevel) => {
    setFormData((prev) => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  const handleAddFramework = () => {
    if (!newFramework.trim() || !formData) return;
    
    setFormData({
      ...formData,
      complianceFrameworks: [...formData.complianceFrameworks, newFramework.trim()]
    });
    setNewFramework('');
  };

  const handleRemoveFramework = (framework: string) => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      complianceFrameworks: formData.complianceFrameworks.filter(f => f !== framework)
    });
  };

  const handleAddDataType = () => {
    if (!newDataType.trim() || !formData) return;
    
    setFormData({
      ...formData,
      dataTypes: [...formData.dataTypes, newDataType.trim()]
    });
    setNewDataType('');
  };

  const handleRemoveDataType = (dataType: string) => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      dataTypes: formData.dataTypes.filter(d => d !== dataType)
    });
  };

  const handleSubmit = async () => {
    if (!formData || !organization.riskProfile?.id) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await RiskProfilesApi.update(organization.riskProfile.id, {
        businessFunctions: formData.businessFunctions || '',
        keyAssets: formData.keyAssets || '',
        complianceFrameworks: formData.complianceFrameworks || [],
        dataTypes: formData.dataTypes || [],
        operationalRisk: formData.operationalRisk || RiskLevel.LOW,
        dataSecurityRisk: formData.dataSecurityRisk || RiskLevel.LOW,
        complianceRisk: formData.complianceRisk || RiskLevel.LOW,
        financialRisk: formData.financialRisk || RiskLevel.LOW,
      });

      // First check for API error
      if (response.error) {
        throw new Error(response.error);
      }

      // Then check for response data
      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Successfully updated, navigate back to organization page
      router.push(`/organization/${organization.id}`);
    } catch (err) {
      console.error('Failed to update risk profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update risk profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/organization/${organization.id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Edit Risk Profile - {organization.name}</CardTitle>
            <div className="space-x-2">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="businessFunctions">Business Functions</Label>
            <Input
              id="businessFunctions"
              name="businessFunctions"
              value={formData.businessFunctions}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyAssets">Key Assets</Label>
            <Input
              id="keyAssets"
              name="keyAssets"
              value={formData.keyAssets}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Compliance Frameworks</Label>
            <div className="flex gap-2">
              <Input
                value={newFramework}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFramework(e.target.value)}
                placeholder="Add framework"
              />
              <Button onClick={handleAddFramework} type="button">
                Add
              </Button>
            </div>
            {formData.complianceFrameworks.map((framework, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1">{framework}</span>
                <Button
                  onClick={() => handleRemoveFramework(framework)}
                  variant="ghost"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Data Types</Label>
            <div className="flex gap-2">
              <Input
                value={newDataType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDataType(e.target.value)}
                placeholder="Add data type"
              />
              <Button onClick={handleAddDataType} type="button">
                Add
              </Button>
            </div>
            {formData.dataTypes.map((dataType, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1">{dataType}</span>
                <Button
                  onClick={() => handleRemoveDataType(dataType)}
                  variant="ghost"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <RiskTypes
            isEditing={true}
            riskData={formData}
            onRiskChange={handleRiskChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
