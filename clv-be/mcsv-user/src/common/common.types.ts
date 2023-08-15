import { JwtPayload } from '@src/modules/auth/jwt/jwt.payload';
import { Request } from 'express';
// Make a Request in NestJs return an addtional property named 'user' (type JwtPayload) with specific type (AuthReq)
export type AuthReq = Request & { user: JwtPayload }; // Request from express
// export type AuthUser = User & {}

export type OAuthReq = Request & { user: OAuthUser };

export type OAuthUser = {
  email: string;
  firstName: string;
  lastName: string;
};
