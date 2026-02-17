const express = require('express')
const router = express.Router()
const { sendCampaignEmail, sendTestEmail } = require('../controllers/emailController')
const { protect } = require('../middleware/auth')

// Test email gönder
router.post('/test', protect, sendTestEmail)

// Kampanya emaili gönder
router.post('/campaign', protect, sendCampaignEmail)

// Test abandoned cart emaili gönder
router.post('/test-abandoned-cart', protect, async (req, res) => {
  try {
    const emailService = require('../utils/emailService')
    
    await emailService.sendAbandonedCartEmail(req.user, {
      items: [],
      totalPrice: 0
    })

    res.status(200).json({
      success: true,
      message: 'Test abandoned cart email gönderildi'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router