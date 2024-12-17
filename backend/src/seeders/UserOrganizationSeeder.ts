import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { SystemUser } from '../entities/system-user.entity';
import { Organization } from '../entities/organization.entity';
import { UserOrganization } from '../entities/user-organization.entity';
import { SystemRole } from '../common/enums/system-role.enum';
import { OrgType } from '../enums/organization.enum';
export class UserOrganizationSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        // Get all system users
        const systemUsers = await em.find(SystemUser, {});
        const organizations = await em.find(Organization, {});
        // Get service provider organization (The White Council)
        const serviceProvider = organizations.find(org => org.isServiceProvider);
        // Get client organizations
        const clientOrgs = organizations.filter(org => !org.isServiceProvider);
        // Get global admins and regular admins
        const globalAdmins = systemUsers.filter(user => user.role === SystemRole.GLOBAL_ADMIN);
        const admins = systemUsers.filter(user => user.role === SystemRole.ADMIN);
        // Create relationships
        const relationships: UserOrganization[] = [];
        // Assign all GLOBAL_ADMINs to all organizations
        for (const globalAdmin of globalAdmins) {
            for (const org of organizations) {
                relationships.push(em.create(UserOrganization, {
                    systemUser: globalAdmin,
                    organization: org,
                    isActive: true
                }));
            }
        }
        // Assign ADMINs to client organizations (distribute evenly)
        admins.forEach((admin, index) => {
            // Each admin gets assigned to some client organizations
            const assignedOrgs = clientOrgs.filter((_, orgIndex) => orgIndex % admins.length === index);
            for (const org of assignedOrgs) {
                relationships.push(em.create(UserOrganization, {
                    systemUser: admin,
                    organization: org,
                    isActive: true
                }));
            }
            // Also assign to service provider if it exists
            if (serviceProvider) {
                relationships.push(em.create(UserOrganization, {
                    systemUser: admin,
                    organization: serviceProvider,
                    isActive: true
                }));
            }
        });
        // Check if any relationships already exist
        const existingCount = await em.count(UserOrganization, {});
        if (existingCount > 0) {
            console.log("User-Organization relationships already exist, skipping seeding");
            return;
        }
        // Persist all relationships
        await em.persistAndFlush(relationships);
        console.log(`Created ${relationships.length} user-organization relationships`);
    }
}
