const pinoHttp = require('pino-http');
const logger = require('../config/logger');

/**
 * Logs every incoming request/response pair (method, path, status,
 * response time, and the authenticated user when available).
 */
const requestLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => `${req.method} ${req.url} completed ${res.statusCode}`,
  customErrorMessage: (req, res, err) => `${req.method} ${req.url} failed ${res.statusCode}: ${err.message}`,
  serializers: {
    req(req) {
      return { method: req.method, url: req.url, userId: req.raw.user?.id };
    },
  },
});

module.exports = requestLogger;
