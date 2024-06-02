import mongoose from 'mongoose';

export interface User {
  id: string;
  username: string;
}

export interface Message {
  user: User;
  content: string;
  timestamp: Date;
  replyTo?: string;
  image?: string;
}
