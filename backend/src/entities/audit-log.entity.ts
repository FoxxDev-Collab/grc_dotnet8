import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { SystemUser } from './system-user.entity';
import { ClientUser } from './client-user.entity';
@Entity()
export class AuditLog extends BaseEntity {
    @ManyToOne(() => Organization)
    organization!: Organization;
    @ManyToOne(() => SystemUser, { nullable: true })
    systemUser?: SystemUser;
    @ManyToOne(() => ClientUser, { nullable: true })
    clientUser?: ClientUser;
    @Property()
    action!: string; // Created, Updated, Deleted, Viewed
    @Property()
    entityType!: string; // The type of resource affected
    @Property()
    entityId!: string; // ID of the affected resource
    @Property({ type: "json" })
    details!: any; // Additional context about the action
    @Property({ nullable: true })
    ipAddress?: string;
    @Property({ nullable: true })
    userAgent?: string;
}
