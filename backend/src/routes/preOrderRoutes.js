const express = require('express')
const router = express.Router()
const {
    createPreOrder,
    getMyPreOrders,
    getPreOrder,
    payDeposit,
    payRemaining,
    cancelPreOrder,
    getAllPreOrders,
    updatePreOrderStatus
} = require('../controllers/preOrderController')
const { protect, authorize } = require('../middleware/auth')

// User routes
router.post('/', protect, createPreOrder)
router.get('/my-orders', protect, getMyPreOrders)
router.get('/:id', protect, getPreOrder)
router.post('/:id/pay-deposit', protect, payDeposit)
router.post('/:id/pay-remaining', protect, payRemaining)
router.post('/:id/cancel', protect, cancelPreOrder)

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllPreOrders)
router.put('/:id/status', protect, authorize('admin'), updatePreOrderStatus)

module.exports = router
