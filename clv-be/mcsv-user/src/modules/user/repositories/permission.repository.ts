import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '@common/app.abstract.repository';
import { Permission } from '@user/models';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionRepository extends AbstractRepository<Permission> {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }
}
