const pino = require('pino');
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', '..', 'logs');
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

if (!isProd && !isTest && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const transport = isTest
  ? undefined
  : isProd
    ? undefined
    : pino.transport({
        targets: [
          // Pretty console output for developers
          {
            target: 'pino-pretty',
            level: process.env.LOG_LEVEL || 'info',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
          // Persistent JSON file logs for development
          {
            target: 'pino/file',
            level: 'info',
            options: {
              destination: path.join(logDir, 'app.log'),
              mkdir: true,
            },
          },
          // Separate file capturing only errors/exceptions
          {
            target: 'pino/file',
            level: 'error',
            options: {
              destination: path.join(logDir, 'error.log'),
              mkdir: true,
            },
          },
        ],
      });

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    base: { service: 'notes-app-api' },
    redact: ['req.headers.authorization', 'password', 'req.body.password'],
    silent: isTest,
  },
  transport
);

module.exports = logger;