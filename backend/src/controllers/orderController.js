const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')
const { sendOrderConfirmation, sendShippingNotification } = require('../utils/emailService')
const { sendOrderStatusUpdate, sendNewOrderNotification } = require('../utils/notificationService')

// @desc    Sipariş oluştur
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingPrice,
      discount,
      totalPrice,
      couponCode
    } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sepetinizde ürün bulunmuyor'
      })
    }

    // Stok kontrolü ve ürün bilgilerini güncelle
    for (let item of items) {
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
          message: `${product.name} ürünü için yeterli stok yok`
        })
      }

      // Stoktan düş
      product.stock -= item.quantity
      await product.save()
    }

    // Sipariş oluştur
    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingPrice,
      discount,
      totalPrice,
      couponCode,
      cargoCompany: 'Aras Kargo',
      trackingNumber: `TRK${Date.now()}`
    })

    await order.populate('items.product', 'name images')

    // Email gönder
    const user = await User.findById(req.user.id)
    sendOrderConfirmation(order, user)

    // Admin'e bildirim gönder
    sendNewOrderNotification(order)

    res.status(201).json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Kullanıcının siparişlerini getir
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Tek sipariş detayı
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      })
    }

    // Kullanıcı kendi siparişini görebilir veya admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu siparişi görüntüleme yetkiniz yok'
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

// @desc    Tüm siparişleri getir (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })

    const totalAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0)

    res.status(200).json({
      success: true,
      count: orders.length,
      totalAmount,
      orders
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Sipariş durumunu güncelle (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    const order = await Order.findById(req.params.id).populate('user')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      })
    }

    order.status = status

    if (status === 'delivered') {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }

    if (status === 'shipped') {
      sendShippingNotification(order, order.user)
    }

    await order.save()

    // Kullanıcıya bildirim gönder
    sendOrderStatusUpdate(order, order.user._id)

    res.status(200).json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Ödeme durumunu güncelle
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      })
    }

    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time
    }

    await order.save()

    res.status(200).json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}