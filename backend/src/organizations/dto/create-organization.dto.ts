import { Type } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, IsNumber, ValidateNested, Min, Max } from 'class-validator';
import { OrgType } from '../../enums/organization.enum';
import { RiskLevel, TimeFrame } from '../../enums/risk.enum';
export class CreateRiskProfileDto {
    @IsString()
    businessFunctions!: string;
    @IsString()
    keyAssets!: string;
    @IsArray()
    @IsString({ each: true })
    complianceFrameworks!: string[];
    @IsArray()
    @IsString({ each: true })
    dataTypes!: string[];
    @IsEnum(RiskLevel)
    operationalRisk!: RiskLevel;
    @IsEnum(RiskLevel)
    dataSecurityRisk!: RiskLevel;
    @IsEnum(RiskLevel)
    complianceRisk!: RiskLevel;
    @IsEnum(RiskLevel)
    financialRisk!: RiskLevel;
}
export class CreateQuantitativeRiskDto {
    @IsNumber()
    @Min(0)
    annualLoss!: number;
    @IsNumber()
    @Min(0)
    @Max(1)
    probabilityOfOccurrence!: number;
    @IsNumber()
    @Min(1)
    @Max(10)
    impactScore!: number;
    @IsNumber()
    riskScore!: number;
}
export class CreateRiskMatrixEntryDto {
    @IsNumber()
    @Min(0)
    @Max(4)
    impact!: number;
    @IsNumber()
    @Min(0)
    @Max(4)
    likelihood!: number;
    @IsNumber()
    value!: number;
}
export class CreateMitigationPriorityDto {
    @IsString()
    risk!: string;
    @IsNumber()
    priority!: number;
    @IsString()
    strategy!: string;
    @IsString()
    timeline!: string;
    @IsEnum(TimeFrame)
    timeframe!: TimeFrame;
    @IsString()
    riskArea!: string;
    @IsString()
    successCriteria!: string;
    @IsString()
    resources!: string;
    @IsString()
    estimatedCost!: string;
    @IsString()
    responsibleParty!: string;
}
export class CreateOrganizationDto {
    @IsString()
    name!: string;
    @IsEnum(OrgType)
    type!: OrgType;
    @IsString()
    @IsOptional()
    description?: string;
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
    @IsBoolean()
    @IsOptional()
    isServiceProvider?: boolean;
    @IsString()
    @IsOptional()
    primaryContact?: string;
    @IsString()
    @IsOptional()
    email?: string;
    @IsString()
    @IsOptional()
    phone?: string;
    @IsString()
    @IsOptional()
    address?: string;
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateRiskProfileDto)
    riskProfile?: CreateRiskProfileDto;
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuantitativeRiskDto)
    quantitativeRisks?: CreateQuantitativeRiskDto[];
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateRiskMatrixEntryDto)
    riskMatrix?: CreateRiskMatrixEntryDto[];
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMitigationPriorityDto)
    mitigationPriorities?: CreateMitigationPriorityDto[];
}
