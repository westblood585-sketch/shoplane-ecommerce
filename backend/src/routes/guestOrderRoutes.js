const express = require('express')
const router = express.Router()
const {
  createGuestOrder,
  trackGuestOrder,
  trackByEmail
} = require('../controllers/guestOrderController')

router.post('/', createGuestOrder)
router.get('/track/:token', trackGuestOrder)
router.post('/track-by-email', trackByEmail)

module.exports = router