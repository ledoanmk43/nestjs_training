import { JwtPayload } from '@jwt/jwt.payload';

// Make a Request in NestJs return an addtional property named 'user' (type JwtPayload) with specific type (AuthReq)
export type AuthReq = Request & { user: JwtPayload }; // Request from express
// export type AuthUser = User & {}
