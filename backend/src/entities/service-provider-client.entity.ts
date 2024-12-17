import { Entity, Property, ManyToOne, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
@Entity()
@Unique({ properties: ["provider", "client"] })
export class ServiceProviderClient extends BaseEntity {
    @ManyToOne(() => Organization, { mapToPk: true })
    provider!: Organization;
    @ManyToOne(() => Organization, { mapToPk: true })
    client!: Organization;
    @Property()
    status!: string; // Active, Pending, Terminated
    @Property()
    startDate: Date = new Date();
    @Property({ nullable: true })
    endDate?: Date;
    @Property({ nullable: true })
    contractDetails?: string;
}
