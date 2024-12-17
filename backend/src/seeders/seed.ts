import { EntityManager } from '@mikro-orm/postgresql';
import { SystemUser } from '../entities/system-user.entity';
import { Organization } from '../entities/organization.entity';
import { UserOrganization } from '../entities/user-organization.entity';
import { SystemRole } from '../common/enums/system-role.enum';
import { OrgType } from '../enums/organization.enum';
import * as bcrypt from 'bcrypt';
import { MikroORM } from '@mikro-orm/core';
import config from '../../mikro-orm.config';
import { SystemUserSeeder } from './SystemUserSeeder';
export const seedDatabase = async (em: EntityManager) => {
    try {
        console.log("Starting database seed...");
        // Check if admin user already exists
        const existingAdmin = await em.findOne(SystemUser, {
            email: process.env.INITIAL_ADMIN_EMAIL || "admin@securecenter.com",
        });
        if (existingAdmin) {
            console.log("Admin user already exists, proceeding with additional system users seed...");
        }
        else {
            console.log("Creating admin user...");
            // Create admin user
            const adminUser = new SystemUser();
            adminUser.email = process.env.INITIAL_ADMIN_EMAIL || "admin@securecenter.com";
            adminUser.password = await bcrypt.hash(process.env.INITIAL_ADMIN_PASSWORD || "changeme123!", 10);
            adminUser.firstName = process.env.INITIAL_ADMIN_FIRST_NAME || "Global";
            adminUser.lastName = process.env.INITIAL_ADMIN_LAST_NAME || "Administrator";
            adminUser.role = SystemRole.GLOBAL_ADMIN;
            adminUser.isActive = true;
            await em.persistAndFlush(adminUser);
            console.log("Admin user created successfully");
            // Create initial organization
            console.log("Creating default organization...");
            const organization = new Organization();
            organization.name = "Default Organization";
            organization.description = "Default organization created during initial setup";
            organization.isActive = true;
            organization.isServiceProvider = true;
            organization.type = OrgType.SERVICE_PROVIDER;
            await em.persistAndFlush(organization);
            console.log("Default organization created successfully");
            // Link admin to organization
            console.log("Linking admin to organization...");
            const userOrg = new UserOrganization();
            userOrg.systemUser = adminUser;
            userOrg.organization = organization;
            userOrg.isActive = true;
            await em.persistAndFlush(userOrg);
            console.log("Admin linked to organization successfully");
        }
        // Run the SystemUserSeeder
        console.log("Creating additional system users...");
        const systemUserSeeder = new SystemUserSeeder();
        await systemUserSeeder.run(em);
        console.log("Additional system users created successfully");
        console.log("Database seeded successfully");
    }
    catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
};
// Self-executing function to run the seeder
(async () => {
    try {
        console.log("Initializing MikroORM...");
        const orm = await MikroORM.init(config);
        console.log("MikroORM initialized successfully");
        const em = orm.em.fork();
        await seedDatabase(em);
        await orm.close();
        console.log("Database connection closed");
    }
    catch (error) {
        console.error("Failed to seed database:", error);
        process.exit(1);
    }
})();
