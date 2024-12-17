import { Entity, Property, Enum, ManyToOne, ManyToMany, Collection } from '@mikro-orm/core';
import { IncidentSeverity, IncidentStatus } from '../enums/incident.enum';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { ClientUser } from './client-user.entity';
import { Asset } from './asset.entity';
@Entity()
export class Incident extends BaseEntity {
    @ManyToOne(() => Organization)
    organization!: Organization;
    @Property()
    title!: string;
    @Property()
    description!: string;
    @Enum(() => IncidentSeverity)
    severity!: IncidentSeverity;
    @Enum(() => IncidentStatus)
    status: IncidentStatus = IncidentStatus.OPEN;
    @ManyToOne(() => ClientUser)
    reporter!: ClientUser;
    @ManyToOne(() => ClientUser, { nullable: true })
    assignee?: ClientUser;
    @Property({ nullable: true })
    resolution?: string;
    @Property({ nullable: true })
    resolvedDate?: Date;
    // Relations
    @ManyToMany(() => Asset)
    affectedAssets = new Collection<Asset>(this);
}
