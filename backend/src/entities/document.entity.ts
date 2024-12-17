import { Entity, Property, Enum, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { DocumentType } from '../enums/ato.enum';
import { ApprovalStatus } from '../enums/artifact.enum';
import { BaseEntity } from './base.entity';
import { ControlAssessment } from './control-assessment.entity';
@Entity()
export class Document extends BaseEntity {
    @ManyToOne(() => ControlAssessment)
    control!: ControlAssessment;
    @Enum(() => DocumentType)
    type!: DocumentType;
    @Property()
    title!: string;
    @Property({ nullable: true })
    description?: string;
    @Property()
    version!: string;
    @Property()
    fileUrl!: string; // S3 or file system URL
    @Property({ nullable: true })
    mimeType?: string;
    @Property({ nullable: true })
    fileSize?: number;
    @Enum(() => ApprovalStatus)
    status: ApprovalStatus = ApprovalStatus.PENDING;
    @Property({ type: "json", nullable: true })
    metadata?: any; // Additional metadata
    // Relations
    @OneToMany("Approval", "document")
    approvals = new Collection<any>(this);
}
