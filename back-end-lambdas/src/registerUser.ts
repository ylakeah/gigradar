import { APIGatewayProxyHandler } from 'aws-lambda';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const uri = process.env.MONGODB_URI!;
let client: MongoClient;

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  }

  const db = client.db('chat-app');
  const users = db.collection('users');

  const { username, password } = JSON.parse(event.body!);

  const hashedPassword = await bcrypt.hash(password, 10);
  await users.insertOne({ username, password: hashedPassword });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'User registered successfully' }),
  };
};
