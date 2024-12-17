import { Entity, Property, Enum, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { ATOStatus, ATOPhase } from '../enums/ato.enum';
import { BaseEntity } from './base.entity';
import { System } from './system.entity';
@Entity()
export class ATOPackage extends BaseEntity {
    @ManyToOne(() => System)
    system!: System;
    @Property()
    name!: string;
    @Property({ nullable: true })
    description?: string;
    @Property()
    framework!: string; // e.g., "NIST 800-53 Rev 5"
    @Enum(() => ATOStatus)
    status: ATOStatus = ATOStatus.DRAFT;
    @Enum(() => ATOPhase)
    currentPhase: ATOPhase = ATOPhase.PREPARATION;
    // Timeline
    @Property({ nullable: true })
    validFrom?: Date;
    @Property({ nullable: true })
    validUntil?: Date;
    @Property({ nullable: true })
    lastAssessment?: Date;
    @Property({ nullable: true })
    nextAssessment?: Date;
    // Relations
    @OneToMany("ControlAssessment", "atoPackage")
    controls = new Collection<any>(this);
    @OneToMany("Approval", "atoPackage")
    approvals = new Collection<any>(this);
}
