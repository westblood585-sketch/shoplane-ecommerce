const logger = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const log = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      userAgent: req.get('user-agent')?.substring(0, 50)
    }
    
    if (process.env.NODE_ENV === 'production') {
      // Production'da sadece error logları
      if (res.statusCode >= 400) {
        console.error(`[ERROR] ${JSON.stringify(log)}`)
      }
    } else {
      // Development'ta tüm loglar
      console.log(`[LOG] ${JSON.stringify(log)}`)
    }
  })
  
  next()
}

module.exports = logger
