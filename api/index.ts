import serverless from 'serverless-http';
import app from '../src/app.js';
import { connectDB } from '../src/db/index.js';

const serverlessApp = serverless(app);

const handler = async (req: any, res: any) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('❌ DB failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }

  return serverlessApp(req, res);
};

export default handler;
