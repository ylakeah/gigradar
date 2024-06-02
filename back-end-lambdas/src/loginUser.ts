import { APIGatewayProxyHandler } from 'aws-lambda';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const uri = process.env.MONGODB_URI!;
const secret = process.env.JWT_SECRET!;
let client: MongoClient;

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  }

  const db = client.db('chat-app');
  const users = db.collection('users');

  const { username, password } = JSON.parse(event.body!);

  const user = await users.findOne({ username });
  console.log(user,' ini');
  
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, username }, secret, { expiresIn: '1h' });
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid credentials' }),
    };
  }
};
