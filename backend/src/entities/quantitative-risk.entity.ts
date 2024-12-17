import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
@Entity()
export class QuantitativeRisk extends BaseEntity {
    @Property()
    annualLoss!: number;
    @Property()
    probabilityOfOccurrence!: number;
    @Property()
    impactScore!: number;
    @Property()
    riskScore!: number;
    @ManyToOne(() => Organization)
    organization!: Organization;
}
