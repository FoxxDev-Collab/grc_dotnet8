import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Artifact } from './artifact.entity';
@Entity()
export class ArtifactRevision extends BaseEntity {
    @ManyToOne(() => Artifact)
    artifact!: Artifact;
    @Property()
    version!: string;
    @Property()
    fileUrl!: string;
    @Property({ nullable: true })
    changes?: string; // Description of changes
    @Property()
    createdBy!: string; // User ID reference
}
