import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { SystemUser } from '../entities/system-user.entity';
import { SystemRole } from '../common/enums/system-role.enum';
import * as bcrypt from 'bcrypt';
export class SystemUserSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const basePassword = "systemUser!";
        const saltRounds = 10;
        // Check if any of our seeded users already exist
        const existingUser = await em.findOne(SystemUser, {
            email: "admin@securecenter.com",
        });
        if (existingUser) {
            console.log("Seeded users already exist, skipping system user seed");
            return;
        }
        // Create default admin user
        const defaultAdmin = {
            email: "admin@securecenter.com",
            password: await bcrypt.hash("admin123!", saltRounds),
            firstName: "Admin",
            lastName: "User",
            role: SystemRole.GLOBAL_ADMIN,
            isActive: true,
        };
        // Create additional system users (3 GLOBAL_ADMIN and 3 ADMIN)
        const systemUsers = await Promise.all([
            defaultAdmin,
            {
                email: "globaladmin1@system.com",
                password: await bcrypt.hash(`${basePassword}1`, saltRounds),
                firstName: "Global",
                lastName: "Admin One",
                role: SystemRole.GLOBAL_ADMIN,
                isActive: true,
            },
            {
                email: "globaladmin2@system.com",
                password: await bcrypt.hash(`${basePassword}2`, saltRounds),
                firstName: "Global",
                lastName: "Admin Two",
                role: SystemRole.GLOBAL_ADMIN,
                isActive: true,
            },
            {
                email: "globaladmin3@system.com",
                password: await bcrypt.hash(`${basePassword}3`, saltRounds),
                firstName: "Global",
                lastName: "Admin Three",
                role: SystemRole.GLOBAL_ADMIN,
                isActive: true,
            },
            {
                email: "admin4@system.com",
                password: await bcrypt.hash(`${basePassword}4`, saltRounds),
                firstName: "Admin",
                lastName: "User One",
                role: SystemRole.ADMIN,
                isActive: true,
            },
            {
                email: "admin5@system.com",
                password: await bcrypt.hash(`${basePassword}5`, saltRounds),
                firstName: "Admin",
                lastName: "User Two",
                role: SystemRole.ADMIN,
                isActive: true,
            },
            {
                email: "admin6@system.com",
                password: await bcrypt.hash(`${basePassword}6`, saltRounds),
                firstName: "Admin",
                lastName: "User Three",
                role: SystemRole.ADMIN,
                isActive: true,
            },
        ]);
        for (const userData of systemUsers) {
            const user = em.create(SystemUser, userData);
            await em.persist(user);
        }
        await em.flush();
        console.log("System users seeded successfully");
    }
}
