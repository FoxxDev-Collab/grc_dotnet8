import { Migration } from '@mikro-orm/migrations';

export class Migration20241214040117 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "catalog" ("id" varchar(255) not null, "title" varchar(255) not null, "version" varchar(255) not null, "last_modified" timestamptz not null, constraint "catalog_pkey" primary key ("id"));`);

    this.addSql(`create table "group" ("id" varchar(255) not null, "title" varchar(255) not null, "class" varchar(255) not null, "catalog_id" varchar(255) not null, constraint "group_pkey" primary key ("id"));`);

    this.addSql(`create table "control" ("id" varchar(255) not null, "title" varchar(255) not null, "class" varchar(255) not null, "group_id" varchar(255) not null, constraint "control_pkey" primary key ("id"));`);

    this.addSql(`create table "parameter" ("id" varchar(255) not null, "label" varchar(255) not null, "control_id" varchar(255) not null, constraint "parameter_pkey" primary key ("id"));`);

    this.addSql(`create table "part" ("id" varchar(255) not null, "name" varchar(255) not null, "prose" varchar(255) null, "control_id" varchar(255) not null, "parent_id" varchar(255) null, constraint "part_pkey" primary key ("id"));`);

    this.addSql(`alter table "group" add constraint "group_catalog_id_foreign" foreign key ("catalog_id") references "catalog" ("id") on update cascade;`);

    this.addSql(`alter table "control" add constraint "control_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade;`);

    this.addSql(`alter table "parameter" add constraint "parameter_control_id_foreign" foreign key ("control_id") references "control" ("id") on update cascade;`);

    this.addSql(`alter table "part" add constraint "part_control_id_foreign" foreign key ("control_id") references "control" ("id") on update cascade;`);
    this.addSql(`alter table "part" add constraint "part_parent_id_foreign" foreign key ("parent_id") references "part" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "organization" drop constraint if exists "organization_type_check";`);

    this.addSql(`alter table "organization" add constraint "organization_type_check" check("type" in ('PROVIDER', 'CLIENT'));`);

    this.addSql(`alter table "client_user" drop column "role";`);

    this.addSql(`alter table "client_user" add column "client_role" text check ("client_role" in ('ADMIN', 'MANAGER', 'PM', 'USER')) not null, add column "organization_role" text check ("organization_role" in ('AODR', 'SCA', 'SCAR', 'AUDITOR', 'PM', 'ISSM', 'ISSO')) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "group" drop constraint "group_catalog_id_foreign";`);

    this.addSql(`alter table "control" drop constraint "control_group_id_foreign";`);

    this.addSql(`alter table "parameter" drop constraint "parameter_control_id_foreign";`);

    this.addSql(`alter table "part" drop constraint "part_control_id_foreign";`);

    this.addSql(`alter table "part" drop constraint "part_parent_id_foreign";`);

    this.addSql(`drop table if exists "catalog" cascade;`);

    this.addSql(`drop table if exists "group" cascade;`);

    this.addSql(`drop table if exists "control" cascade;`);

    this.addSql(`drop table if exists "parameter" cascade;`);

    this.addSql(`drop table if exists "part" cascade;`);

    this.addSql(`alter table "organization" drop constraint if exists "organization_type_check";`);

    this.addSql(`alter table "organization" add constraint "organization_type_check" check("type" in ('SERVICE_PROVIDER', 'CLIENT'));`);

    this.addSql(`alter table "client_user" drop column "client_role", drop column "organization_role";`);

    this.addSql(`alter table "client_user" add column "role" text check ("role" in ('ADMIN', 'MANAGER', 'USER', 'AUDITOR')) not null;`);
  }

}
