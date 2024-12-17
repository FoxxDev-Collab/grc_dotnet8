import { Entity, Property, Enum, ManyToOne } from '@mikro-orm/core';
import { ApprovalStatus } from '../enums/artifact.enum';
import { BaseEntity } from './base.entity';
import { ClientUser } from './client-user.entity';
import { Document } from './document.entity';
import { ControlAssessment } from './control-assessment.entity';
import { ATOPackage } from './ato-package.entity';
import { ContinuityPlan } from './continuity-plan.entity';
import { POAM } from './poam.entity';
@Entity()
export class Approval extends BaseEntity {
    @Property()
    entityType!: string; // Document, Control, Package, etc.
    @Property()
    entityId!: string; // ID of the entity being approved
    @ManyToOne(() => ClientUser)
    approver!: ClientUser;
    @Enum(() => ApprovalStatus)
    status: ApprovalStatus = ApprovalStatus.PENDING;
    @Property({ nullable: true })
    comments?: string;
    @Property({ nullable: true })
    approvedAt?: Date;
    // Relations to approvable entities
    @ManyToOne(() => Document, { nullable: true })
    document?: Document;
    @ManyToOne(() => ControlAssessment, { nullable: true })
    controlAssessment?: ControlAssessment;
    @ManyToOne(() => ATOPackage, { nullable: true })
    atoPackage?: ATOPackage;
    @ManyToOne(() => ContinuityPlan, { nullable: true })
    continuityPlan?: ContinuityPlan;
    @ManyToOne(() => POAM, { nullable: true })
    poam?: POAM;
}
