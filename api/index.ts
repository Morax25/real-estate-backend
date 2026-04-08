import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app.js';
import connectDB from '../src/db/index.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
