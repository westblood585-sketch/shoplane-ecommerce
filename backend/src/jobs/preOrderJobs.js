const cron = require('node-cron')
const PreOrder = require('../models/PreOrder')
const emailService = require('../services/EmailService')

// Her gün saat 10:00'da kalan ödeme hatırlatması gönder
const schedulePaymentReminders = () => {
    cron.schedule('0 10 * * *', async () => {
        try {
            console.log('🔄 Checking pre-order payment reminders...')

            // Deposu ödendi, kalan tutar ödenmedi, ürün çıkışına 7 gün kaldı
            const sevenDaysFromNow = new Date()
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

            const preOrders = await PreOrder.find({
                depositPaid: true,
                fullPaymentPaid: false,
                status: 'deposit_paid',
                'notifications.fullPaymentReminder': false,
                estimatedDelivery: { $lte: sevenDaysFromNow }
            }).populate('user product')

            for (const preOrder of preOrders) {
                if (preOrder.user && preOrder.remainingAmount > 0) {
                    // Email gönder (template oluştur)
                    await emailService.sendPaymentReminder(preOrder.user, preOrder)

                    // Bildirimi işaretle
                    preOrder.notifications.fullPaymentReminder = true
                    await preOrder.save()

                    console.log(`💌 Payment reminder sent to ${preOrder.user.email}`)
                }
            }

            console.log(`✅ Sent ${preOrders.length} payment reminders`)
        } catch (error) {
            console.error('Payment reminder error:', error)
        }
    })
}

// Her gün ürün çıkış bildirimleri
const scheduleReleaseNotifications = () => {
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log('🔄 Checking product releases...')

            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            const preOrders = await PreOrder.find({
                fullPaymentPaid: true,
                status: 'full_paid',
                'notifications.releaseNotification': false,
                estimatedDelivery: { $gte: today, $lt: tomorrow }
            }).populate('user product')

            for (const preOrder of preOrders) {
                if (preOrder.user) {
                    await emailService.sendReleaseNotification(preOrder.user, preOrder)

                    preOrder.notifications.releaseNotification = true
                    preOrder.status = 'preparing'
                    await preOrder.save()

                    console.log(`🚀 Release notification sent to ${preOrder.user.email}`)
                }
            }

            console.log(`✅ Sent ${preOrders.length} release notifications`)
        } catch (error) {
            console.error('Release notification error:', error)
        }
    })
}

// Tüm scheduled jobları başlat
const startPreOrderJobs = () => {
    console.log('📦 Pre-order jobs started!')
    schedulePaymentReminders()
    scheduleReleaseNotifications()
}

module.exports = { startPreOrderJobs }
