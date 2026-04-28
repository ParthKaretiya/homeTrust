'use strict';
/**
 * config/logger.js – Winston logger instance
 * Logs errors to logs/error.log, combined to logs/combined.log,
 * and all levels to console in development.
 */

const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  transports: [
    new transports.File({
      filename: path.join(__dirname, '..', 'logs', 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join(__dirname, '..', 'logs', 'combined.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

// Console transport for non-production
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), logFormat),
  }));
}

module.exports = logger;
