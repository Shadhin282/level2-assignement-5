import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../../config';

export interface JwtPayloadWithUser {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const createToken = (
  jwtPayload: { userId: string; email: string; role: string },
  secret: string,
  expiresIn: string | number
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string): JwtPayloadWithUser => {
  return jwt.verify(token, secret) as JwtPayloadWithUser;
};

export const accessToken = createToken(
  { userId: '', email: '', role: '' },
  config.jwt.access_secret as string,
  config.jwt.access_expire as string
);

export const refreshToken = createToken(
  { userId: '', email: '', role: '' },
  config.jwt.refresh_secret as string,
  config.jwt.refresh_expire as string
);

export const jwtHelpers = {
  createToken,
  verifyToken,
};