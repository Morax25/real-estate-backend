import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { errorHandler } from './utils/errorHandler.ts';
import { healthCheck } from './controller/healthCheck.controller.ts';
import compression from 'compression';
import { corsConfig } from './configs/cors.ts';
import { notFoundHandler } from './controller/notFoundHandler.controller.ts';
import morgan from 'morgan';
import { loggerStream } from './configs/logger.ts';

const app = express();
app.use(morgan('combined', { stream: loggerStream }));
//middlewares

app.use(compression());
app.use(helmet());
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(cors(corsConfig));

app.use(
  express.json({
    limit: '16kb',
  })
);

app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

//Upcoming Routes section
app.get('/health', healthCheck);



// 404 fallback
app.use(notFoundHandler);

app.use(errorHandler);

export default app;
