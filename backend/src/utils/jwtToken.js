// JWT token oluştur ve cookie'ye kaydet
const sendToken = (user, statusCode, res) => {
  // Token oluştur
  const token = user.generateAuthToken()

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }

  // Kullanıcı objesinden şifreyi çıkar
  const userResponse = user.toObject()
  delete userResponse.password

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user: userResponse,
    token
  })
}

// User modeline token üretme metodu ekle
const jwt = require('jsonwebtoken')

const generateAuthToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

module.exports = { sendToken, generateAuthToken }