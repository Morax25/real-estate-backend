import winston from 'winston';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const isProd = process.env.NODE_ENV === 'production';

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metadata = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : '';
    const stackTrace = stack ? `\n${stack}` : '';
    return `[${timestamp}] ${level}: ${message}${metadata}${stackTrace}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isProd ? prodFormat : devFormat
  })
];

if (!isProd && process.env.ENABLE_FILE_LOGS === 'true') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/app.log'
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  format: prodFormat,
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'app',
    env: process.env.NODE_ENV
  },
  transports,
  exceptionHandlers: [
    new winston.transports.Console({
      format: isProd ? prodFormat : devFormat
    })
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: isProd ? prodFormat : devFormat
    })
  ],
  exitOnError: true
});

export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};