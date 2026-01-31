const User = require('../models/User')
const { sendToken } = require('../utils/jwtToken')
const crypto = require('crypto')
const { sendWelcomeEmail } = require('../utils/emailService')

// @desc    Kayıt ol
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body

    // Kullanıcı var mı kontrol et
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      })
    }

    // Kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password,
      phone
    })

    // Hoş geldin maili gönder
    sendWelcomeEmail(user)

    // Token gönder
    sendToken(user, 201, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Giriş yap
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Email ve şifre kontrolü
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen e-posta ve şifrenizi girin'
      })
    }

    // Kullanıcıyı bul (şifre ile birlikte)
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'E-posta veya şifre hatalı'
      })
    }

    // Şifre kontrolü
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'E-posta veya şifre hatalı'
      })
    }

    // Token gönder
    sendToken(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Çıkış yap
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    })

    res.status(200).json({
      success: true,
      message: 'Çıkış başarılı'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Google ile giriş
// @route   POST /api/auth/google-login
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token gerekli'
      })
    }

    // NOT: Gerçek Google OAuth için google-auth-library-nodejs kullanılmalı
    // Şimdilik token'ı base64'ten decode et ve email al
    try {
      // Google JWT token'ını parse et (OP basit şekilde payload al)
      const parts = token.split('.')
      if (parts.length !== 3) {
        throw new Error('Geçersiz token format')
      }

      // Payload kısmını decode et
      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf-8')
      )

      const { email, name, picture } = payload

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'E-posta bilgisi alınamadı'
        })
      }

      // Kullanıcı var mı kontrol et
      let user = await User.findOne({ email })

      if (!user) {
        // Yeni kullanıcı oluştur
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          password: Math.random().toString(36).substring(2, 15), // Random password
          avatar: picture,
          isEmailVerified: true // Google sayesinde mail doğrulanmış
        })

        // Hoş geldin maili gönder
        const { sendWelcomeEmail } = require('../utils/emailService')
        sendWelcomeEmail(user)
      }

      // Token gönder
      const { sendToken } = require('../utils/jwtToken')
      sendToken(user, 200, res)
    } catch (tokenError) {
      console.error('Token parse error:', tokenError)
      return res.status(400).json({
        success: false,
        message: 'Token doğrulaması başarısız'
      })
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Mevcut kullanıcı bilgisi
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Profil güncelle
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Şifre değiştir
// @route   PUT /api/auth/password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select('+password')

    // Mevcut şifre kontrolü
    const isPasswordMatched = await user.comparePassword(currentPassword)

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Mevcut şifre hatalı'
      })
    }

    // Yeni şifreyi kaydet
    user.password = newPassword
    await user.save()

    sendToken(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Şifremi unuttum
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı'
      })
    }

    // Reset token oluştur
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hash'lenmiş token'ı kaydet
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Token süresini ayarla (10 dakika)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    await user.save({ validateBeforeSave: false })

    // Reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    // TODO: E-posta gönder (Nodemailer ile)
    // Şimdilik sadece response dön
    res.status(200).json({
      success: true,
      message: 'Şifre sıfırlama bağlantısı e-postanıza gönderildi',
      resetToken // Geliştirme aşamasında - production'da kaldırılmalı
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Şifre sıfırla
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params
    const { password } = req.body

    // Hash'lenmiş token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token'
      })
    }

    // Yeni şifreyi kaydet
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendToken(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Social Login (Google, Facebook, Apple)
// @route   POST /api/auth/social-login
// @access  Public
exports.socialLogin = async (req, res, next) => {
  try {
    const { provider, uid, email, name, avatar } = req.body

    // Validate
    if (!provider || !uid || !email) {
      return res.status(400).json({
        success: false,
        message: 'Provider, UID ve email gerekli'
      })
    }

    // Kullanıcıyı email'e göre bul
    let user = await User.findOne({ email })

    if (!user) {
      // Yeni kullanıcı oluştur
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: Math.random().toString(36).slice(-8) + uid.slice(-8), // Random password
        phone: '0000000000', // Placeholder
        avatar: avatar || '',
        socialAuth: {
          [provider]: uid
        }
      })
    } else {
      // Mevcut kullanıcıya social auth bilgisi ekle
      if (!user.socialAuth) {
        user.socialAuth = {}
      }
      user.socialAuth[provider] = uid
      
      // Avatar yoksa güncelle
      if (!user.avatar && avatar) {
        user.avatar = avatar
      }
      
      await user.save()
    }

    // Token gönder
    sendToken(user, 200, res)
  } catch (error) {
    next(error)
  }
}