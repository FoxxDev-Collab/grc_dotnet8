import { Entity, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
@Entity()
export class POAM extends BaseEntity {
    @ManyToOne(() => Organization)
    organization!: Organization;
    @Property()
    finding!: string;
    @Property()
    recommendation!: string;
    @Property()
    priority!: string; // High, Medium, Low
    @Property()
    status!: string; // Open, In Progress, Completed
    @Property()
    targetDate!: Date;
    @Property({ nullable: true })
    completionDate?: Date;
    @Property()
    responsibleParty!: string;
    @Property()
    mitigationPlan!: string;
    @Property({ nullable: true })
    residualRisk?: string;
    // Relations
    @OneToMany("Approval", "poam")
    approvals = new Collection<any>(this);
}
