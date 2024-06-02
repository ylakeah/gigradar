import { APIGatewayProxyHandler } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const secretKey = process.env.JWT_SECRET!;
let client: MongoClient;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!client) {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
    }

    const { currentPassword, newPassword } = JSON.parse(event.body || '{}');
    const token = event.headers.Authorization;

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const decoded: any = jwt.verify(token, secretKey);

    const userId = decoded.id;
    var ObjectId = require('mongodb').ObjectId;

    const db = client.db('chat-app');
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Current password is incorrect' }),
      };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db
      .collection('users')
      .updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedNewPassword } });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password changed successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
