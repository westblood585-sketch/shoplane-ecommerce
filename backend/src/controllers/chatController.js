const Chat = require('../models/Chat')
const User = require('../models/User')

// Bot yanıt logic
function getBotResponse(userMessage) {
  const msg = userMessage.toLowerCase()

  const responses = {
    greeting: [
      'Merhaba! 👋 Size nasıl yardımcı olabilirim?',
      'Hoş geldiniz! 😊'
    ],
    siparis: [
      'Siparişlerinizi "Siparişlerim" sayfasından takip edebilirsiniz. 📦'
    ],
    kargo: [
      'Genellikle 2-4 iş günü içinde teslimat yapılır. 🚚'
    ],
    iade: [
      '14 gün içinde kullanılmamış ürünler için iade hakkınız bulunmaktadır. 🔄'
    ],
    default: [
      'Üzgünüm, anlayamadım. Daha açık bir şekilde sorabilir misiniz?'
    ]
  }

  if (msg.includes('merhaba') || msg.includes('selam')) {
    return responses.greeting[0]
  } else if (msg.includes('sipariş') || msg.includes('siparis')) {
    return responses.siparis[0]
  } else if (msg.includes('kargo') || msg.includes('teslimat')) {
    return responses.kargo[0]
  } else if (msg.includes('iade')) {
    return responses.iade[0]
  }

  return responses.default[0]
}

// Sohbet başlat
exports.startChat = async (req, res) => {
  try {
    const chat = new Chat({
      userId: req.user.id,
      messages: [{
        id: Date.now().toString(),
        sender: 'bot',
        message: `Merhaba ${req.user.name}! 👋 Size nasıl yardımcı olabilirim?`,
        timestamp: new Date()
      }]
    })

    await chat.save()
    res.status(201).json({ success: true, chat })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Mesaj gönder
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body

    const chat = await Chat.findById(chatId)
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' })

    // Kullanıcı mesajını ekle
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message,
      timestamp: new Date()
    }
    chat.messages.push(userMessage)

    // Bot yanıtı
    const botResponse = getBotResponse(message)
    const botMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      message: botResponse,
      timestamp: new Date()
    }
    chat.messages.push(botMessage)

    chat.updatedAt = new Date()
    await chat.save()

    res.status(200).json({ 
      success: true, 
      userMessage,
      botMessage,
      chat 
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Sohbet geçmişi
exports.getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' })

    res.status(200).json({ success: true, chat })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Tüm sohbetler
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)

    res.status(200).json({ success: true, chats })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Sohbet kapat
exports.closeChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      { status: 'closed' },
      { new: true }
    )

    res.status(200).json({ success: true, chat })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Sohbet sil
exports.deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.chatId)
    res.status(200).json({ success: true, message: 'Chat deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}