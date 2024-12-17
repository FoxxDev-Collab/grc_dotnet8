import { Migration } from '@mikro-orm/migrations';
export class Migration20241211202532 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`create table "organization" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "type" text check ("type" in ('SERVICE_PROVIDER', 'CLIENT')) not null, "description" varchar(255) null, "is_active" boolean not null default true, "is_service_provider" boolean not null default false, "primary_contact" varchar(255) null, "email" varchar(255) null, "phone" varchar(255) null, "address" varchar(255) null, constraint "organization_pkey" primary key ("id"));`);
        this.addSql(`create table "continuity_plan" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "organization_id" varchar(255) not null, "title" varchar(255) not null, "version" varchar(255) not null, "status" varchar(255) not null, "review_date" timestamptz not null, "next_review_date" timestamptz not null, "content" jsonb not null, constraint "continuity_plan_pkey" primary key ("id"));`);
        this.addSql(`create table "artifact" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "organization_id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "type" text check ("type" in ('POLICY', 'PROCEDURE', 'DOCUMENTATION', 'SCAN_RESULT', 'CONFIGURATION', 'TRAINING', 'AUDIT_LOG', 'EVIDENCE', 'OTHER')) not null, "status" text check ("status" in ('DRAFT', 'IN_REVIEW', 'APPROVED', 'ARCHIVED', 'REJECTED')) not null default 'DRAFT', "version" varchar(255) not null, "file_url" varchar(255) not null, "mime_type" varchar(255) not null, "file_size" int not null, "metadata" jsonb null, "last_reviewed_at" timestamptz null, "expires_at" timestamptz null, "created_by" varchar(255) not null, "last_reviewed_by" varchar(255) null, "approved_by" varchar(255) null, constraint "artifact_pkey" primary key ("id"));`);
        this.addSql(`create table "artifact_revision" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "artifact_id" varchar(255) not null, "version" varchar(255) not null, "file_url" varchar(255) not null, "changes" varchar(255) null, "created_by" varchar(255) not null, constraint "artifact_revision_pkey" primary key ("id"));`);
        this.addSql(`create table "poam" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "organization_id" varchar(255) not null, "finding" varchar(255) not null, "recommendation" varchar(255) not null, "priority" varchar(255) not null, "status" varchar(255) not null, "target_date" timestamptz not null, "completion_date" timestamptz null, "responsible_party" varchar(255) not null, "mitigation_plan" varchar(255) not null, "residual_risk" varchar(255) null, constraint "poam_pkey" primary key ("id"));`);
        this.addSql(`create table "service_provider_client" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "provider_id" varchar(255) not null, "client_id" varchar(255) not null, "status" varchar(255) not null, "start_date" timestamptz not null, "end_date" timestamptz null, "contract_details" varchar(255) null, constraint "service_provider_client_pkey" primary key ("id"));`);
        this.addSql(`alter table "service_provider_client" add constraint "service_provider_client_provider_id_client_id_unique" unique ("provider_id", "client_id");`);
        this.addSql(`create table "system" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "organization_id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "system_type" text check ("system_type" in ('WEB_APPLICATION', 'NETWORK_SYSTEM', 'DATABASE_SYSTEM', 'CLOUD_SERVICE', 'LEGACY_SYSTEM', 'OTHER')) not null, "criticality" text check ("criticality" in ('HIGH', 'MODERATE', 'LOW')) not null, "status" text check ("status" in ('ACTIVE', 'INACTIVE', 'DECOMMISSIONED', 'UNDER_DEVELOPMENT')) not null default 'ACTIVE', "owner" varchar(255) null, "custodian" varchar(255) null, "boundaries" varchar(255) null, "location" varchar(255) null, constraint "system_pkey" primary key ("id"));`);
        this.addSql(`create table "atopackage" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "system_id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "framework" varchar(255) not null, "status" text check ("status" in ('DRAFT', 'IN_PROGRESS', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED')) not null default 'DRAFT', "current_phase" text check ("current_phase" in ('PREPARATION', 'INITIAL_ASSESSMENT', 'CONTROL_IMPLEMENTATION', 'TESTING', 'VALIDATION', 'FINAL_REVIEW', 'AUTHORIZATION', 'MONITORING')) not null default 'PREPARATION', "valid_from" timestamptz null, "valid_until" timestamptz null, "last_assessment" timestamptz null, "next_assessment" timestamptz null, constraint "atopackage_pkey" primary key ("id"));`);
        this.addSql(`create table "control_assessment" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "ato_package_id" varchar(255) not null, "control_id" varchar(255) not null, "title" varchar(255) not null, "description" varchar(255) null, "status" text check ("status" in ('NOT_IMPLEMENTED', 'PLANNED', 'PARTIALLY_IMPLEMENTED', 'IMPLEMENTED', 'NOT_APPLICABLE')) not null default 'NOT_IMPLEMENTED', "implementation_status" varchar(255) null, "test_results" jsonb null, "tested_date" timestamptz null, constraint "control_assessment_pkey" primary key ("id"));`);
        this.addSql(`create table "document" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "control_id" varchar(255) not null, "type" text check ("type" in ('SSP', 'RAR', 'SAR', 'SAP', 'POA_M', 'EVIDENCE', 'POLICY', 'PROCEDURE', 'CONFIGURATION', 'TEST_RESULT', 'OTHER')) not null, "title" varchar(255) not null, "description" varchar(255) null, "version" varchar(255) not null, "file_url" varchar(255) not null, "mime_type" varchar(255) null, "file_size" int null, "status" text check ("status" in ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_WORK')) not null default 'PENDING', "metadata" jsonb null, constraint "document_pkey" primary key ("id"));`);
        this.addSql(`create table "control_artifact" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "control_id" varchar(255) not null, "artifact_id" varchar(255) not null, "association" varchar(255) not null, "notes" varchar(255) null, constraint "control_artifact_pkey" primary key ("id"));`);
        this.addSql(`alter table "control_artifact" add constraint "control_artifact_control_id_artifact_id_unique" unique ("control_id", "artifact_id");`);
        this.addSql(`create table "user" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password" varchar(255) not null, "name" varchar(255) not null, "system_role" text check ("system_role" in ('GLOBAL_ADMIN', 'ADMIN', 'USER')) not null default 'USER', "is_active" boolean not null default true, "last_login" timestamptz null, constraint "user_pkey" primary key ("id"));`);
        this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
        this.addSql(`create table "incident" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "organization_id" varchar(255) not null, "title" varchar(255) not null, "description" varchar(255) not null, "severity" text check ("severity" in ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')) not null, "status" text check ("status" in ('OPEN', 'INVESTIGATING', 'MITIGATING', 'RESOLVED', 'CLOSED')) not null default 'OPEN', "reporter_id" varchar(255) not null, "assignee_id" varchar(255) null, "resolution" varchar(255) null, "resolved_date" timestamptz null, constraint "incident_pkey" primary key ("id"));`);
        this.addSql(`create table "audit_log" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "organization_id" varchar(255) not null, "user_id" varchar(255) not null, "action" varchar(255) not null, "entity_type" varchar(255) not null, "entity_id" varchar(255) not null, "details" jsonb not null, "ip_address" varchar(255) null, "user_agent" varchar(255) null, constraint "audit_log_pkey" primary key ("id"));`);
        this.addSql(`create table "asset" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "system_id" varchar(255) not null, "name" varchar(255) not null, "type" varchar(255) not null, "status" varchar(255) not null, "created_by_id" varchar(255) not null, "description" varchar(255) null, "version" varchar(255) null, "location" varchar(255) null, "purchase_date" timestamptz null, "end_of_life" timestamptz null, constraint "asset_pkey" primary key ("id"));`);
        this.addSql(`create table "port_mapping" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "asset_id" varchar(255) not null, "port" int not null, "protocol" varchar(255) not null, "service" varchar(255) not null, "description" varchar(255) null, "status" varchar(255) not null, "last_scan" timestamptz null, constraint "port_mapping_pkey" primary key ("id"));`);
        this.addSql(`create table "incident_affected_assets" ("incident_id" varchar(255) not null, "asset_id" varchar(255) not null, constraint "incident_affected_assets_pkey" primary key ("incident_id", "asset_id"));`);
        this.addSql(`create table "approval" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "entity_type" varchar(255) not null, "entity_id" varchar(255) not null, "approver_id" varchar(255) not null, "status" text check ("status" in ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_WORK')) not null default 'PENDING', "comments" varchar(255) null, "approved_at" timestamptz null, "document_id" varchar(255) null, "control_assessment_id" varchar(255) null, "ato_package_id" varchar(255) null, "continuity_plan_id" varchar(255) null, "poam_id" varchar(255) null, constraint "approval_pkey" primary key ("id"));`);
        this.addSql(`create table "user_organization" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" varchar(255) not null, "organization_id" varchar(255) not null, "org_role" text check ("org_role" in ('AODR', 'SCA', 'SCAR', 'AUDITOR', 'ISSM', 'ISSO')) not null, "is_active" boolean not null default true, constraint "user_organization_pkey" primary key ("id"));`);
        this.addSql(`alter table "user_organization" add constraint "user_organization_user_id_organization_id_unique" unique ("user_id", "organization_id");`);
        this.addSql(`alter table "continuity_plan" add constraint "continuity_plan_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "artifact" add constraint "artifact_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "artifact_revision" add constraint "artifact_revision_artifact_id_foreign" foreign key ("artifact_id") references "artifact" ("id") on update cascade;`);
        this.addSql(`alter table "poam" add constraint "poam_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "service_provider_client" add constraint "service_provider_client_provider_id_foreign" foreign key ("provider_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "service_provider_client" add constraint "service_provider_client_client_id_foreign" foreign key ("client_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "system" add constraint "system_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "atopackage" add constraint "atopackage_system_id_foreign" foreign key ("system_id") references "system" ("id") on update cascade;`);
        this.addSql(`alter table "control_assessment" add constraint "control_assessment_ato_package_id_foreign" foreign key ("ato_package_id") references "atopackage" ("id") on update cascade;`);
        this.addSql(`alter table "document" add constraint "document_control_id_foreign" foreign key ("control_id") references "control_assessment" ("id") on update cascade;`);
        this.addSql(`alter table "control_artifact" add constraint "control_artifact_control_id_foreign" foreign key ("control_id") references "control_assessment" ("id") on update cascade;`);
        this.addSql(`alter table "control_artifact" add constraint "control_artifact_artifact_id_foreign" foreign key ("artifact_id") references "artifact" ("id") on update cascade;`);
        this.addSql(`alter table "incident" add constraint "incident_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "incident" add constraint "incident_reporter_id_foreign" foreign key ("reporter_id") references "user" ("id") on update cascade;`);
        this.addSql(`alter table "incident" add constraint "incident_assignee_id_foreign" foreign key ("assignee_id") references "user" ("id") on update cascade on delete set null;`);
        this.addSql(`alter table "audit_log" add constraint "audit_log_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "audit_log" add constraint "audit_log_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
        this.addSql(`alter table "asset" add constraint "asset_system_id_foreign" foreign key ("system_id") references "system" ("id") on update cascade;`);
        this.addSql(`alter table "asset" add constraint "asset_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
        this.addSql(`alter table "port_mapping" add constraint "port_mapping_asset_id_foreign" foreign key ("asset_id") references "asset" ("id") on update cascade;`);
        this.addSql(`alter table "incident_affected_assets" add constraint "incident_affected_assets_incident_id_foreign" foreign key ("incident_id") references "incident" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "incident_affected_assets" add constraint "incident_affected_assets_asset_id_foreign" foreign key ("asset_id") references "asset" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "approval" add constraint "approval_approver_id_foreign" foreign key ("approver_id") references "user" ("id") on update cascade;`);
        this.addSql(`alter table "approval" add constraint "approval_document_id_foreign" foreign key ("document_id") references "document" ("id") on update cascade on delete set null;`);
        this.addSql(`alter table "approval" add constraint "approval_control_assessment_id_foreign" foreign key ("control_assessment_id") references "control_assessment" ("id") on update cascade on delete set null;`);
        this.addSql(`alter table "approval" add constraint "approval_ato_package_id_foreign" foreign key ("ato_package_id") references "atopackage" ("id") on update cascade on delete set null;`);
        this.addSql(`alter table "approval" add constraint "approval_continuity_plan_id_foreign" foreign key ("continuity_plan_id") references "continuity_plan" ("id") on update cascade on delete set null;`);
        this.addSql(`alter table "approval" add constraint "approval_poam_id_foreign" foreign key ("poam_id") references "poam" ("id") on update cascade on delete set null;`);
        this.addSql(`alter table "user_organization" add constraint "user_organization_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
        this.addSql(`alter table "user_organization" add constraint "user_organization_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
    }
}