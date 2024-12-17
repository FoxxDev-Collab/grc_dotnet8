import { MikroORM } from '@mikro-orm/core';
import { OrganizationSeeder } from './OrganizationSeeder';
import config from '../../mikro-orm.config';
(async () => {
    const orm = await MikroORM.init(config);
    const seeder = orm.getSeeder();
    await seeder.seed(OrganizationSeeder);
    await orm.close(true);
    process.exit(0);
})().catch(error => {
    console.error("Error while seeding database:", error);
    process.exit(1);
});
