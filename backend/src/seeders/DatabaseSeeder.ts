import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { SystemUserSeeder } from './SystemUserSeeder';
import { OrganizationSeeder } from './OrganizationSeeder';
import { UserOrganizationSeeder } from './UserOrganizationSeeder';
export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        return this.call(em, [
            SystemUserSeeder, // First create system users
            OrganizationSeeder, // Then create organizations
            UserOrganizationSeeder // Finally establish relationships between them
        ]);
    }
}
