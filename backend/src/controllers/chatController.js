const Chat = require('../models/Chat')

// Basit bot yanıtları
const botResponses = {
  'merhaba': 'Merhaba! Size nasıl yardımcı olabilirim?',
  'sipariş': 'Siparişlerinizi "Siparişlerim" sayfasından takip edebilirsiniz.',
  'kargo': 'Kargo takip numaranız e-posta ile tarafınıza iletilecektir. Genellikle 2-4 iş günü içinde teslimat yapılmaktadır.',
  'iade': '14 gün içinde kullanılmamış ürünler için iade hakkınız bulunmaktadır.',
  'ödeme': 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçenekleri mevcuttur.',
  'indirim': 'Aktif kampanyalarımız için ana sayfayı ziyaret edebilirsiniz.',
  'iletişim': 'Bize destek@myshop.com adresinden ulaşabilirsiniz.',
  'çalışma saatleri': 'Müşteri hizmetlerimiz Pazartesi-Cuma 09:00-18:00 saatleri arasında hizmet vermektedir.',
  'default': 'Anlayamadım. Lütfen daha açık bir şekilde sorunuzu belirtin veya canlı destek için bekleyin.'
}

const getBotResponse = (message) => {
  const lowerMessage = message.toLowerCase()
  
  for (const [keyword, response] of Object.entries(botResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response
    }
  }
  
  return botResponses.default
}

// @desc    Sohbet başlat veya devam ettir
// @route   GET /api/chat
// @access  Private
exports.getOrCreateChat = async (req, res, next) => {
  try {
    let chat = await Chat.findOne({ 
      user: req.user.id,
      status: { $ne: 'closed' }
    }).sort({ createdAt: -1 })

    if (!chat) {
      chat = await Chat.create({
        user: req.user.id,
        messages: [{
          sender: 'bot',
          message: 'Merhaba! Size nasıl yardımcı olabilirim?'
        }]
      })
    }

    res.status(200).json({
      success: true,
      chat
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Mesaj gönder
// @route   POST /api/chat/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body

    let chat = await Chat.findOne({ 
      user: req.user.id,
      status: { $ne: 'closed' }
    })

    if (!chat) {
      chat = await Chat.create({
        user: req.user.id,
        messages: []
      })
    }

    // Kullanıcı mesajını ekle
    chat.messages.push({
      sender: 'user',
      message
    })

    // Bot yanıtı ekle
    const botResponse = getBotResponse(message)
    chat.messages.push({
      sender: 'bot',
      message: botResponse
    })

    chat.lastMessage = Date.now()
    await chat.save()

    // Socket.io ile gerçek zamanlı güncelleme
    if (global.io) {
      global.io.to(`user-${req.user.id}`).emit('new-message', {
        sender: 'bot',
        message: botResponse,
        timestamp: new Date()
      })

      // Admin'e bildirim
      global.io.to('admin-room').emit('user-message', {
        userId: req.user.id,
        userName: req.user.name,
        message,
        chatId: chat._id
      })
    }

    res.status(200).json({
      success: true,
      chat
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Tüm sohbetleri getir (Admin)
// @route   GET /api/chat/all
// @access  Private/Admin
exports.getAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.find()
      .populate('user', 'name email')
      .sort({ lastMessage: -1 })

    res.status(200).json({
      success: true,
      count: chats.length,
      chats
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Admin mesaj gönder
// @route   POST /api/chat/:chatId/admin-message
// @access  Private/Admin
exports.sendAdminMessage = async (req, res, next) => {
  try {
    const { message } = req.body
    const chat = await Chat.findById(req.params.chatId)

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Sohbet bulunamadı'
      })
    }

    chat.messages.push({
      sender: 'admin',
      message
    })

    chat.assignedTo = req.user.id
    chat.lastMessage = Date.now()
    await chat.save()

    // Kullanıcıya bildirim
    if (global.io) {
      global.io.to(`user-${chat.user}`).emit('new-message', {
        sender: 'admin',
        message,
        timestamp: new Date()
      })
    }

    res.status(200).json({
      success: true,
      chat
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Sohbeti kapat
// @route   PUT /api/chat/:chatId/close
// @access  Private/Admin
exports.closeChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.chatId)

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Sohbet bulunamadı'
      })
    }

    chat.status = 'closed'
    await chat.save()

    res.status(200).json({
      success: true,
      message: 'Sohbet kapatıldı'
    })
  } catch (error) {
    next(error)
  }
}