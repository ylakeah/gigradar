import jwt from 'jsonwebtoken';
import { User } from './types';
import mongoose from 'mongoose';

export function verifyJWT(token: string): User {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, username: string };
  return {
    id: decoded.id,
    username: decoded.username,
  };
}
