const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const {
  startChat,
  sendMessage,
  getChatHistory,
  getUserChats,
  closeChat,
  deleteChat
} = require('../controllers/chatController')

// Tüm routes protected (giriş lazım)
router.use(protect)

router.post('/start', startChat)
router.post('/message', sendMessage)
router.get('/history/:chatId', getChatHistory)
router.get('/list', getUserChats)
router.put('/:chatId/close', closeChat)
router.delete('/:chatId', deleteChat)

module.exports = router