const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')
const { sendOrderConfirmation, sendShippingNotification } = require('../utils/emailService')
const { sendOrderStatusUpdate, sendNewOrderNotification } = require('../utils/notificationService')
const emailService = require('../utils/emailService')
const Bundle = require('../models/Bundle')
const bundleService = require('../services/bundleService')
const loyaltyService = require('../services/loyaltyService')

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
      couponCode,
      bundleItems // <-- yeni eklendi
    } = req.body

    if ((!items || items.length === 0) && (!bundleItems || bundleItems.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Sepetinizde ürün veya paket bulunmuyor'
      })
    }

    // Stok kontrolü ve ürün bilgilerini güncelle
    for (let item of (items || [])) {
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
      product.stock -= item.quantity
      await product.save()
    }

    // Bundle işlemleri
    let orderBundleItems = []
    if (bundleItems && bundleItems.length > 0) {
      for (const bundleItem of bundleItems) {
        const bundle = await Bundle.findById(bundleItem.bundle)
        if (!bundle) {
          return res.status(404).json({
            success: false,
            message: `Bundle ${bundleItem.bundle} bulunamadı`
          })
        }
        // Validate bundle
        const validation = await bundleService.validateBundle(
          bundle._id,
          bundleItem.selectedProducts
        )
        if (!validation.valid) {
          return res.status(400).json({
            success: false,
            message: validation.message
          })
        }
        // Order'a ekle
        orderBundleItems.push({
          bundle: bundle._id,
          bundleName: bundle.name,
          selectedProducts: bundleItem.selectedProducts,
          quantity: bundleItem.quantity,
          price: bundle.pricing.finalPrice
        })
        // Stok düş
        await bundle.reduceStock(bundleItem.quantity)
        // Satış kaydı
        await bundle.recordSale(bundleItem.quantity, bundle.pricing.finalPrice * bundleItem.quantity)
      }
    }

    // Sipariş oluştur
    const order = await Order.create({
      user: req.user.id,
      items: items || [],
      bundleItems: orderBundleItems,
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

    // Process loyalty points
    if (req.user) {
      try {
        const pointsResult = await loyaltyService.processOrderPoints(
          req.user.id,
          order._id,
          order.totalAmount
        )

        // Add points info to response
        order.loyaltyPoints = pointsResult
      } catch (error) {
        console.error('Loyalty points error:', error)
        // Don't fail order if points fail
      }
    }

    // ORDER CONFIRMATION EMAIL - YENİ
    await emailService.sendOrderConfirmation(order, req.user)
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

    // STATUS'E GÖRE EMAIL GÖNDER - YENİ
    if (status === 'shipped') {
      await emailService.sendShippingNotification(order, order.user)
    } else if (status === 'delivered') {
      await emailService.sendDeliveryConfirmation(order, order.user)
    }

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