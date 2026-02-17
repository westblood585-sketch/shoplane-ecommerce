const express = require('express')
const router = express.Router()
const {
  trackTouchpoint,
  getMyJourney,
  getJourneyVisualization,
  getAllJourneys,
  analyzePatterns,
  getHighIntentUsers,
  getJourneyStats
} = require('../controllers/journeyController')
const { protect, authorize } = require('../middleware/auth')

// Public routes
router.post('/track', trackTouchpoint)

// User routes
router.get('/my-journey', protect, getMyJourney)

// Admin routes
router.get('/stats', protect, authorize('admin'), getJourneyStats)
router.get('/high-intent', protect, authorize('admin'), getHighIntentUsers)
router.post('/analyze', protect, authorize('admin'), analyzePatterns)
router.get('/:journeyId', protect, authorize('admin'), getJourneyVisualization)
router.get('/', protect, authorize('admin'), getAllJourneys)

module.exports = router