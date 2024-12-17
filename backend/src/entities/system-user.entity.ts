import { Entity, Property, Enum, Collection, OneToMany } from '@mikro-orm/core';
import { SystemRole } from '../common/enums/system-role.enum';
import { BaseEntity } from './base.entity';
import { AuditLog } from './audit-log.entity';
import { UserOrganization } from './user-organization.entity';
@Entity()
export class SystemUser extends BaseEntity {
    @Property({ unique: true })
    email!: string;
    @Property()
    password!: string;
    @Property()
    firstName!: string;
    @Property()
    lastName!: string;
    @Enum(() => SystemRole)
    role: SystemRole = SystemRole.ADMIN;
    @Property()
    isActive: boolean = true;
    @Property({ nullable: true })
    lastLogin?: Date;
    // Relations
    @OneToMany(() => AuditLog, auditLog => auditLog.systemUser)
    auditLogs = new Collection<AuditLog>(this);
    @OneToMany(() => UserOrganization, userOrg => userOrg.systemUser)
    organizations = new Collection<UserOrganization>(this);
    // Helper methods
    isGlobalAdmin(): boolean {
        return this.role === SystemRole.GLOBAL_ADMIN;
    }
    isAdmin(): boolean {
        return this.role === SystemRole.ADMIN;
    }
}
