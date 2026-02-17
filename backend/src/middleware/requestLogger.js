const logger = require('../utils/logger')

const requestLogger = (req, res, next) => {
  const startTime = Date.now()

  // Log request
  logger.info({
    type: 'request',
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  })

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime

    logger.info({
      type: 'response',
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    })
  })

  next()
}

module.exports = requestLogger
