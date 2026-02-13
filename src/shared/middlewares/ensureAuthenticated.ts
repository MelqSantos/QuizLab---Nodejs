import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
      };
    }
  }
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    req.user = {
      id: decoded.sub,
      role: decoded.role
    };

    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
