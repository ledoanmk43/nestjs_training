import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '@common/app.abstract.repository';
import { User } from '@user/models';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  // This is a customized provider so it has decorator Injectable

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
