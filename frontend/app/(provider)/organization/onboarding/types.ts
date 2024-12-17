export interface BasicInfo {
  name: string;
  website: string;
  industry: string;
  yearFounded: string;
  totalEmployees: string;
  annualRevenue: string;
  marketValue: string;
  description: string;
}

export interface ContactInfo {
  primaryContact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface RiskLevels {
  operational: string;
  dataSecurity: string;
  compliance: string;
  financial: string;
}

export interface RiskProfile {
  businessFunctions: string;
  keyAssets: string;
  complianceFrameworks: string[];
  riskLevels: RiskLevels;
  dataTypes: string[];
}

export interface QuantitativeRisk {
  annualLoss: number;
  probabilityOfOccurrence: number;
  impactScore: number;
  riskScore: number;
}

export interface RiskMatrixEntry {
  impact: number;
  likelihood: number;
  value: number;
}

export interface MitigationPriority {
  risk: string;
  priority: number;
  strategy: string;
  timeline: string;
  timeframe: string;
  riskArea: string;
  successCriteria: string;
  resources: string;
  estimatedCost: string;
  responsibleParty: string;
}

export interface OnboardingData {
  basicInfo: BasicInfo;
  contact: ContactInfo;
  riskProfile: RiskProfile;
  quantitativeRisk: QuantitativeRisk;
  riskMatrix: RiskMatrixEntry[];
  systems: string[];
  mitigation: MitigationPriority[];
}

export interface BasicInfoFormData {
  basicInfo: BasicInfo;
  contact: ContactInfo;
}

export interface FormComponentProps<T> {
  data: T;
  onChange: (data: T) => void;
}
