import { MigrationInterface, QueryRunner } from 'typeorm';
import { ROOT_USERNAME } from '../src/common/app.constants';
import {
  ACTIVAVTE_USER,
  ACTIVAVTE_USER_DESCRIPTION,
  ACTIVAVTE_USER_ID,
  ADD_PERMISSION,
  ADD_PERMISSION_DESCRIPTION,
  ADD_PERMISSION_ID,
  GET_ALL_USER,
  GET_ALL_USER_DESCRIPTION,
  GET_ALL_USER_ID,
} from '../src/common/migration.permission';

export class Permission1688117960225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO permissions (id, name, description, created_at, updated_at, created_by, updated_by)
                VALUES ('${ACTIVAVTE_USER_ID}', '${ACTIVAVTE_USER}', '${ACTIVAVTE_USER_DESCRIPTION}', now(), now(), '${ROOT_USERNAME}', '${ROOT_USERNAME}'), 
                ('${GET_ALL_USER_ID}', '${GET_ALL_USER}', '${GET_ALL_USER_DESCRIPTION}', now(), now(), '${ROOT_USERNAME}', '${ROOT_USERNAME}'),
                 ('${ADD_PERMISSION_ID}', '${ADD_PERMISSION}', '${ADD_PERMISSION_DESCRIPTION}', now(), now(), '${ROOT_USERNAME}', '${ROOT_USERNAME}');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM permissions WHERE id IS NOT NULL;`);
  }
}
