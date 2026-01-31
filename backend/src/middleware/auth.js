const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Token'ı doğrula ve kullanıcıyı getir
exports.protect = async (req, res, next) => {
  try {
    let token

    // Header'dan token al
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    // Cookie'den token al
    else if (req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Lütfen giriş yapın'
      })
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Kullanıcıyı bul
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Yetkilendirme başarısız'
    })
  }
}

// Admin kontrolü
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({
      success: false,
      message: 'Bu işlem için admin yetkisi gereklidir'
    })
  }
}