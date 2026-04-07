import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const isDev = process.env.NODE_ENV !== 'production';

const logFormat = printf(
  ({ level, message, timestamp, stack, ...metadata }) => {
    const meta = Object.keys(metadata).length
      ? `\n${JSON.stringify(metadata, null, 2)}`
      : '';
    const stackTrace = stack ? `\n${stack}` : '';
    return `[${timestamp}] ${level}: ${message}${meta}${stackTrace}`;
  }
);

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  logFormat
);

const prodFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  logFormat
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isDev ? devFormat : prodFormat,
  }),
];

// only write to files locally — Vercel filesystem is read-only
if (isDev) {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/app.log' })
  );
}

export const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  format: prodFormat,
  transports,
});

export const loggerStream = {
  write: (message: string) => logger.info(message.trim()),
};
