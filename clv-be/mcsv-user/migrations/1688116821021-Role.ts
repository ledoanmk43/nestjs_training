import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  ADMIN_ROLE_ID,
  MASTER_ROLE_ID,
  USER_ROLE_ID,
} from '../src/common/migration.role';
import { ROOT_USERNAME } from '../src/common/app.constants';

export class Role1688116821021 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO roles (id, name, created_by, updated_by)
                VALUES ('${MASTER_ROLE_ID}', 'MASTER', '${ROOT_USERNAME}', '${ROOT_USERNAME}'),
                ('${ADMIN_ROLE_ID}', 'ADMIN', '${ROOT_USERNAME}', '${ROOT_USERNAME}'),
                ('${USER_ROLE_ID}', 'USER', '${ROOT_USERNAME}', '${ROOT_USERNAME}');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE id IS NOT NULL;`);
  }
}
