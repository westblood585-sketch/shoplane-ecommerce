const express = require('express')
const router = express.Router()
const {
    getGiftWraps,
    getGiftWrap,
    createGiftWrap,
    updateGiftWrap,
    deleteGiftWrap
} = require('../controllers/giftWrapController')
const { protect, admin } = require('../middleware/auth')

// Public routes
router.get('/', getGiftWraps)
router.get('/:id', getGiftWrap)

// Admin routes
router.post('/', protect, admin, createGiftWrap)
router.put('/:id', protect, admin, updateGiftWrap)
router.delete('/:id', protect, admin, deleteGiftWrap)

module.exports = router