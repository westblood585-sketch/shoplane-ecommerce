const GiftCard = require('../models/GiftCard')
const User = require('../models/User')
const Order = require('../models/Order')

// @desc    Hediye kartı satın al
// @route   POST /api/gift-cards/purchase
// @access  Private
exports.purchaseGiftCard = async (req, res, next) => {
  try {
    const { value, recipientEmail, recipientName, message } = req.body

    // Validate
    if (!value || value < 50 || value > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Hediye kartı değeri 50₺ - 5000₺ arasında olmalıdır'
      })
    }

    // Kod oluştur
    let code
    let isUnique = false
    
    while (!isUnique) {
      code = GiftCard.generateCode()
      const existing = await GiftCard.findOne({ code })
      if (!existing) isUnique = true
    }

    // Expiry date (1 yıl)
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)

    // Gift card oluştur
    const giftCard = await GiftCard.create({
      code,
      value,
      balance: value,
      purchaserId: req.user._id,
      recipientEmail: recipientEmail || req.user.email,
      recipientName: recipientName || req.user.name,
      message: message || '',
      expiryDate,
      isUsed: false,
      usedDate: null,
      usedBy: null
    })

    res.status(201).json({
      success: true,
      message: 'Hediye kartı başarıyla satın alındı',
      data: giftCard
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Hediye kartını kontrol et
// @route   GET /api/gift-cards/check/:code
// @access  Public
exports.checkGiftCard = async (req, res, next) => {
  try {
    const { code } = req.params

    const giftCard = await GiftCard.findOne({ code })
      .populate('purchaserId', 'name email')

    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Hediye kartı bulunamadı'
      })
    }

    // Expiry kontrol
    if (new Date() > giftCard.expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Hediye kartının süresi dolmuş'
      })
    }

    // Already used kontrol
    if (giftCard.isUsed) {
      return res.status(400).json({
        success: false,
        message: 'Bu hediye kartı zaten kullanılmış'
      })
    }

    res.json({
      success: true,
      data: {
        code: giftCard.code,
        balance: giftCard.balance,
        message: giftCard.message,
        recipientName: giftCard.recipientName,
        expiryDate: giftCard.expiryDate
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Hediye kartını kargo siparişine uygula
// @route   POST /api/gift-cards/apply
// @access  Private
exports.applyGiftCard = async (req, res, next) => {
  try {
    const { code, orderId } = req.body

    // Gift card kontrol
    const giftCard = await GiftCard.findOne({ code })

    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Hediye kartı bulunamadı'
      })
    }

    // Expiry kontrol
    if (new Date() > giftCard.expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Hediye kartının süresi dolmuş'
      })
    }

    // Already used kontrol
    if (giftCard.isUsed) {
      return res.status(400).json({
        success: false,
        message: 'Bu hediye kartı zaten kullanılmış'
      })
    }

    // Order kontrol
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      })
    }

    // Apply discount
    const discountAmount = Math.min(giftCard.balance, order.total)
    order.discountAmount = (order.discountAmount || 0) + discountAmount
    order.total = Math.max(0, order.total - discountAmount)

    await order.save()

    // Mark as used
    giftCard.isUsed = true
    giftCard.usedDate = new Date()
    giftCard.usedBy = req.user._id
    giftCard.balance = 0
    await giftCard.save()

    res.json({
      success: true,
      message: 'Hediye kartı başarıyla uygulandı',
      data: {
        discountAmount,
        newTotal: order.total
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Kullanıcının hediye kartlarını getir
// @route   GET /api/gift-cards/my-cards
// @access  Private
exports.getMyGiftCards = async (req, res, next) => {
  try {
    const giftCards = await GiftCard.find({ purchaserId: req.user._id })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: giftCards.length,
      data: giftCards
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Tüm hediye kartlarını getir (Admin)
// @route   GET /api/gift-cards/admin/all
// @access  Private/Admin
exports.getAllGiftCards = async (req, res, next) => {
  try {
    const giftCards = await GiftCard.find()
      .populate('purchaserId', 'name email')
      .populate('usedBy', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: giftCards.length,
      data: giftCards
    })
  } catch (error) {
    next(error)
  }
}
