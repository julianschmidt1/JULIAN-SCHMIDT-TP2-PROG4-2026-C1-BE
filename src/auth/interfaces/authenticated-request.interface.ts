import { JwtPayload } from './jwt-payload.interface';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
