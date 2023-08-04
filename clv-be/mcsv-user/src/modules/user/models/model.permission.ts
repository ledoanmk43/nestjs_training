import { AuditEntity } from '@common/app.auditing-entity';
import { Role } from '@user/models';
import { Expose } from 'class-transformer';
import { IsUppercase } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('permissions')
export class Permission extends AuditEntity {
  @Column({ unique: true, length: 255 })
  @Expose()
  @IsUppercase()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column({ nullable: true })
  deletedAt?: Date;

  @Expose()
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
