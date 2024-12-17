import { Migration } from '@mikro-orm/migrations';
export class Migration20241212063915 extends Migration {
    override async up(): Promise<void> {
        // Drop existing foreign key constraints
        this.addSql(`alter table "user_organization" drop constraint if exists "user_organization_organization_id_foreign";`);
        this.addSql(`alter table "service_provider_client" drop constraint if exists "service_provider_client_provider_id_foreign";`);
        this.addSql(`alter table "service_provider_client" drop constraint if exists "service_provider_client_client_id_foreign";`);
        this.addSql(`alter table "system" drop constraint if exists "system_organization_id_foreign";`);
        this.addSql(`alter table "incident" drop constraint if exists "incident_organization_id_foreign";`);
        this.addSql(`alter table "continuity_plan" drop constraint if exists "continuity_plan_organization_id_foreign";`);
        this.addSql(`alter table "poam" drop constraint if exists "poam_organization_id_foreign";`);
        this.addSql(`alter table "audit_log" drop constraint if exists "audit_log_organization_id_foreign";`);
        this.addSql(`alter table "artifact" drop constraint if exists "artifact_organization_id_foreign";`);
        this.addSql(`alter table "mitigation_priority" drop constraint if exists "mitigation_priority_organization_id_foreign";`);
        this.addSql(`alter table "quantitative_risk" drop constraint if exists "quantitative_risk_organization_id_foreign";`);
        this.addSql(`alter table "risk_matrix_entry" drop constraint if exists "risk_matrix_entry_organization_id_foreign";`);
        this.addSql(`alter table "risk_profile" drop constraint if exists "risk_profile_organization_id_foreign";`);
        // Add constraints back with ON DELETE CASCADE
        this.addSql(`alter table "user_organization" add constraint "user_organization_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "service_provider_client" add constraint "service_provider_client_provider_id_foreign" foreign key ("provider_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "service_provider_client" add constraint "service_provider_client_client_id_foreign" foreign key ("client_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "system" add constraint "system_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "incident" add constraint "incident_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "continuity_plan" add constraint "continuity_plan_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "poam" add constraint "poam_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "audit_log" add constraint "audit_log_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "artifact" add constraint "artifact_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "mitigation_priority" add constraint "mitigation_priority_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "quantitative_risk" add constraint "quantitative_risk_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "risk_matrix_entry" add constraint "risk_matrix_entry_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
        this.addSql(`alter table "risk_profile" add constraint "risk_profile_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
    }
    override async down(): Promise<void> {
        // Remove cascade delete constraints
        this.addSql(`alter table "user_organization" drop constraint if exists "user_organization_organization_id_foreign";`);
        this.addSql(`alter table "service_provider_client" drop constraint if exists "service_provider_client_provider_id_foreign";`);
        this.addSql(`alter table "service_provider_client" drop constraint if exists "service_provider_client_client_id_foreign";`);
        this.addSql(`alter table "system" drop constraint if exists "system_organization_id_foreign";`);
        this.addSql(`alter table "incident" drop constraint if exists "incident_organization_id_foreign";`);
        this.addSql(`alter table "continuity_plan" drop constraint if exists "continuity_plan_organization_id_foreign";`);
        this.addSql(`alter table "poam" drop constraint if exists "poam_organization_id_foreign";`);
        this.addSql(`alter table "audit_log" drop constraint if exists "audit_log_organization_id_foreign";`);
        this.addSql(`alter table "artifact" drop constraint if exists "artifact_organization_id_foreign";`);
        this.addSql(`alter table "mitigation_priority" drop constraint if exists "mitigation_priority_organization_id_foreign";`);
        this.addSql(`alter table "quantitative_risk" drop constraint if exists "quantitative_risk_organization_id_foreign";`);
        this.addSql(`alter table "risk_matrix_entry" drop constraint if exists "risk_matrix_entry_organization_id_foreign";`);
        this.addSql(`alter table "risk_profile" drop constraint if exists "risk_profile_organization_id_foreign";`);
        // Add back constraints without cascade delete
        this.addSql(`alter table "user_organization" add constraint "user_organization_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "service_provider_client" add constraint "service_provider_client_provider_id_foreign" foreign key ("provider_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "service_provider_client" add constraint "service_provider_client_client_id_foreign" foreign key ("client_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "system" add constraint "system_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "incident" add constraint "incident_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "continuity_plan" add constraint "continuity_plan_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "poam" add constraint "poam_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "audit_log" add constraint "audit_log_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "artifact" add constraint "artifact_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "mitigation_priority" add constraint "mitigation_priority_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "quantitative_risk" add constraint "quantitative_risk_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "risk_matrix_entry" add constraint "risk_matrix_entry_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "risk_profile" add constraint "risk_profile_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
    }
}
