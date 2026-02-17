const express = require('express')
const router = express.Router()
const {
  applyAsInfluencer,
  getMyProfile,
  getDashboard,
  trackClick,
  trackOrder,
  requestPayout,
  updateProfile,
  getAllInfluencers,
  reviewApplication
} = require('../controllers/influencerController')
const { protect, authorize } = require('../middleware/auth')

// Public routes
router.post('/track-click', trackClick)

// User routes
router.post('/apply', protect, applyAsInfluencer)
router.get('/me', protect, getMyProfile)
router.get('/dashboard', protect, getDashboard)
router.post('/request-payout', protect, requestPayout)
router.put('/profile', protect, updateProfile)

// Internal routes (Order service)
router.post('/track-order', trackOrder)

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllInfluencers)
router.put('/admin/:id/review', protect, authorize('admin'), reviewApplication)

module.exports = router