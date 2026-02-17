const express = require('express')
const router = express.Router()
const {
  getDashboardOverview,
  getRealtimeStats
} = require('../controllers/analyticsAggregationController')
const { protect, authorize } = require('../middleware/auth')

router.get('/dashboard', protect, authorize('admin'), getDashboardOverview)
router.get('/realtime', protect, authorize('admin'), getRealtimeStats)

module.exports = router