import { MigrationInterface, QueryRunner } from 'typeorm';
import { MASTER_ID, MASTER_ROLE_ID } from '../src/common/migration.role';

export class SeedingUserRole1688117980389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO user_roles (user_id, role_id)
                VALUES ('${MASTER_ID}', '${MASTER_ROLE_ID}');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM user_roles WHERE user_id IS NOT NULL;`,
    );
  }
}
