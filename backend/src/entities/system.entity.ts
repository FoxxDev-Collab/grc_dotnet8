import { Entity, Property, Enum, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { SystemType, SystemCriticality, SystemStatus } from '../enums/system.enum';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
@Entity()
export class System extends BaseEntity {
    @ManyToOne(() => Organization)
    organization!: Organization;
    @Property()
    name!: string;
    @Property({ nullable: true })
    description?: string;
    @Enum(() => SystemType)
    systemType!: SystemType;
    @Enum(() => SystemCriticality)
    criticality!: SystemCriticality;
    @Enum(() => SystemStatus)
    status: SystemStatus = SystemStatus.ACTIVE;
    // System Details
    @Property({ nullable: true })
    owner?: string;
    @Property({ nullable: true })
    custodian?: string;
    @Property({ nullable: true })
    boundaries?: string;
    @Property({ nullable: true })
    location?: string;
    // Relations
    @OneToMany("ATOPackage", "system")
    atoPackages = new Collection<any>(this);
    @OneToMany("Asset", "system")
    assets = new Collection<any>(this);
}
