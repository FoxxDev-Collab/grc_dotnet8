import { Migration } from '@mikro-orm/migrations';
export class Migration20241212183455 extends Migration {
    async up(): Promise<void> {
        // Create client_user table
        this.addSql(`create table "client_user" (
      "id" uuid not null default uuid_generate_v4(),
      "created_at" timestamptz(0) not null default now(),
      "updated_at" timestamptz(0) not null default now(),
      "email" varchar(255) not null,
      "password" varchar(255) not null,
      "first_name" varchar(255) not null,
      "last_name" varchar(255) not null,
      "is_active" boolean not null default true,
      "last_login" timestamptz(0) null,
      constraint "client_user_pkey" primary key ("id"),
      constraint "client_user_email_unique" unique ("email")
    );`);
        // Create system_user table
        this.addSql(`create table "system_user" (
      "id" uuid not null default uuid_generate_v4(),
      "created_at" timestamptz(0) not null default now(),
      "updated_at" timestamptz(0) not null default now(),
      "email" varchar(255) not null,
      "password" varchar(255) not null,
      "first_name" varchar(255) not null,
      "last_name" varchar(255) not null,
      "role" text check ("role" in ('GLOBAL_ADMIN', 'ADMIN')) not null default 'ADMIN',
      "is_active" boolean not null default true,
      "last_login" timestamptz(0) null,
      constraint "system_user_pkey" primary key ("id"),
      constraint "system_user_email_unique" unique ("email")
    );`);
        // Create incident table if it doesn't exist
        this.addSql(`create table if not exists "incident" (
      "id" uuid not null default uuid_generate_v4(),
      "created_at" timestamptz(0) not null default now(),
      "updated_at" timestamptz(0) not null default now(),
      "organization_id" uuid not null,
      "title" varchar(255) not null,
      "description" text not null,
      "severity" text check ("severity" in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) not null,
      "status" text check ("status" in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')) not null default 'OPEN',
      "reporter_id" uuid not null references "client_user" ("id") on update cascade,
      "assignee_id" uuid null references "client_user" ("id") on update cascade on delete set null,
      "resolution" text null,
      "resolved_date" timestamptz(0) null,
      constraint "incident_pkey" primary key ("id")
    );`);
        // Create approval table if it doesn't exist
        this.addSql(`create table if not exists "approval" (
      "id" uuid not null default uuid_generate_v4(),
      "created_at" timestamptz(0) not null default now(),
      "updated_at" timestamptz(0) not null default now(),
      "entity_type" varchar(255) not null,
      "entity_id" varchar(255) not null,
      "approver_id" uuid not null references "client_user" ("id") on update cascade,
      "status" text check ("status" in ('PENDING', 'APPROVED', 'REJECTED')) not null default 'PENDING',
      "comments" text null,
      "approved_at" timestamptz(0) null,
      constraint "approval_pkey" primary key ("id")
    );`);
        // Create asset table if it doesn't exist
        this.addSql(`create table if not exists "asset" (
      "id" uuid not null default uuid_generate_v4(),
      "created_at" timestamptz(0) not null default now(),
      "updated_at" timestamptz(0) not null default now(),
      "system_id" uuid not null,
      "name" varchar(255) not null,
      "type" varchar(255) not null,
      "status" varchar(255) not null,
      "created_by_id" uuid not null references "client_user" ("id") on update cascade,
      "description" text null,
      "version" varchar(255) null,
      "location" varchar(255) null,
      "purchase_date" timestamptz(0) null,
      "end_of_life" timestamptz(0) null,
      constraint "asset_pkey" primary key ("id")
    );`);
        // Update audit_log table
        this.addSql(`alter table if exists "audit_log" 
      add column if not exists "system_user_id" uuid null references "system_user" ("id") on update cascade on delete set null,
      add column if not exists "client_user_id" uuid null references "client_user" ("id") on update cascade on delete set null;`);
        // Update user_organization table
        this.addSql(`alter table if exists "user_organization" 
      add column if not exists "system_user_id" uuid null references "system_user" ("id") on update cascade on delete set null,
      add column if not exists "client_user_id" uuid null references "client_user" ("id") on update cascade on delete set null;`);
    }
    async down(): Promise<void> {
        // Drop foreign key constraints
        this.addSql(`alter table "incident" drop constraint if exists "incident_reporter_id_foreign";`);
        this.addSql(`alter table "incident" drop constraint if exists "incident_assignee_id_foreign";`);
        this.addSql(`alter table "approval" drop constraint if exists "approval_approver_id_foreign";`);
        this.addSql(`alter table "asset" drop constraint if exists "asset_created_by_id_foreign";`);
        this.addSql(`alter table "audit_log" drop constraint if exists "audit_log_system_user_id_foreign";`);
        this.addSql(`alter table "audit_log" drop constraint if exists "audit_log_client_user_id_foreign";`);
        this.addSql(`alter table "user_organization" drop constraint if exists "user_organization_system_user_id_foreign";`);
        this.addSql(`alter table "user_organization" drop constraint if exists "user_organization_client_user_id_foreign";`);
        // Drop columns from audit_log
        this.addSql(`alter table "audit_log" drop column if exists "system_user_id";`);
        this.addSql(`alter table "audit_log" drop column if exists "client_user_id";`);
        // Drop columns from user_organization
        this.addSql(`alter table "user_organization" drop column if exists "system_user_id";`);
        this.addSql(`alter table "user_organization" drop column if exists "client_user_id";`);
        // Drop tables
        this.addSql(`drop table if exists "client_user" cascade;`);
        this.addSql(`drop table if exists "system_user" cascade;`);
    }
}
