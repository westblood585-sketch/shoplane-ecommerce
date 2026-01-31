const express = require('express')
const router = express.Router()
const {
  register,
  login,
  logout,
  googleLogin,
  socialLogin,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController')
const { protect } = require('../middleware/auth')

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/google-login', googleLogin)
router.post('/social-login', socialLogin)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:resetToken', resetPassword)

// Protected routes
router.post('/logout', protect, logout)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/password', protect, changePassword)

module.exports = router