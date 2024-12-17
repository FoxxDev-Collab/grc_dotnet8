import { Entity, Property, OneToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { RiskLevel } from '../enums/risk.enum';
@Entity()
export class RiskProfile extends BaseEntity {
    @Property({ type: "text" })
    businessFunctions!: string;
    @Property({ type: "text" })
    keyAssets!: string;
    @Property({ type: "array" })
    complianceFrameworks: string[] = [];
    @Property({ type: "array" })
    dataTypes: string[] = [];
    @Enum(() => RiskLevel)
    operationalRisk!: RiskLevel;
    @Enum(() => RiskLevel)
    dataSecurityRisk!: RiskLevel;
    @Enum(() => RiskLevel)
    complianceRisk!: RiskLevel;
    @Enum(() => RiskLevel)
    financialRisk!: RiskLevel;
    @OneToOne(() => Organization, org => org.riskProfile, { owner: true })
    organization!: Organization;
}
