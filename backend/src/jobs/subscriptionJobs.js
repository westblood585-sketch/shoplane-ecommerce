const cron = require('node-cron')
const Subscription = require('../models/Subscription')
const Order = require('../models/Order')
const Product = require('../models/Product')
const emailService = require('../utils/emailService')

// Her gün saat 02:00'da çalış - bugün teslimatı olan abonelikleri işle
const processSubscriptionDeliveries = () => {
    cron.schedule('0 2 * * *', async () => {
        try {
            console.log('🔄 Processing subscription deliveries...')

            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            // Bugün teslimat yapılacak aktif abonelikler
            const subscriptions = await Subscription.find({
                status: 'active',
                nextDeliveryDate: { $gte: today, $lt: tomorrow }
            }).populate('user product')

            for (const subscription of subscriptions) {
                try {
                    // Stok kontrolü
                    if (subscription.product.stock < subscription.quantity) {
                        console.log(`⚠️ Insufficient stock for subscription ${subscription.subscriptionNumber}`)
                        // Email gönder - stok yok
                        continue
                    }

                    // Sipariş oluştur
                    const orderItems = [{
                        product: subscription.product._id,
                        name: subscription.product.name,
                        price: subscription.finalPrice / subscription.quantity,
                        quantity: subscription.quantity,
                        image: subscription.product.images[0]
                    }]

                    const order = await Order.create({
                        user: subscription.user._id,
                        items: orderItems,
                        shippingAddress: subscription.shippingAddress,
                        paymentMethod: subscription.paymentMethod,
                        totalPrice: subscription.finalPrice,
                        shippingPrice: 0, // Abonelik için ücretsiz kargo
                        isPaid: true, // Stripe otomatik ödeme
                        paidAt: Date.now(),
                        status: 'processing',
                        isSubscriptionOrder: true,
                        subscriptionId: subscription._id
                    })

                    // Stoktan düş
                    subscription.product.stock -= subscription.quantity
                    await subscription.product.save()

                    // Aboneliği güncelle
                    subscription.totalDeliveries += 1
                    subscription.lastDeliveryDate = Date.now()
                    subscription.nextDeliveryDate = subscription.calculateNextDelivery()
                    subscription.deliveryHistory.push({
                        orderNumber: order.orderNumber,
                        deliveryDate: Date.now(),
                        status: 'completed',
                        amount: subscription.finalPrice
                    })
                    await subscription.save()

                    // Email gönder
                    await emailService.sendSubscriptionDelivery(subscription.user, subscription, order)

                    console.log(`✅ Created order for subscription ${subscription.subscriptionNumber}`)
                } catch (error) {
                    console.error(`Error processing subscription ${subscription.subscriptionNumber}:`, error)
                }
            }

            console.log(`✅ Processed ${subscriptions.length} subscription deliveries`)
        } catch (error) {
            console.error('Subscription delivery error:', error)
        }
    })
}

// Her gün saat 10:00'da - 3 gün sonra teslimat olacak aboneliklere hatırlatma
const sendUpcomingDeliveryReminders = () => {
    cron.schedule('0 10 * * *', async () => {
        try {
            console.log('🔄 Sending delivery reminders...')

            const threeDaysFromNow = new Date()
            threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
            threeDaysFromNow.setHours(0, 0, 0, 0)

            const fourDaysFromNow = new Date(threeDaysFromNow)
            fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 1)

            const subscriptions = await Subscription.find({
                status: 'active',
                nextDeliveryDate: { $gte: threeDaysFromNow, $lt: fourDaysFromNow },
                'notifications.beforeDelivery': true
            }).populate('user product')

            for (const subscription of subscriptions) {
                try {
                    await emailService.sendDeliveryReminder(subscription.user, subscription)
                    console.log(`📧 Reminder sent for subscription ${subscription.subscriptionNumber}`)
                } catch (error) {
                    console.error(`Error sending reminder:`, error)
                }
            }

            console.log(`✅ Sent ${subscriptions.length} delivery reminders`)
        } catch (error) {
            console.error('Delivery reminder error:', error)
        }
    })
}

// Stripe webhook - ödeme başarısız olursa
const handleFailedPayment = async (subscriptionId) => {
    try {
        const subscription = await Subscription.findOne({
            stripeSubscriptionId: subscriptionId
        }).populate('user')

        if (subscription) {
            subscription.status = 'paused'
            await subscription.save()

            // Email gönder
            await emailService.sendPaymentFailedNotification(subscription.user, subscription)

            console.log(`⚠️ Subscription ${subscription.subscriptionNumber} paused due to payment failure`)
        }
    } catch (error) {
        console.error('Failed payment handler error:', error)
    }
}

// Tüm jobları başlat
const startSubscriptionJobs = () => {
    console.log('🔄 Subscription jobs started!')
    processSubscriptionDeliveries()
    sendUpcomingDeliveryReminders()
}

module.exports = {
    startSubscriptionJobs,
    handleFailedPayment
}
