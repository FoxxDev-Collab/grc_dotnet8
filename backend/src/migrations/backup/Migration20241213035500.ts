import { Migration } from '@mikro-orm/migrations';
export class Migration20241213035500 extends Migration {
    async up(): Promise<void> {
        // Make user_id column nullable in audit_log table
        this.addSql("ALTER TABLE \"audit_log\" ALTER COLUMN \"user_id\" DROP NOT NULL;");
    }
    async down(): Promise<void> {
        // Revert changes - make user_id column not null again
        this.addSql("ALTER TABLE \"audit_log\" ALTER COLUMN \"user_id\" SET NOT NULL;");
    }
}
