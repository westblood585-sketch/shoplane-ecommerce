const User = require('../models/User')
const { sendToken } = require('../utils/jwtToken')
const crypto = require('crypto')
const emailService = require('../utils/emailService')

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

    // WELCOME EMAIL GÖNDER - YENİ
    await emailService.sendWelcomeEmail(user)

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

    if (!provider || !uid || !email) {
      return res.status(400).json({
        success: false,
        message: 'Provider, UID ve email alanları gerekli'
      })
    }

    // Kullanıcıyı provider'a göre bul
    const query = {}
    query[`socialProviders.${provider}.uid`] = uid

    let user = await User.findOne({
      $or: [
        query,
        { email }
      ]
    })

    if (user) {
      // Eğer mevcut provider'ı bağlı değilse, bağla
      if (!user.socialProviders[provider]?.connected) {
        user.socialProviders[provider] = {
          uid,
          email,
          avatar: avatar || '',
          connected: true
        }
        // Avatar güncelle eğer yoksa
        if (!user.avatar && avatar) {
          user.avatar = avatar
        }
        await user.save()
      }
    } else {
      // Yeni kullanıcı oluştur
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        phone: '', // Social users don't have phone initially
        avatar: avatar || '',
        socialProviders: {
          [provider]: {
            uid,
            email,
            avatar: avatar || '',
            connected: true
          }
        }
      })

      // Loyalty Program otomatik oluştur
      try {
        const LoyaltyProgram = require('../models/LoyaltyProgram')
        await LoyaltyProgram.create({
          userId: user._id,
          totalPoints: 0,
          currentPoints: 0,
          tier: 'bronze',
          joinDate: new Date()
        })
      } catch (loyaltyError) {
        // Loyalty program oluşturulamazsa continue et
        console.log('Loyalty program oluşturulamadı:', loyaltyError.message)
      }
    }

    // Token gönder
    sendToken(user, 200, res)
  } catch (error) {
    next(error)
  }
}