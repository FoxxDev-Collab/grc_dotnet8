import { Entity, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
@Entity()
export class ContinuityPlan extends BaseEntity {
    @ManyToOne(() => Organization)
    organization!: Organization;
    @Property()
    title!: string;
    @Property()
    version!: string;
    @Property()
    status!: string; // Draft, Active, Archived
    @Property()
    reviewDate!: Date;
    @Property()
    nextReviewDate!: Date;
    @Property({ type: "json" })
    content!: any; // Structured content
    // Relations
    @OneToMany("Approval", "continuityPlan")
    approvals = new Collection<any>(this);
}
