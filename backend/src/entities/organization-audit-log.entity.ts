import { Entity, Property, ManyToOne, PrimaryKey, Enum } from '@mikro-orm/core';
import { Organization } from './organization.entity';
import { SystemUser } from './system-user.entity';
import { ClientUser } from './client-user.entity';
export enum OrganizationAction {
    CREATED = "created",
    UPDATED = "updated",
    DELETED = "deleted",
    USER_ADDED = "user_added",
    USER_REMOVED = "user_removed",
    STATUS_CHANGED = "status_changed"
}
@Entity()
export class OrganizationAuditLog {
    @PrimaryKey()
    id!: string;
    @ManyToOne(() => Organization, { nullable: true })
    organization?: Organization;
    @Property()
    organizationId: string;
    @Property()
    organizationName: string;
    @ManyToOne(() => SystemUser, { nullable: true })
    systemUser?: SystemUser;
    @ManyToOne(() => ClientUser, { nullable: true })
    clientUser?: ClientUser;
    @Property()
    performedById: string;
    @Property()
    performedByEmail: string;
    @Enum(() => OrganizationAction)
    action!: OrganizationAction;
    @Property({ type: "jsonb" })
    changes: Record<string, any>;
    @Property()
    ipAddress: string;
    @Property()
    userAgent: string;
    @Property()
    timestamp: Date = new Date();
}
