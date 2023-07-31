import { AuthController } from '@auth/controllers/auth.controller';
import { JwtStrategy } from '@auth/jwt/jwt.strategy';
import { AuthService } from '@auth/services/auth.service';
import { GoogleStrategy } from '@auth/strategies/google.strategy';
import { JWT, JWT_EXP_H, JWT_SECRET } from '@common/app.jwt';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    UserModule,
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
