/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import BasicInfoForm from './components/BasicInfoForm';
import InitialRiskProfile from './components/InitialRiskProfile';
import MitigationPriorities from './components/MitigationPriorities';
import RiskMatrix from './components/RiskMatrix';
import QuantitativeRiskForm from './components/QuantitativeRiskForm';
import { OnboardingData, BasicInfoFormData, RiskProfile, QuantitativeRisk, RiskMatrixEntry, MitigationPriority } from './types';
import { useOrganizationStore } from '../../../../stores/useOrganizationStore';
import { OrganizationsApi } from '../../../../lib/api/organizations';
import { CreateOrganizationDto, RiskLevel, TimeFrame } from '../../../../types/organizations';
import { OrgType } from '../../../../types/organizations';

const initialData: OnboardingData = {
  basicInfo: {
    name: '',
    website: '',
    industry: '',
    yearFounded: '',
    totalEmployees: '',
    annualRevenue: '',
    marketValue: '',
    description: '',
  },
  contact: {
    primaryContact: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  },
  riskProfile: {
    businessFunctions: '',
    keyAssets: '',
    complianceFrameworks: [],
    riskLevels: {
      operational: '',
      dataSecurity: '',
      compliance: '',
      financial: '',
    },
    dataTypes: [],
  },
  quantitativeRisk: {
    annualLoss: 0,
    probabilityOfOccurrence: 0,
    impactScore: 0,
    riskScore: 0,
  },
  riskMatrix: [],
  systems: [],
  mitigation: [],
};

type StepData = 
  | { type: 'basic-info'; data: BasicInfoFormData }
  | { type: 'risk-profile'; data: RiskProfile }
  | { type: 'quantitative-risk'; data: QuantitativeRisk }
  | { type: 'risk-matrix'; data: RiskMatrixEntry[] }
  | { type: 'mitigation'; data: MitigationPriority[] };

interface StepConfig {
  id: string;
  name: string;
  shortName: string;
  component: React.ComponentType<any>;
  getData: (data: OnboardingData) => StepData;
  mergeData: (data: OnboardingData, stepData: any) => OnboardingData;
}

const steps: StepConfig[] = [
  {
    id: 'basic-info',
    name: 'Basic Info',
    shortName: 'Info',
    component: BasicInfoForm,
    getData: (data: OnboardingData) => ({
      type: 'basic-info',
      data: {
        basicInfo: data.basicInfo,
        contact: data.contact,
      }
    }),
    mergeData: (data: OnboardingData, stepData: BasicInfoFormData) => ({
      ...data,
      basicInfo: stepData.basicInfo,
      contact: stepData.contact,
    }),
  },
  {
    id: 'risk-profile',
    name: 'Risk Profile',
    shortName: 'Profile',
    component: InitialRiskProfile,
    getData: (data: OnboardingData) => ({
      type: 'risk-profile',
      data: data.riskProfile
    }),
    mergeData: (data: OnboardingData, stepData: RiskProfile) => ({
      ...data,
      riskProfile: stepData,
    }),
  },
  {
    id: 'quantitative-risk',
    name: 'Risk Assessment',
    shortName: 'Assessment',
    component: QuantitativeRiskForm,
    getData: (data: OnboardingData) => ({
      type: 'quantitative-risk',
      data: data.quantitativeRisk
    }),
    mergeData: (data: OnboardingData, stepData: QuantitativeRisk) => ({
      ...data,
      quantitativeRisk: stepData,
    }),
  },
  {
    id: 'risk-matrix',
    name: 'Risk Matrix',
    shortName: 'Matrix',
    component: RiskMatrix,
    getData: (data: OnboardingData) => ({
      type: 'risk-matrix',
      data: data.riskMatrix
    }),
    mergeData: (data: OnboardingData, stepData: RiskMatrixEntry[]) => ({
      ...data,
      riskMatrix: stepData,
    }),
  },
  {
    id: 'mitigation',
    name: 'Mitigation',
    shortName: 'Mitigation',
    component: MitigationPriorities,
    getData: (data: OnboardingData) => ({
      type: 'mitigation',
      data: data.mitigation
    }),
    mergeData: (data: OnboardingData, stepData: MitigationPriority[]) => ({
      ...data,
      mitigation: stepData,
    }),
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdOrgId, setCreatedOrgId] = useState<string | null>(null);
  const router = useRouter();
  const { setCurrentOrganization } = useOrganizationStore();

  const handleDataChange = (stepData: StepData['data']) => {
    const currentStepConfig = steps[currentStep];
    const updatedData = currentStepConfig.mergeData(formData, stepData);
    setFormData(updatedData);
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      setIsSubmitting(true);
      setError(null);
      console.log('[Onboarding] Submitting organization data:', formData);

      try {
        const createOrgDto: CreateOrganizationDto = {
          name: formData.basicInfo.name,
          type: OrgType.CLIENT,
          description: formData.basicInfo.description || undefined,
          isActive: true,
          isServiceProvider: false,
          primaryContact: formData.contact.primaryContact || undefined,
          email: formData.contact.email || undefined,
          phone: formData.contact.phone || undefined,
          address: formData.contact.address || undefined,
        };

        // Only include risk profile if required fields are present
        if (formData.riskProfile.businessFunctions || formData.riskProfile.keyAssets) {
          createOrgDto.riskProfile = {
            businessFunctions: formData.riskProfile.businessFunctions,
            keyAssets: formData.riskProfile.keyAssets,
            complianceFrameworks: formData.riskProfile.complianceFrameworks,
            dataTypes: formData.riskProfile.dataTypes,
            operationalRisk: (formData.riskProfile.riskLevels.operational as RiskLevel) || RiskLevel.LOW,
            dataSecurityRisk: (formData.riskProfile.riskLevels.dataSecurity as RiskLevel) || RiskLevel.LOW,
            complianceRisk: (formData.riskProfile.riskLevels.compliance as RiskLevel) || RiskLevel.LOW,
            financialRisk: (formData.riskProfile.riskLevels.financial as RiskLevel) || RiskLevel.LOW,
          };
        }

        // Only include quantitative risks if they exist
        if (formData.quantitativeRisk.annualLoss || formData.quantitativeRisk.probabilityOfOccurrence) {
          createOrgDto.quantitativeRisks = [{
            annualLoss: formData.quantitativeRisk.annualLoss,
            probabilityOfOccurrence: formData.quantitativeRisk.probabilityOfOccurrence,
            impactScore: formData.quantitativeRisk.impactScore,
            riskScore: formData.quantitativeRisk.riskScore,
          }];
        }

        // Only include risk matrix if it has entries
        if (formData.riskMatrix.length > 0) {
          createOrgDto.riskMatrix = formData.riskMatrix.map(entry => ({
            impact: entry.impact,
            likelihood: entry.likelihood,
            value: entry.value,
          }));
        }

        // Only include mitigation priorities if they exist
        if (formData.mitigation.length > 0) {
          createOrgDto.mitigationPriorities = formData.mitigation
            .filter(priority => priority.risk && priority.strategy) // Only include priorities with required fields
            .map(priority => ({
              risk: priority.risk,
              priority: priority.priority,
              strategy: priority.strategy,
              timeline: priority.timeline,
              timeframe: priority.timeframe as TimeFrame,
              riskArea: priority.riskArea,
              successCriteria: priority.successCriteria,
              resources: priority.resources,
              estimatedCost: priority.estimatedCost,
              responsibleParty: priority.responsibleParty,
            }));
        }

        console.log('[Onboarding] Creating organization with DTO:', createOrgDto);
        const response = await OrganizationsApi.create(createOrgDto);
        console.log('[Onboarding] Create response:', response);

        if (response.error) {
          throw new Error(response.error);
        }

        if (!response.data) {
          throw new Error('Invalid organization data received from server');
        }

        const organization = response.data;
        console.log('[Onboarding] Organization created successfully:', organization);
        
        setCreatedOrgId(organization.id);
        setCurrentOrganization(organization);
        setSuccess(true);

      } catch (error) {
        console.error('[Onboarding] Failed to complete onboarding:', error);
        setError(error instanceof Error ? error.message : 'Failed to create organization');
        setSuccess(false);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep(current => current + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(current => current - 1);
  };

  const handleGoToOrganization = () => {
    if (createdOrgId) {
      router.push(`/organization/${createdOrgId}`);
    }
  };

  const currentStepConfig = steps[currentStep];
  const StepComponent = currentStepConfig.component;
  const stepData = currentStepConfig.getData(formData);

  if (success && createdOrgId) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Organization Created Successfully!</h2>
              <p className="mt-2 text-gray-600">Your organization has been created and is ready to use.</p>
            </div>
            <button
              onClick={handleGoToOrganization}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Organization Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Tracker */}
        <div className="mb-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between relative">
            {/* Background Lines Layer */}
            <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              {/* Animated Pulse Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-pulse-slow" />
            </div>

            {/* Progress Line Layer */}
            <div 
              className="absolute top-6 left-0 h-1 rounded-full transition-all duration-700 ease-in-out bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            >
              {/* Animated Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            
            {/* Steps Layer */}
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                      shadow-lg transform hover:scale-110 group
                      ${
                        index < currentStep
                          ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                          : index === currentStep
                          ? 'bg-gradient-to-br from-blue-400 to-indigo-600 text-white ring-4 ring-blue-100'
                          : 'bg-white text-gray-400 hover:bg-gray-50'
                      }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-6 h-6 group-hover:animate-bounce" />
                    ) : (
                      <span className="text-lg font-semibold">{index + 1}</span>
                    )}
                    
                    {/* Glow Effect for Current Step */}
                    {index === currentStep && (
                      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
                    )}
                  </div>
                  
                  <span className={`mt-3 text-sm font-medium transition-colors duration-300 
                    ${index <= currentStep ? 'text-gray-800' : 'text-gray-400'}
                    truncate max-w-[120px] text-center group-hover:text-gray-900`}
                  >
                    {step.shortName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">{currentStepConfig.name}</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <StepComponent
            data={stepData.data}
            onChange={handleDataChange}
          />

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="ml-auto bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
