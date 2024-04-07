import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: jwt.JwtPayload;
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token || req.body.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ success: false, message: 'Token Missing' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      req.user = decoded; // Now TypeScript knows that decoded is of type JwtPayload
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Token is invalid' });
      return;
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Something Went Wrong While Validating the Token',
    });
    return;
  }
};

