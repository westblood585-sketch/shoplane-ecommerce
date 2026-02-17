const express = require('express')
const router = express.Router()
const {
  purchaseGiftCard,
  checkGiftCard,
  applyGiftCard,
  getMyGiftCards,
  getAllGiftCards
} = require('../controllers/giftCardController')
const { protect, admin } = require('../middleware/auth')

// Public
router.get('/check/:code', checkGiftCard)

// Private
router.post('/purchase', protect, purchaseGiftCard)
router.post('/apply', protect, applyGiftCard)
router.get('/my-cards', protect, getMyGiftCards)

// Admin
router.get('/admin/all', protect, admin, getAllGiftCards)

module.exports = router