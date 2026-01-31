const iyzipay = require('../config/iyzico')
const Order = require('../models/Order')

// @desc    Ödeme başlat
// @route   POST /api/payment/checkout
// @access  Private
exports.initiatePayment = async (req, res, next) => {
  try {
    const { orderId, cardDetails } = req.body

    const order = await Order.findById(orderId).populate('user')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      })
    }

    // iyzico ödeme isteği
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: order.orderNumber,
      price: order.subtotal.toFixed(2),
      paidPrice: order.totalPrice.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: order._id.toString(),
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      
      // Kart bilgileri
      paymentCard: {
        cardHolderName: cardDetails.cardHolderName,
        cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
        expireMonth: cardDetails.expireMonth,
        expireYear: cardDetails.expireYear,
        cvc: cardDetails.cvc,
        registerCard: '0'
      },

      // Alıcı bilgileri
      buyer: {
        id: order.user._id.toString(),
        name: order.user.name.split(' ')[0],
        surname: order.user.name.split(' ')[1] || order.user.name.split(' ')[0],
        gsmNumber: order.shippingAddress.phone,
        email: order.user.email,
        identityNumber: '11111111111', // Test için
        registrationAddress: order.shippingAddress.address,
        ip: req.ip || '85.34.78.112',
        city: order.shippingAddress.city,
        country: 'Turkey',
        zipCode: order.shippingAddress.zipCode
      },

      // Teslimat adresi
      shippingAddress: {
        contactName: order.shippingAddress.fullName,
        city: order.shippingAddress.city,
        country: 'Turkey',
        address: order.shippingAddress.address,
        zipCode: order.shippingAddress.zipCode
      },

      // Fatura adresi
      billingAddress: {
        contactName: order.shippingAddress.fullName,
        city: order.shippingAddress.city,
        country: 'Turkey',
        address: order.shippingAddress.address,
        zipCode: order.shippingAddress.zipCode
      },

      // Sepet ürünleri
      basketItems: order.items.map(item => ({
        id: item.product.toString(),
        name: item.name,
        category1: 'Ürün',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: (item.price * item.quantity).toFixed(2)
      }))
    }

    iyzipay.payment.create(request, async (err, result) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Ödeme başlatılamadı',
          error: err
        })
      }

      if (result.status === 'success') {
        // Ödeme başarılı
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
          id: result.paymentId,
          status: result.status,
          updateTime: new Date().toISOString()
        }
        order.status = 'processing'
        await order.save()

        res.status(200).json({
          success: true,
          message: 'Ödeme başarılı',
          order,
          payment: result
        })
      } else {
        res.status(400).json({
          success: false,
          message: result.errorMessage || 'Ödeme başarısız',
          error: result
        })
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    3D Secure ödeme başlat
// @route   POST /api/payment/3d-secure
// @access  Private
exports.initiate3DPayment = async (req, res, next) => {
  try {
    const { orderId, cardDetails } = req.body

    const order = await Order.findById(orderId).populate('user')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      })
    }

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: order.orderNumber,
      price: order.subtotal.toFixed(2),
      paidPrice: order.totalPrice.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: order._id.toString(),
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.CLIENT_URL}/payment/callback`,
      
      paymentCard: {
        cardHolderName: cardDetails.cardHolderName,
        cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
        expireMonth: cardDetails.expireMonth,
        expireYear: cardDetails.expireYear,
        cvc: cardDetails.cvc,
        registerCard: '0'
      },

      buyer: {
        id: order.user._id.toString(),
        name: order.user.name.split(' ')[0],
        surname: order.user.name.split(' ')[1] || order.user.name.split(' ')[0],
        gsmNumber: order.shippingAddress.phone,
        email: order.user.email,
        identityNumber: '11111111111',
        registrationAddress: order.shippingAddress.address,
        ip: req.ip || '85.34.78.112',
        city: order.shippingAddress.city,
        country: 'Turkey',
        zipCode: order.shippingAddress.zipCode
      },

      shippingAddress: {
        contactName: order.shippingAddress.fullName,
        city: order.shippingAddress.city,
        country: 'Turkey',
        address: order.shippingAddress.address,
        zipCode: order.shippingAddress.zipCode
      },

      billingAddress: {
        contactName: order.shippingAddress.fullName,
        city: order.shippingAddress.city,
        country: 'Turkey',
        address: order.shippingAddress.address,
        zipCode: order.shippingAddress.zipCode
      },

      basketItems: order.items.map(item => ({
        id: item.product.toString(),
        name: item.name,
        category1: 'Ürün',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: (item.price * item.quantity).toFixed(2)
      }))
    }

    iyzipay.threedsInitialize.create(request, (err, result) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Ödeme başlatılamadı',
          error: err
        })
      }

      res.status(200).json({
        success: true,
        threeDSHtmlContent: result.threeDSHtmlContent
      })
    })
  } catch (error) {
    next(error)
  }
}