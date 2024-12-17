import { Entity, Property, Enum, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { ControlStatus } from '../enums/ato.enum';
import { BaseEntity } from './base.entity';
import { ATOPackage } from './ato-package.entity';
@Entity()
export class ControlAssessment extends BaseEntity {
    @ManyToOne(() => ATOPackage)
    atoPackage!: ATOPackage;
    @Property()
    controlId!: string; // e.g., AC-1, SC-7
    @Property()
    title!: string;
    @Property({ nullable: true })
    description?: string;
    @Enum(() => ControlStatus)
    status: ControlStatus = ControlStatus.NOT_IMPLEMENTED;
    @Property({ nullable: true })
    implementationStatus?: string;
    @Property({ type: "json", nullable: true })
    testResults?: any; // Structured test results
    @Property({ nullable: true })
    testedDate?: Date;
    // Relations
    @OneToMany("Document", "control")
    documents = new Collection<any>(this);
    @OneToMany("ControlArtifact", "control")
    artifacts = new Collection<any>(this);
    @OneToMany("Approval", "controlAssessment")
    approvals = new Collection<any>(this);
}
