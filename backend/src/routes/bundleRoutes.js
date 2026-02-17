const express = require('express')
const router = express.Router()
const {
  getBundles,
  getBundleById,
  createBundle,
  updateBundle,
  deleteBundle
} = require('../controllers/bundleController')
const { protect, admin } = require('../middleware/auth')

// Public
router.get('/', getBundles)
router.get('/:id', getBundleById)

// Admin
router.post('/', protect, admin, createBundle)
router.put('/:id', protect, admin, updateBundle)
router.delete('/:id', protect, admin, deleteBundle)

module.exports = router