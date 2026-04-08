import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import app from './app.js';
import { connectDB } from './db/index.js';

const handler = serverless(app);

export default async function handlerFn(
  req: VercelRequest,
  res: VercelResponse
) {
  await connectDB();
  return handler(req, res);
}
