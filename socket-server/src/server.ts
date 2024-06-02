import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { handleChat } from './chat';
import { verifyJWT } from './middlewares';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});


mongoose.connect(process.env.MONGODB_URI!, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const user = verifyJWT(token);
      console.log(user,'user');
      
      socket.data.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected:', socket.data.user);

  handleChat(io, socket);

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.data.user);
  });
});

httpServer.listen(3005, () => {
  console.log('listening on *:3005');
});
