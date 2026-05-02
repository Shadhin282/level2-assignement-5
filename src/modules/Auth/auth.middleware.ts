import { Request, Response, NextFunction } from 'express';
import config from '../../config';
import { verifyToken, JwtPayloadWithUser } from './jwtHelpers';

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const extractToken = (req: Request): string | null => {
  // Prefer Authorization header over cookies so a bearer token is used when present.
  if (req.headers.authorization?.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }

  return req.cookies?.accessToken ?? null;
};

export const auth = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized',
      });
    }

    try {
      const verified: JwtPayloadWithUser = verifyToken(token, config.jwt.access_secret as string);
      
      req.user = {
        userId: verified.userId,
        email: verified.email,
        role: verified.role,
      };

      // Role authorization
      if (roles.length && !roles.includes(verified.role)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Insufficient permissions',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  };
};