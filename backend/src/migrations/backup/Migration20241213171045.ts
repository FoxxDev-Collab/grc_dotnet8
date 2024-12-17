import { Migration } from '@mikro-orm/migrations';
export class Migration20241213171045 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "client_user" add column "client_role" text check ("client_role" in ('ADMIN', 'MANAGER', 'PM', 'USER')) not null;`);
        this.addSql(`alter table "client_user" add column "organization_role" text check ("organization_role" in ('AODR', 'SCA', 'SCAR', 'AUDITOR', 'PM', 'ISSM', 'ISSO')) null;`);
        this.addSql(`alter table "client_user" add column "organization_id" varchar(255) not null;`);
        this.addSql(`alter table "client_user" add constraint "client_user_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        // Add validation check to ensure organization_role is not null when client_role is not USER
        this.addSql(`
      alter table "client_user" add constraint "client_user_role_validation"
      check (
        (client_role = 'USER' and organization_role is null) or
        (client_role != 'USER' and organization_role is not null)
      );
    `);
    }
    override async down(): Promise<void> {
        this.addSql(`alter table "client_user" drop constraint "client_user_role_validation";`);
        this.addSql(`alter table "client_user" drop constraint "client_user_organization_id_foreign";`);
        this.addSql(`alter table "client_user" drop column "client_role", drop column "organization_role", drop column "organization_id";`);
    }
}
