import { MikroORM } from '@mikro-orm/core';
import { DatabaseSeeder } from './DatabaseSeeder';
import config from '../../mikro-orm.config';

(async () => {
    try {
        console.log("Initializing ORM...");
        const orm = await MikroORM.init(config);
        const generator = orm.getSchemaGenerator();

        // Drop all tables
        console.log("Dropping all tables...");
        await generator.dropSchema();

        // Create fresh schema from migrations
        console.log("Creating fresh schema...");
        await generator.createSchema();

        // Run all migrations
        console.log("Running migrations...");
        const migrator = orm.getMigrator();
        await migrator.up();

        // Run seeders in sequence
        console.log("Running seeders...");
        const seeder = orm.getSeeder();
        await seeder.seed(DatabaseSeeder);

        console.log("Database reset and seeding complete!");
        await orm.close(true);
        process.exit(0);
    }
    catch (error) {
        console.error("Error resetting database:", error);
        process.exit(1);
    }
})();
