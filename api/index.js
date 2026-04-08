import serverless from 'serverless-http';
import app from '../src/app.js';
import { connectDB } from '../src/db/index.js';
const handler = serverless(app);
export default async function handlerFn(req, res) {
  await connectDB();
  return handler(req, res);
}
//# sourceMappingURL=index.js.map
