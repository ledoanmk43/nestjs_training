import { MigrationInterface, QueryRunner } from 'typeorm';
import { MASTER_ROLE_ID } from '../src/common/migration.role';
import {
  ACTIVAVTE_USER_ID,
  ADD_PERMISSION_ID,
  GET_ALL_USER_ID,
} from '../src/common/migration.permission';

export class SeedingRolePermission1688117970372 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO role_permissions (role_id, permission_id)
                VALUES ('${MASTER_ROLE_ID}', '${ACTIVAVTE_USER_ID}'),
                ('${MASTER_ROLE_ID}', '${GET_ALL_USER_ID}'),
                ('${MASTER_ROLE_ID}', '${ADD_PERMISSION_ID}');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM role_permissions WHERE id IS NOT NULL;`,
    );
  }
}
