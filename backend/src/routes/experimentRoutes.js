const express = require('express')
const router = express.Router()
const {
  createExperiment,
  getExperiments,
  getExperiment,
  updateExperiment,
  startExperiment,
  pauseExperiment,
  completeExperiment,
  getActiveExperimentsForPage,
  trackEvent,
  deleteExperiment
} = require('../controllers/experimentController')
const { protect, authorize } = require('../middleware/auth')

// Public routes
router.get('/active/:page', getActiveExperimentsForPage)
router.post('/track', trackEvent)

// Admin routes
router.post('/', protect, authorize('admin'), createExperiment)
router.get('/', protect, authorize('admin'), getExperiments)
router.get('/:id', protect, authorize('admin'), getExperiment)
router.put('/:id', protect, authorize('admin'), updateExperiment)
router.post('/:id/start', protect, authorize('admin'), startExperiment)
router.post('/:id/pause', protect, authorize('admin'), pauseExperiment)
router.post('/:id/complete', protect, authorize('admin'), completeExperiment)
router.delete('/:id', protect, authorize('admin'), deleteExperiment)

module.exports = router