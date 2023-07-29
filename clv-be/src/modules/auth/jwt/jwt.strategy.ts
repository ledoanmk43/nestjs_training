import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@user/services/user.service';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const { id, email } = payload;
    try {
      const user = await this.userService.searchUserByCondition({
        where: { id: id, email: email },
      });
      console.log(user);
      if (!user) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException(error.message);
    }

    return payload;
  }
}
