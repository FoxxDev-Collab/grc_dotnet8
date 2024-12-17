import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { SystemUser } from './system-user.entity';
import { ClientUser } from './client-user.entity';
@Entity()
export class UserOrganization extends BaseEntity {
    @ManyToOne(() => Organization)
    organization!: Organization;
    @ManyToOne(() => SystemUser, { nullable: true })
    systemUser?: SystemUser;
    @ManyToOne(() => ClientUser, { nullable: true })
    clientUser?: ClientUser;
    @Property()
    isActive: boolean = true;
    // Helper method to get the associated user (either system or client)
    getUser(): SystemUser | ClientUser | undefined {
        return this.systemUser || this.clientUser;
    }
    // Helper method to get the user's email
    getUserEmail(): string | undefined {
        const user = this.getUser();
        return user?.email;
    }
    // Helper method to get the user's full name
    getUserFullName(): string | undefined {
        const user = this.getUser();
        if (!user)
            return undefined;
        return `${user.firstName} ${user.lastName}`;
    }
}
