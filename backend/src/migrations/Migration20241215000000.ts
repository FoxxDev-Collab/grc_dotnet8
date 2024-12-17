import { Migration } from '@mikro-orm/migrations';

export class Migration20241215000000 extends Migration {
  async up(): Promise<void> {
    // Drop all existing tables in reverse order of dependencies
    this.addSql('DROP TABLE IF EXISTS "incident_affected_assets" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "port_mapping" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "asset" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "approval" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "audit_log" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "control_artifact" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "document" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "control_assessment" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "atopackage" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "system" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "artifact_revision" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "artifact" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "poam" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "continuity_plan" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "service_provider_client" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "user_organization" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "incident" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "client_user" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "system_user" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "organization" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "part" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "parameter" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "control" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "group" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "catalog" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "risk_matrix_entry" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "quantitative_risk" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "risk_profile" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "mitigation_priority" CASCADE;');

    // Create tables in order of dependencies

    // Core entities
    this.addSql(`CREATE TABLE "organization" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "name" varchar(255) NOT NULL,
      "type" text CHECK ("type" IN ('PROVIDER', 'CLIENT')) NOT NULL,
      "description" varchar(255),
      "is_active" boolean NOT NULL DEFAULT true,
      "is_service_provider" boolean NOT NULL DEFAULT false,
      "primary_contact" varchar(255),
      "email" varchar(255),
      "phone" varchar(255),
      "address" varchar(255),
      CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
    );`);

    this.addSql(`CREATE TABLE "system_user" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "email" varchar(255) NOT NULL,
      "password" varchar(255) NOT NULL,
      "first_name" varchar(255) NOT NULL,
      "last_name" varchar(255) NOT NULL,
      "role" text CHECK ("role" IN ('GLOBAL_ADMIN', 'ADMIN', 'USER')) NOT NULL DEFAULT 'ADMIN',
      "is_active" boolean NOT NULL DEFAULT true,
      "last_login" timestamptz,
      CONSTRAINT "system_user_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "system_user_email_unique" UNIQUE ("email")
    );`);

    this.addSql(`CREATE TABLE "client_user" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "email" varchar(255) NOT NULL,
      "password" varchar(255) NOT NULL,
      "first_name" varchar(255) NOT NULL,
      "last_name" varchar(255) NOT NULL,
      "is_active" boolean NOT NULL DEFAULT true,
      "last_login" timestamptz,
      "client_role" text CHECK ("client_role" IN ('ADMIN', 'MANAGER', 'PM', 'USER')) NOT NULL,
      "organization_role" text CHECK ("organization_role" IN ('AODR', 'SCA', 'SCAR', 'AUDITOR', 'PM', 'ISSM', 'ISSO')),
      "organization_id" varchar(255) NOT NULL,
      CONSTRAINT "client_user_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "client_user_email_unique" UNIQUE ("email"),
      CONSTRAINT "client_user_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE
    );`);

    // OSCAL entities
    this.addSql(`CREATE TABLE "catalog" (
      "id" varchar(255) NOT NULL,
      "title" varchar(255) NOT NULL,
      "version" varchar(255) NOT NULL,
      "last_modified" timestamptz NOT NULL,
      CONSTRAINT "catalog_pkey" PRIMARY KEY ("id")
    );`);

    this.addSql(`CREATE TABLE "group" (
      "id" varchar(255) NOT NULL,
      "title" varchar(255) NOT NULL,
      "class" varchar(255) NOT NULL,
      "catalog_id" varchar(255) NOT NULL,
      CONSTRAINT "group_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "group_catalog_id_foreign" FOREIGN KEY ("catalog_id") REFERENCES "catalog"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "control" (
      "id" varchar(255) NOT NULL,
      "title" varchar(255) NOT NULL,
      "class" varchar(255) NOT NULL,
      "group_id" varchar(255) NOT NULL,
      CONSTRAINT "control_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "control_group_id_foreign" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "parameter" (
      "id" varchar(255) NOT NULL,
      "label" varchar(255) NOT NULL,
      "control_id" varchar(255) NOT NULL,
      CONSTRAINT "parameter_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "parameter_control_id_foreign" FOREIGN KEY ("control_id") REFERENCES "control"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "part" (
      "id" varchar(255) NOT NULL,
      "name" varchar(255) NOT NULL,
      "prose" varchar(255),
      "control_id" varchar(255) NOT NULL,
      "parent_id" varchar(255),
      CONSTRAINT "part_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "part_control_id_foreign" FOREIGN KEY ("control_id") REFERENCES "control"("id") ON UPDATE CASCADE,
      CONSTRAINT "part_parent_id_foreign" FOREIGN KEY ("parent_id") REFERENCES "part"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );`);

    // Risk Management entities
    this.addSql(`CREATE TABLE "risk_profile" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "business_functions" text NOT NULL,
      "key_assets" text NOT NULL,
      "compliance_frameworks" text[] NOT NULL,
      "data_types" text[] NOT NULL,
      "operational_risk" text CHECK ("operational_risk" IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) NOT NULL,
      "data_security_risk" text CHECK ("data_security_risk" IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) NOT NULL,
      "compliance_risk" text CHECK ("compliance_risk" IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) NOT NULL,
      "financial_risk" text CHECK ("financial_risk" IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      CONSTRAINT "risk_profile_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "risk_profile_organization_id_unique" UNIQUE ("organization_id"),
      CONSTRAINT "risk_profile_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "risk_matrix_entry" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "impact" int NOT NULL,
      "likelihood" int NOT NULL,
      "value" int NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      CONSTRAINT "risk_matrix_entry_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "risk_matrix_entry_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "quantitative_risk" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "annual_loss" int NOT NULL,
      "probability_of_occurrence" int NOT NULL,
      "impact_score" int NOT NULL,
      "risk_score" int NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      CONSTRAINT "quantitative_risk_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "quantitative_risk_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE
    );`);

    // System entities
    this.addSql(`CREATE TABLE "system" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      "name" varchar(255) NOT NULL,
      "description" varchar(255),
      "system_type" text CHECK ("system_type" IN ('WEB_APPLICATION', 'NETWORK_SYSTEM', 'DATABASE_SYSTEM', 'CLOUD_SERVICE', 'LEGACY_SYSTEM', 'OTHER')) NOT NULL,
      "criticality" text CHECK ("criticality" IN ('HIGH', 'MODERATE', 'LOW')) NOT NULL,
      "status" text CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'DECOMMISSIONED', 'UNDER_DEVELOPMENT')) NOT NULL DEFAULT 'ACTIVE',
      "owner" varchar(255),
      "custodian" varchar(255),
      "boundaries" varchar(255),
      "location" varchar(255),
      CONSTRAINT "system_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "system_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE
    );`);

    // Asset Management
    this.addSql(`CREATE TABLE "asset" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "system_id" varchar(255) NOT NULL,
      "name" varchar(255) NOT NULL,
      "type" varchar(255) NOT NULL,
      "status" varchar(255) NOT NULL,
      "created_by_id" varchar(255) NOT NULL,
      "description" varchar(255),
      "version" varchar(255),
      "location" varchar(255),
      "purchase_date" timestamptz,
      "end_of_life" timestamptz,
      CONSTRAINT "asset_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "asset_system_id_foreign" FOREIGN KEY ("system_id") REFERENCES "system"("id") ON UPDATE CASCADE,
      CONSTRAINT "asset_created_by_id_foreign" FOREIGN KEY ("created_by_id") REFERENCES "client_user"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "port_mapping" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "asset_id" varchar(255) NOT NULL,
      "port" int NOT NULL,
      "protocol" varchar(255) NOT NULL,
      "service" varchar(255) NOT NULL,
      "description" varchar(255),
      "status" varchar(255) NOT NULL,
      "last_scan" timestamptz,
      CONSTRAINT "port_mapping_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "port_mapping_asset_id_foreign" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON UPDATE CASCADE
    );`);

    // Compliance entities
    this.addSql(`CREATE TABLE "atopackage" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "system_id" varchar(255) NOT NULL,
      "name" varchar(255) NOT NULL,
      "description" varchar(255),
      "framework" varchar(255) NOT NULL,
      "status" text CHECK ("status" IN ('DRAFT', 'IN_PROGRESS', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED')) NOT NULL DEFAULT 'DRAFT',
      "current_phase" text CHECK ("current_phase" IN ('PREPARATION', 'INITIAL_ASSESSMENT', 'CONTROL_IMPLEMENTATION', 'TESTING', 'VALIDATION', 'FINAL_REVIEW', 'AUTHORIZATION', 'MONITORING')) NOT NULL DEFAULT 'PREPARATION',
      "valid_from" timestamptz,
      "valid_until" timestamptz,
      "last_assessment" timestamptz,
      "next_assessment" timestamptz,
      CONSTRAINT "atopackage_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "atopackage_system_id_foreign" FOREIGN KEY ("system_id") REFERENCES "system"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "control_assessment" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "ato_package_id" varchar(255) NOT NULL,
      "control_id" varchar(255) NOT NULL,
      "title" varchar(255) NOT NULL,
      "description" varchar(255),
      "status" text CHECK ("status" IN ('NOT_IMPLEMENTED', 'PLANNED', 'PARTIALLY_IMPLEMENTED', 'IMPLEMENTED', 'NOT_APPLICABLE')) NOT NULL DEFAULT 'NOT_IMPLEMENTED',
      "implementation_status" varchar(255),
      "test_results" jsonb,
      "tested_date" timestamptz,
      CONSTRAINT "control_assessment_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "control_assessment_ato_package_id_foreign" FOREIGN KEY ("ato_package_id") REFERENCES "atopackage"("id") ON UPDATE CASCADE
    );`);

    // Document Management
    this.addSql(`CREATE TABLE "artifact" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      "name" varchar(255) NOT NULL,
      "description" varchar(255),
      "type" text CHECK ("type" IN ('POLICY', 'PROCEDURE', 'DOCUMENTATION', 'SCAN_RESULT', 'CONFIGURATION', 'TRAINING', 'AUDIT_LOG', 'EVIDENCE', 'OTHER')) NOT NULL,
      "status" text CHECK ("status" IN ('DRAFT', 'IN_REVIEW', 'APPROVED', 'ARCHIVED', 'REJECTED')) NOT NULL DEFAULT 'DRAFT',
      "version" varchar(255) NOT NULL,
      "file_url" varchar(255) NOT NULL,
      "mime_type" varchar(255) NOT NULL,
      "file_size" int NOT NULL,
      "metadata" jsonb,
      "last_reviewed_at" timestamptz,
      "expires_at" timestamptz,
      "created_by" varchar(255) NOT NULL,
      "last_reviewed_by" varchar(255),
      "approved_by" varchar(255),
      CONSTRAINT "artifact_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "artifact_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "artifact_revision" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "artifact_id" varchar(255) NOT NULL,
      "version" varchar(255) NOT NULL,
      "file_url" varchar(255) NOT NULL,
      "changes" varchar(255),
      "created_by" varchar(255) NOT NULL,
      CONSTRAINT "artifact_revision_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "artifact_revision_artifact_id_foreign" FOREIGN KEY ("artifact_id") REFERENCES "artifact"("id") ON UPDATE CASCADE
    );`);

    // Relationship and Junction Tables
    this.addSql(`CREATE TABLE "service_provider_client" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "provider_id" varchar(255) NOT NULL,
      "client_id" varchar(255) NOT NULL,
      "status" varchar(255) NOT NULL,
      "start_date" timestamptz NOT NULL,
      "end_date" timestamptz,
      "contract_details" varchar(255),
      CONSTRAINT "service_provider_client_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "service_provider_client_provider_id_client_id_unique" UNIQUE ("provider_id", "client_id"),
      CONSTRAINT "service_provider_client_provider_id_foreign" FOREIGN KEY ("provider_id") REFERENCES "organization"("id") ON UPDATE CASCADE,
      CONSTRAINT "service_provider_client_client_id_foreign" FOREIGN KEY ("client_id") REFERENCES "organization"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "user_organization" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      "system_user_id" varchar(255),
      "client_user_id" varchar(255),
      "is_active" boolean NOT NULL DEFAULT true,
      CONSTRAINT "user_organization_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "user_organization_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE,
      CONSTRAINT "user_organization_system_user_id_foreign" FOREIGN KEY ("system_user_id") REFERENCES "system_user"("id") ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT "user_organization_client_user_id_foreign" FOREIGN KEY ("client_user_id") REFERENCES "client_user"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );`);

    // Tracking and Audit
    this.addSql(`CREATE TABLE "audit_log" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      "system_user_id" varchar(255),
      "client_user_id" varchar(255),
      "action" varchar(255) NOT NULL,
      "entity_type" varchar(255) NOT NULL,
      "entity_id" varchar(255) NOT NULL,
      "details" jsonb NOT NULL,
      "ip_address" varchar(255),
      "user_agent" varchar(255),
      CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "audit_log_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE,
      CONSTRAINT "audit_log_system_user_id_foreign" FOREIGN KEY ("system_user_id") REFERENCES "system_user"("id") ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT "audit_log_client_user_id_foreign" FOREIGN KEY ("client_user_id") REFERENCES "client_user"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );`);

    // Incident Management
    this.addSql(`CREATE TABLE "incident" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      "title" varchar(255) NOT NULL,
      "description" varchar(255) NOT NULL,
      "severity" text CHECK ("severity" IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')) NOT NULL,
      "status" text CHECK ("status" IN ('OPEN', 'INVESTIGATING', 'MITIGATING', 'RESOLVED', 'CLOSED')) NOT NULL DEFAULT 'OPEN',
      "reporter_id" varchar(255) NOT NULL,
      "assignee_id" varchar(255),
      "resolution" varchar(255),
      "resolved_date" timestamptz,
      CONSTRAINT "incident_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "incident_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE,
      CONSTRAINT "incident_reporter_id_foreign" FOREIGN KEY ("reporter_id") REFERENCES "client_user"("id") ON UPDATE CASCADE,
      CONSTRAINT "incident_assignee_id_foreign" FOREIGN KEY ("assignee_id") REFERENCES "client_user"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "incident_affected_assets" (
      "incident_id" varchar(255) NOT NULL,
      "asset_id" varchar(255) NOT NULL,
      CONSTRAINT "incident_affected_assets_pkey" PRIMARY KEY ("incident_id", "asset_id"),
      CONSTRAINT "incident_affected_assets_incident_id_foreign" FOREIGN KEY ("incident_id") REFERENCES "incident"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "incident_affected_assets_asset_id_foreign" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`);

    // Plan Management
    this.addSql(`CREATE TABLE "continuity_plan" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      "title" varchar(255) NOT NULL,
      "version" varchar(255) NOT NULL,
      "status" varchar(255) NOT NULL,
      "review_date" timestamptz NOT NULL,
      "next_review_date" timestamptz NOT NULL,
      "content" jsonb NOT NULL,
      CONSTRAINT "continuity_plan_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "continuity_plan_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "poam" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      "finding" varchar(255) NOT NULL,
      "recommendation" varchar(255) NOT NULL,
      "priority" varchar(255) NOT NULL,
      "status" varchar(255) NOT NULL,
      "target_date" timestamptz NOT NULL,
      "completion_date" timestamptz,
      "responsible_party" varchar(255) NOT NULL,
      "mitigation_plan" varchar(255) NOT NULL,
      "residual_risk" varchar(255),
      CONSTRAINT "poam_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "poam_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE
    );`);

    this.addSql(`CREATE TABLE "mitigation_priority" (
      "id" varchar(255) NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      "risk" varchar(255) NOT NULL,
      "priority" int NOT NULL,
      "strategy" text NOT NULL,
      "timeline" varchar(255) NOT NULL,
      "timeframe" text CHECK ("timeframe" IN ('IMMEDIATE', 'SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM')) NOT NULL,
      "risk_area" varchar(255) NOT NULL,
      "success_criteria" varchar(255) NOT NULL,
      "resources" varchar(255) NOT NULL,
      "estimated_cost" varchar(255) NOT NULL,
      "responsible_party" varchar(255) NOT NULL,
      "organization_id" varchar(255) NOT NULL,
      CONSTRAINT "mitigation_priority_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "mitigation_priority_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON UPDATE CASCADE
    );`);
  }
}
