import { AuthController } from '@auth/controllers/auth.controller';
import { JwtStrategy } from '@auth/jwt/jwt.strategy';
import { AuthService } from '@auth/services/auth.service';
import { GoogleStrategy } from '@auth/strategies/google.strategy';
import { JWT, JWT_EXP_H, JWT_SECRET } from '@common/app.jwt';
import { API_GATEWAY, NOTI_SERVICE } from '@kafka/constant/index';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    UserModule,
    ClientsModule.register([
      {
        name: API_GATEWAY,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_GATEWAY_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER_ID],
          },
          consumer: {
            groupId: process.env.KAFKA_GATEWAY_CONSUMER_GROUP_ID,
          },
        },
      },
      {
        name: NOTI_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_NOTI_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER_ID],
          },
          consumer: {
            groupId: process.env.KAFKA_NOTI_CONSUMER_GROUP_ID,
          },
        },
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(JWT_EXP_H),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: JWT }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
