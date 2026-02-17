const GuestOrder = require('../models/GuestOrder')
const Product = require('../models/Product')
const emailService = require('../services/EmailService')
const crypto = require('crypto')

// @desc    Misafir sipariş oluştur
// @route   POST /api/guest-orders
// @access  Public
const createGuestOrder = async (req, res, next) => {
  try {
    const {
      guestEmail,
      guestName,
      guestPhone,
      items,
      shippingAddress,
      paymentMethod,
      acceptsMarketing
    } = req.body

    // Stok kontrolü
    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Ürün bulunamadı: ${item.product}`
        })
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} için yeterli stok yok`
        })
      }
    }

    // Toplam fiyat hesapla
    let totalPrice = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      totalPrice += product.price * item.quantity
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]
      })

      // Stoktan düş
      product.stock -= item.quantity
      await product.save()
    }

    // Kargo ücreti (500₺ üzeri ücretsiz)
    const shippingPrice = totalPrice >= 500 ? 0 : 29.99
    totalPrice += shippingPrice

    // Sipariş numarası oluştur
    const orderNumber = 'GO-' + Date.now().toString().slice(-8)
    
    // Tracking token (email ile sipariş takibi için)
    const trackingToken = crypto.randomBytes(32).toString('hex')

    // Sipariş oluştur
    const order = await GuestOrder.create({
      guestEmail,
      guestName,
      guestPhone,
      orderNumber,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      shippingPrice,
      trackingToken,
      acceptsMarketing
    })

    // Email gönder
    await emailService.sendOrderConfirmation(order, {
      name: guestName,
      email: guestEmail
    })

    res.status(201).json({
      success: true,
      order,
      trackingToken,
      message: 'Sipariş başarıyla oluşturuldu. Takip linki email adresinize gönderildi.'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Misafir sipariş takibi (Token ile)
// @route   GET /api/guest-orders/track/:token
// @access  Public
const trackGuestOrder = async (req, res, next) => {
  try {
    const order = await GuestOrder.findOne({
      trackingToken: req.params.token
    }).populate('items.product', 'name images')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Email ile sipariş sorgula
// @route   POST /api/guest-orders/track-by-email
// @access  Public
const trackByEmail = async (req, res, next) => {
  try {
    const { email, orderNumber } = req.body

    const order = await GuestOrder.findOne({
      guestEmail: email.toLowerCase(),
      orderNumber
    }).populate('items.product', 'name images')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı. Email ve sipariş numarasını kontrol edin.'
      })
    }

    res.status(200).json({
      success: true,
      order,
      trackingToken: order.trackingToken
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createGuestOrder,
  trackGuestOrder,
  trackByEmail
}