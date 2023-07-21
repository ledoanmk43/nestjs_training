import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AuditingSubscriber } from 'typeorm-auditing';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuditEntity } from '@common/app.auditing-entity';
import {
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from '@common/db.postgres';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get(POSTGRES_HOST),
      port: this.config.get(POSTGRES_PORT),
      username: this.config.get(POSTGRES_USER),
      password: this.config.get(POSTGRES_PASSWORD),
      database: this.config.get(POSTGRES_DB),
      autoLoadEntities: true,
      entities: [AuditEntity, '/src/modules/**/models/*.*{.ts,.js}'],
      migrations: ['/src/migrations/*.ts'],
      subscribers: [AuditingSubscriber],
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: false, // Set to false in production
      logging: true,
    };
  }
}
