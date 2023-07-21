import { AuditEntity } from '@common/app.auditing-entity';
import { Permission, User } from '@user/models';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('roles')
export class Role extends AuditEntity {
  @Column({ unique: true, length: 255 })
  @Expose()
  name: string;

  @Column({ nullable: true })
  deletedAt?: Date;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  @Expose()
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
