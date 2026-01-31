const express = require('express')
const router = express.Router()
const {
  getDashboardStats,
  getSalesReport
} = require('../controllers/analyticsController')
const { protect, admin } = require('../middleware/auth')

router.use(protect, admin)

router.get('/dashboard', getDashboardStats)
router.get('/sales-report', getSalesReport)

module.exports = router