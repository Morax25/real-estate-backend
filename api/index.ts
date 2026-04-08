import serverless from 'serverless-http';
import app from '../src/app.js';
import { connectDB } from '../src/db/index.js';

let isConnected = false;

const handler = async (req: any, res: any) => {
  console.log('🚀 Function invoked');

  try {
    if (!isConnected) {
      console.log('⚡ Connecting to DB...');
      await connectDB();
      isConnected = true;
    }
  } catch (error) {
    console.error('❌ DB failed:', error);

    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }

  return serverless(app)(req, res);
};

export default handler;
