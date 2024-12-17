import { Entity, Property, Enum, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { ArtifactType, ArtifactStatus } from '../enums/artifact.enum';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
@Entity()
export class Artifact extends BaseEntity {
    @ManyToOne(() => Organization)
    organization!: Organization;
    @Property()
    name!: string;
    @Property({ nullable: true })
    description?: string;
    @Enum(() => ArtifactType)
    type!: ArtifactType;
    @Enum(() => ArtifactStatus)
    status: ArtifactStatus = ArtifactStatus.DRAFT;
    @Property()
    version!: string;
    @Property()
    fileUrl!: string; // S3 or file storage URL
    @Property()
    mimeType!: string;
    @Property()
    fileSize!: number;
    @Property({ type: "json", nullable: true })
    metadata?: any; // Additional metadata
    @Property({ nullable: true })
    lastReviewedAt?: Date;
    @Property({ nullable: true })
    expiresAt?: Date;
    // User references
    @Property()
    createdBy!: string;
    @Property({ nullable: true })
    lastReviewedBy?: string;
    @Property({ nullable: true })
    approvedBy?: string;
    // Relations
    @OneToMany("ControlArtifact", "artifact")
    controls = new Collection<any>(this);
    @OneToMany("ArtifactRevision", "artifact")
    revisions = new Collection<any>(this);
}
