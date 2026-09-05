import { NextFunction, Request, Response } from 'express';
import { adminAuth } from '../config/firebase';

declare global {
  namespace Express {
    interface Request { user?: { uid: string; email?: string } }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token.' });
  }
  try {
    const decoded = await adminAuth.verifyIdToken(header.slice(7));
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
