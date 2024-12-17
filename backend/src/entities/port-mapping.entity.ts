import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Asset } from './asset.entity';
@Entity()
export class PortMapping extends BaseEntity {
    @ManyToOne(() => Asset)
    asset!: Asset;
    @Property()
    port!: number;
    @Property()
    protocol!: string; // TCP, UDP
    @Property()
    service!: string;
    @Property({ nullable: true })
    description?: string;
    @Property()
    status!: string; // Active, Inactive
    @Property({ nullable: true })
    lastScan?: Date;
}
