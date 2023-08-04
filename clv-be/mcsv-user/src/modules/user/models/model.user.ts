import { AuditEntity } from '@common/app.auditing-entity';
import { Role } from '@user/models';
import * as bcrypt from 'bcrypt';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity('users')
export class User extends AuditEntity {
  @Column({ unique: true, length: 255 })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  password: string;

  @Column({ type: 'boolean', default: true })
  @Expose()
  isPending?: boolean;

  @Column({ type: 'boolean', default: true })
  @Expose()
  isDisable?: boolean;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @Column({ nullable: true })
  globalId?: string;

  @Column({ nullable: true })
  officeCode?: string;

  @Column({ nullable: true })
  country?: String;

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  @Expose()
  roles: Role[];

  @BeforeInsert()
  setCreateUpdateBy() {
    this.createdBy = this.id;
    this.updatedBy = this.id;
  }

  @BeforeUpdate()
  setUpdateBy() {
    this.updatedBy = this.id;
  }

  @BeforeUpdate()
  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  }
}
