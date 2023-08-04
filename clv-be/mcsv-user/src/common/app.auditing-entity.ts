import { IsUUID } from 'class-validator';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class AuditEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string = uuidv4();

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ nullable: true, default: 'CLVADMIN' })
  createdBy?: string;

  @Column({ nullable: true, default: 'CLVADMIN' })
  updatedBy?: string;

  @BeforeInsert()
  public setCreateDate(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  public setUpdateDate(): void {
    this.updatedAt = new Date();
  }
}
