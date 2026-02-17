const express = require('express')
const router = express.Router()
const {
  trackHeatmap,
  getHeatmap,
  startSession,
  trackSessionEvent,
  endSession,
  getSessionReplay,
  getSessions,
  getInsights
} = require('../controllers/analyticsController')
const { protect, authorize } = require('../middleware/auth')

// Public routes (tracking)
router.post('/heatmap', trackHeatmap)
router.post('/session/start', startSession)
router.post('/session/event', trackSessionEvent)
router.post('/session/end', endSession)

// Admin routes (viewing)
router.get('/heatmap/:page/:type', protect, authorize('admin'), getHeatmap)
router.get('/session/:sessionId', protect, authorize('admin'), getSessionReplay)
router.get('/sessions', protect, authorize('admin'), getSessions)
router.get('/insights/:page', protect, authorize('admin'), getInsights)

module.exports = router