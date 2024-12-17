import { Entity, Property, Collection, OneToMany, Enum, ManyToOne, BeforeUpdate, BeforeCreate, ValidationError } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Asset } from './asset.entity';
import { Approval } from './approval.entity';
import { Incident } from './incident.entity';
import { AuditLog } from './audit-log.entity';
import { Organization } from './organization.entity';
import { ClientRole } from '../common/enums/client-role.enum';
import { OrganizationRole } from '../common/enums/organization-role.enum';
@Entity()
export class ClientUser extends BaseEntity {
    @Property({ unique: true })
    email!: string;
    @Property()
    password!: string;
    @Property()
    firstName!: string;
    @Property()
    lastName!: string;
    @Property()
    isActive: boolean = true;
    @Property({ nullable: true })
    lastLogin?: Date;
    @Enum(() => ClientRole)
    clientRole!: ClientRole;
    @Enum(() => OrganizationRole)
    organizationRole?: OrganizationRole;
    @ManyToOne(() => Organization)
    organization!: Organization;
    // Relations
    @OneToMany(() => Asset, asset => asset.createdBy)
    createdAssets = new Collection<Asset>(this);
    @OneToMany(() => Approval, approval => approval.approver)
    approvals = new Collection<Approval>(this);
    @OneToMany(() => Incident, incident => incident.reporter)
    reportedIncidents = new Collection<Incident>(this);
    @OneToMany(() => Incident, incident => incident.assignee)
    assignedIncidents = new Collection<Incident>(this);
    @OneToMany(() => AuditLog, auditLog => auditLog.clientUser)
    auditLogs = new Collection<AuditLog>(this);
    // Virtual property for full name
    @Property({ persist: false })
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
    // Helper method to validate role mapping
    validateRoleMapping(): boolean {
        const validMappings = {
            [ClientRole.ADMIN]: OrganizationRole.ISSM,
            [ClientRole.MANAGER]: OrganizationRole.ISSO,
            [ClientRole.PM]: OrganizationRole.PM,
            [ClientRole.USER]: null,
        };
        if (this.clientRole === ClientRole.USER) {
            return this.organizationRole === null;
        }
        return validMappings[this.clientRole] === this.organizationRole;
    }
    @BeforeCreate()
    @BeforeUpdate()
    validateRoles() {
        if (!this.validateRoleMapping()) {
            throw new ValidationError("Invalid role mapping. The client role and organization role combination is not allowed.");
        }
        if (this.clientRole === ClientRole.USER && this.organizationRole !== null) {
            throw new ValidationError("User role cannot have an organization role.");
        }
        if (this.clientRole !== ClientRole.USER && !this.organizationRole) {
            throw new ValidationError("Non-user roles must have an organization role.");
        }
    }
}
