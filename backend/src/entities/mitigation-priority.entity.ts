import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { TimeFrame } from '../enums/risk.enum';
@Entity()
export class MitigationPriority extends BaseEntity {
    @Property()
    risk!: string;
    @Property()
    priority!: number;
    @Property({ type: "text" })
    strategy!: string;
    @Property()
    timeline!: string;
    @Enum(() => TimeFrame)
    timeframe!: TimeFrame;
    @Property()
    riskArea!: string;
    @Property()
    successCriteria!: string;
    @Property()
    resources!: string;
    @Property()
    estimatedCost!: string;
    @Property()
    responsibleParty!: string;
    @ManyToOne(() => Organization)
    organization!: Organization;
}
