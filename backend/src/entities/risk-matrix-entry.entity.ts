import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
@Entity()
export class RiskMatrixEntry extends BaseEntity {
    @Property()
    impact!: number;
    @Property()
    likelihood!: number;
    @Property()
    value!: number;
    @ManyToOne(() => Organization)
    organization!: Organization;
}
