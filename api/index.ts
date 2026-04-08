import serverless from 'serverless-http';
import app from '../src/app.js';
import connectDB from '../src/db/index.js';
await connectDB().catch((err) => {
  console.error('Failed to connect to DB:', err);
});
export default serverless(app, { binary: false });
