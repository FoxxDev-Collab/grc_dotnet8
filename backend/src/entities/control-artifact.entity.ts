import { Entity, Property, ManyToOne, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { ControlAssessment } from './control-assessment.entity';
import { Artifact } from './artifact.entity';
@Entity()
@Unique({ properties: ["control", "artifact"] })
export class ControlArtifact extends BaseEntity {
    @ManyToOne(() => ControlAssessment)
    control!: ControlAssessment;
    @ManyToOne(() => Artifact)
    artifact!: Artifact;
    @Property()
    association!: string; // e.g., "primary", "supporting", "implementation", etc.
    @Property({ nullable: true })
    notes?: string;
}
