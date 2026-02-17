const Subscription = require('../models/Subscription')
const Product = require('../models/Product')
const emailService = require('../utils/emailService')

// @desc    Yeni abonelik başlat
// @route   POST /api/subscriptions
// @access  Private
exports.createSubscription = async (req, res, next) => {
    try {
        const {
            productId,
            plan,
            quantity,
            shippingAddress,
            paymentMethod
        } = req.body

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            })
        }

        if (!product.isSubscriptionAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Bu ürün için abonelik mevcut değil'
            })
        }

        // Seçilen planın detaylarını bul
        const selectedPlan = product.subscriptionPlans.find(p => p.plan === plan)
        if (!selectedPlan || !selectedPlan.available) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz abonelik planı'
            })
        }

        // Fiyat hesapla
        const planDiscount = selectedPlan.discount || 0
        const finalPrice = (product.price * quantity) * ((100 - planDiscount) / 100)

        // Teslimat tarihi hesapla
        let nextDeliveryDate = new Date()
        switch (plan) {
            case 'weekly': nextDeliveryDate.setDate(nextDeliveryDate.getDate() + 7); break;
            case 'biweekly': nextDeliveryDate.setDate(nextDeliveryDate.getDate() + 14); break;
            case 'monthly': nextDeliveryDate.setMonth(nextDeliveryDate.getMonth() + 1); break;
            case 'quarterly': nextDeliveryDate.setMonth(nextDeliveryDate.getMonth() + 3); break;
        }

        const subscription = await Subscription.create({
            user: req.user._id,
            product: productId,
            plan,
            quantity,
            price: product.price,
            finalPrice,
            shippingAddress,
            paymentMethod,
            nextDeliveryDate
        })

        // Email gönderimi vs. burada yapılabilir

        res.status(201).json({
            success: true,
            data: subscription
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Kullanıcının aboneliklerini getir
// @route   GET /api/subscriptions
// @access  Private
exports.getMySubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user._id })
            .populate('product', 'name images price isSubscriptionAvailable')
            .sort('-createdAt')

        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Abonelik detayını getir
// @route   GET /api/subscriptions/:id
// @access  Private
exports.getSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('product')

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Abonelik bulunamadı'
            })
        }

        res.status(200).json({
            success: true,
            data: subscription
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Aboneliği iptal et / duraklat
// @route   PUT /api/subscriptions/:id/status
// @access  Private
exports.updateSubscriptionStatus = async (req, res, next) => {
    try {
        const { status, cancelReason } = req.body

        let subscription = await Subscription.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Abonelik bulunamadı'
            })
        }

        if (status === 'cancelled') {
            subscription.status = 'cancelled'
            subscription.cancelledAt = Date.now()
            subscription.cancelReason = cancelReason
        } else if (status === 'paused') {
            subscription.status = 'paused'
        } else if (status === 'active') {
            subscription.status = 'active'
        }

        await subscription.save()

        res.status(200).json({
            success: true,
            data: subscription
        })
    } catch (error) {
        next(error)
    }
}