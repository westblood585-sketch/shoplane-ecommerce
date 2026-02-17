const express = require('express')
const router = express.Router()
const {
  createFunnel,
  getFunnels,
  getFunnelAnalytics,
  startFunnelTracking,
  trackStepCompletion,
  getFunnelSessions,
  getDropOffAnalysis,
  getConversionPaths,
  compareSegments,
  updateFunnel,
  deleteFunnel
} = require('../controllers/funnelController')
const { protect, authorize } = require('../middleware/auth')

// Public routes (tracking)
router.post('/:id/start', startFunnelTracking)
router.post('/:id/step/:stepIndex', trackStepCompletion)

// Admin routes
router.post('/', protect, authorize('admin'), createFunnel)
router.get('/', protect, authorize('admin'), getFunnels)
router.get('/:id/analytics', protect, authorize('admin'), getFunnelAnalytics)
router.get('/:id/sessions', protect, authorize('admin'), getFunnelSessions)
router.get('/:id/dropoff', protect, authorize('admin'), getDropOffAnalysis)
router.get('/:id/paths', protect, authorize('admin'), getConversionPaths)
router.post('/:id/compare', protect, authorize('admin'), compareSegments)
router.put('/:id', protect, authorize('admin'), updateFunnel)
router.delete('/:id', protect, authorize('admin'), deleteFunnel)

module.exports = router