const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

// Helmet - Security headers
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://api.anthropic.com"]
    }
  },
  crossOriginEmbedderPolicy: false
})

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5178'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// Rate limiting (lenient in development, strict in production)
const isDev = process.env.NODE_ENV !== 'production'

const limiter = rateLimit({
  windowMs: isDev ? 60 * 60 * 1000 : 15 * 60 * 1000, // 1 hour (dev) / 15 min (prod)
  max: isDev ? 10000 : 100, // 10000 requests per hour (dev) / 100 per 15min (prod)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev // Skip rate limiting in development entirely
})

// API rate limiter (stricter)
const apiLimiter = rateLimit({
  windowMs: isDev ? 60 * 60 * 1000 : 15 * 60 * 1000,
  max: isDev ? 10000 : 50,
  message: 'Too many API requests, please try again later.',
  skip: () => isDev // Skip in development
})

// Auth rate limiter (very strict)
const authLimiter = rateLimit({
  windowMs: isDev ? 60 * 60 * 1000 : 15 * 60 * 1000,
  max: isDev ? 10000 : 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: !isDev, // Only skip successful requests in production
  skip: () => isDev // Skip in development
})

// Payment rate limiter
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 1000 : 10,
  message: 'Too many payment requests, please contact support.',
  skip: () => isDev // Skip in development
})

module.exports = {
  helmetConfig,
  corsOptions: cors(corsOptions),
  mongoSanitize: (req, res, next) => next(),
  xss: (req, res, next) => next(),
  hpp: hpp(),
  limiter,
  apiLimiter,
  authLimiter,
  paymentLimiter
}