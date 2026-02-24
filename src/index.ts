import app from './app.ts';
import { PORT } from './configs/env.ts';
import connectDB from './db/index.ts';
import { logger } from './configs/logger.ts';

let server: ReturnType<typeof app.listen> | null = null;

const MAX_RETRIES = 5;
const BASE_DELAY = 2000;

const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const connectWithRetry = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logger.info({ message: 'Connecting to database', attempt });
      await connectDB();
      logger.info({ message: 'Database connected successfully' });
      return;
    } catch (error) {
      logger.error({
        message: 'Database connection failed',
        attempt,
        error
      });

      if (attempt === MAX_RETRIES) {
        logger.error({
          message: 'Max DB connection attempts reached. Exiting process.',
          attempts: attempt
        });
        process.exit(1);
      }

      const delay = BASE_DELAY * attempt;

      logger.warn({
        message: 'Retrying database connection',
        nextAttemptInMs: delay
      });

      await wait(delay);
    }
  }
};

const startServer = async () => {
  await connectWithRetry();

  server = app.listen(PORT, () => {
    logger.info({
      message: 'Server started successfully',
      port: PORT
    });
  });
};

const gracefulShutdown = (signal: string) => {
  logger.warn({ message: `Received ${signal}. Starting graceful shutdown.` });

  if (server) {
    server.close(() => {
      logger.info({ message: 'HTTP server closed successfully' });
      process.exit(0);
    });
  } else {
    process.exit(0);
  }

  setTimeout(() => {
    logger.error({
      message: 'Graceful shutdown timeout exceeded. Forcing exit.'
    });
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', (error) => {
  logger.error({
    message: 'Uncaught Exception',
    error
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error({
    message: 'Unhandled Rejection',
    reason
  });
  process.exit(1);
});

startServer();