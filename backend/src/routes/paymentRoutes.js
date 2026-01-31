const express = require('express')
const router = express.Router()
const {
  initiatePayment,
  initiate3DPayment
} = require('../controllers/paymentController')
const { protect } = require('../middleware/auth')

router.post('/checkout', protect, initiatePayment)
router.post('/3d-secure', protect, initiate3DPayment)

module.exports = router