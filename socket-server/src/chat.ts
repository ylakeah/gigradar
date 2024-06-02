import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { Message as IMessage, User } from './types';

const messageSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
  },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  replyTo: String,
  image: String,
});

const Message = mongoose.model('Message', messageSchema, 'messages');

export function handleChat(io: Server, socket: Socket) {
  socket.on('message', async (data: { content: string, replyTo?: string, image?: string }) => {
    const user = socket.data.user;
    const messageData: IMessage = {
      user: {
        id: user.id,
        username: user.username,
      },
      content: data.content,
      timestamp: new Date(),
      replyTo: data.replyTo,
      image: data.image,
    };

    const savedMessage = await new Message(messageData).save();

    const emittedMessage = {
      _id: savedMessage._id,
      user: {
        id: savedMessage!.user!.id,
        username: savedMessage!.user!.username,
      },
      content: savedMessage.content,
      timestamp: savedMessage.timestamp,
      replyTo: savedMessage.replyTo,
      image: savedMessage.image,
    };

    console.log(emittedMessage, 'emitted');
    
    io.emit('message', emittedMessage);
  });

// Handle retrieving messages
socket.on('getMessages', async (offset: number) => {
    try {
      const messages = await Message.find()
        .sort({ timestamp: -1 })
        .skip(offset)
        .limit(25)
        .lean()
        .exec();
      socket.emit('messages', messages.reverse());
    } catch (error) {
      console.error('Error retrieving messages:', error);
    }
  });
}
