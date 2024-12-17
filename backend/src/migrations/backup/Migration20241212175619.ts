import { Migration } from '@mikro-orm/migrations';
export class Migration20241212175619 extends Migration {
    override async up(): Promise<void> {
        // Add last_name as nullable first
        this.addSql(`alter table "user" add column "last_name" varchar(255);`);
        // Update existing records with a default value
        this.addSql(`update "user" set "last_name" = '' where "last_name" is null;`);
        // Make last_name non-nullable
        this.addSql(`alter table "user" alter column "last_name" set not null;`);
        // Rename existing columns
        this.addSql(`alter table "user" rename column "name" to "first_name";`);
        this.addSql(`alter table "user" rename column "system_role" to "role";`);
    }
    override async down(): Promise<void> {
        this.addSql(`alter table "user" drop column "last_name";`);
        this.addSql(`alter table "user" rename column "first_name" to "name";`);
        this.addSql(`alter table "user" rename column "role" to "system_role";`);
    }
}
