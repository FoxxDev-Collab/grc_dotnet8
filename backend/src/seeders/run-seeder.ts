import { MikroORM } from '@mikro-orm/core';
import { DatabaseSeeder } from './DatabaseSeeder';
import config from '../../mikro-orm.config';
(async () => {
    try {
        const orm = await MikroORM.init(config);
        const generator = orm.getSchemaGenerator();
        const seeder = orm.getSeeder();
        await seeder.seed(DatabaseSeeder);
        await orm.close(true);
        process.exit(0);
    }
    catch (error) {
        console.error("Error running seeder:", error);
        process.exit(1);
    }
})();
