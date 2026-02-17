const express = require('express')
const router = express.Router()
const {
  getOrCreateChat,
  sendMessage,
  getAllChats,
  sendAdminMessage,
  closeChat
} = require('../controllers/chatController')
const { protect, admin } = require('../middleware/auth')

router.use(protect)

router.get('/', getOrCreateChat)
router.post('/message', sendMessage)

// Admin routes
router.get('/all', admin, getAllChats)
router.post('/:chatId/admin-message', admin, sendAdminMessage)
router.put('/:chatId/close', admin, closeChat)

module.exports = router