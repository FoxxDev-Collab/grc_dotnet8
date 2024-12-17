import { Migration } from '@mikro-orm/migrations';
export class Migration20241212053500 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`create table "risk_profile" (
      "id" varchar(255) not null, 
      "created_at" timestamptz not null, 
      "updated_at" timestamptz not null, 
      "business_functions" varchar(255) not null,
      "key_assets" varchar(255) not null,
      "compliance_frameworks" text[] not null,
      "data_types" text[] not null,
      "operational_risk" text check ("operational_risk" in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) not null,
      "data_security_risk" text check ("data_security_risk" in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) not null,
      "compliance_risk" text check ("compliance_risk" in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) not null,
      "financial_risk" text check ("financial_risk" in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) not null,
      "organization_id" varchar(255) not null,
      constraint "risk_profile_pkey" primary key ("id")
    );`);
        this.addSql(`create table "quantitative_risk" (
      "id" varchar(255) not null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz not null,
      "annual_loss" int not null,
      "probability_of_occurrence" float not null,
      "impact_score" float not null,
      "risk_score" float not null,
      "organization_id" varchar(255) not null,
      constraint "quantitative_risk_pkey" primary key ("id")
    );`);
        this.addSql(`create table "risk_matrix_entry" (
      "id" varchar(255) not null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz not null,
      "impact" int not null,
      "likelihood" int not null,
      "value" int not null,
      "organization_id" varchar(255) not null,
      constraint "risk_matrix_entry_pkey" primary key ("id")
    );`);
        this.addSql(`create table "mitigation_priority" (
      "id" varchar(255) not null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz not null,
      "risk" varchar(255) not null,
      "priority" int not null,
      "strategy" varchar(255) not null,
      "timeline" varchar(255) not null,
      "timeframe" text check ("timeframe" in ('IMMEDIATE', 'SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM')) not null,
      "risk_area" varchar(255) not null,
      "success_criteria" varchar(255) not null,
      "resources" varchar(255) not null,
      "estimated_cost" varchar(255) not null,
      "responsible_party" varchar(255) not null,
      "organization_id" varchar(255) not null,
      constraint "mitigation_priority_pkey" primary key ("id")
    );`);
        this.addSql(`alter table "risk_profile" add constraint "risk_profile_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "quantitative_risk" add constraint "quantitative_risk_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "risk_matrix_entry" add constraint "risk_matrix_entry_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
        this.addSql(`alter table "mitigation_priority" add constraint "mitigation_priority_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;`);
    }
}
