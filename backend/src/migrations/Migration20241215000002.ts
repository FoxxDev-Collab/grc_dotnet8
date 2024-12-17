import { Migration } from '@mikro-orm/migrations';

export class Migration20241215000002 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "control_link" ("id" varchar(255) not null, "source_control_id" varchar(255) not null, "target_control_id" varchar(255) not null, "rel" varchar(255) not null, "href" varchar(255) null, constraint "control_link_pkey" primary key ("id"));');
    
    this.addSql('alter table "control_link" add constraint "control_link_source_control_id_foreign" foreign key ("source_control_id") references "control" ("id") on update cascade;');
    this.addSql('alter table "control_link" add constraint "control_link_target_control_id_foreign" foreign key ("target_control_id") references "control" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "control_link" cascade;');
  }
}
