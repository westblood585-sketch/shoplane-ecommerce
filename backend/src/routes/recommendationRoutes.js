const express = require('express')
const router = express.Router()
const {
  getHomeRecommendations,
  getProductRecommendations,
  trackProductView,
  trackSearch,
  trackCartAction,
  getRecommendationStats
} = require('../controllers/recommendationController')
const { protect, authorize } = require('../middleware/auth')

// User routes
router.get('/home', protect, getHomeRecommendations)
router.get('/product/:productId', getProductRecommendations)

// Tracking routes
router.post('/track/view', protect, trackProductView)
router.post('/track/search', protect, trackSearch)
router.post('/track/cart', protect, trackCartAction)

// Admin routes
router.get('/admin/stats', protect, authorize('admin'), getRecommendationStats)

module.exports = router