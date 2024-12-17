import { IsString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { RiskLevel } from '../../enums/risk.enum';
export class UpdateRiskProfileDto {
    @IsString()
    @IsOptional()
    id?: string;
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
