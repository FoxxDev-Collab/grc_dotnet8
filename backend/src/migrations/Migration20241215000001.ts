import { Migration } from '@mikro-orm/migrations';

export class Migration20241215000001 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "control" add column "base_control_id" varchar(255) null;');
    this.addSql('alter table "control" add constraint "control_base_control_id_foreign" foreign key ("base_control_id") references "control" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "control" drop constraint "control_base_control_id_foreign";');
    this.addSql('alter table "control" drop column "base_control_id";');
  }
}
