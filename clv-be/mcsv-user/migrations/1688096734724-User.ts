import { MigrationInterface, QueryRunner } from 'typeorm';
import { MASTER_ID, MASTER_EMAIL } from '../src/common/migration.role';

export class User1688096734724 implements MigrationInterface {
  // perform migration
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO users (
                id, created_at, updated_at, created_by, updated_by,
                email, password, is_pending, is_disable,
                first_name, last_name, global_id, office_code, country
            ) VALUES (
            '${MASTER_ID}', now(), now(), '${MASTER_ID}', '${MASTER_ID}',
            '${MASTER_EMAIL}', '$2b$10$haKo7cmMeVgATwwfEM9EAu.uRLKhbqhH8heg7XWlJ.XDqXNgyTJ9q',
            false, false, 'Doan', 'Le', NULL, NULL, NULL
            );`,
    );
  }
  // revert migration
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE email = '${MASTER_EMAIL}';`,
    );
  }
}
