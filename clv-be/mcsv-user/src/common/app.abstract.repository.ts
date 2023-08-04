import { InjectRepository } from '@nestjs/typeorm';
import { Entity, Repository } from 'typeorm';

export class AbstractRepository<T> extends Repository<T> {
  constructor(
    @InjectRepository(Entity)
    private readonly entity: Repository<T>,
  ) {
    super(entity.target, entity.manager, entity.queryRunner);
  }

  // Add some more logic when DML for all entities
  async findOneById(id: string): Promise<T> {
    return await this.entity.findOneBy({ id: id } as any);
  }

  async findByCondition(filterCondition: any): Promise<T> {
    return await this.entity.findOne({ where: filterCondition });
  }

  async findWithRelations(relations: any): Promise<T[]> {
    return await this.entity.find(relations);
  }

  async findAll(): Promise<T[]> {
    return await this.entity.find();
  }
}
