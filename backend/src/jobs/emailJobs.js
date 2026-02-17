const cron = require('node-cron')
const User = require('../models/User')
const emailService = require('../utils/emailService')

// Her gün saat 10:00'da terk edilmiş sepet emaili gönder
const scheduleAbandonedCartEmails = () => {
  cron.schedule('0 10 * * *', async () => {
    try {
      console.log('🔄 Checking abandoned carts...')

      // 24 saatten eski sepetleri bul - Cart modeli yerine emailService kullanıyoruz
      console.log('Abandoned cart check would run here')
      const abandonedCarts = []

      for (const cart of abandonedCarts) {
        if (cart.user && cart.user.emailSubscribed) {
          await emailService.sendAbandonedCartEmail(cart.user, cart)
          console.log(`📧 Abandoned cart email sent to ${cart.user.email}`)
        }
      }

      console.log(`✅ Sent ${abandonedCarts.length} abandoned cart emails`)
    } catch (error) {
      console.error('Abandoned cart email error:', error)
    }
  })
}

// Her gün doğum günü emaillerini kontrol et
const scheduleBirthdayEmails = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('🔄 Checking birthdays...')

      const today = new Date()
      const month = today.getMonth() + 1
      const day = today.getDate()

      const users = await User.find({
        emailSubscribed: true,
        'profile.birthday': {
          $regex: new RegExp(`-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}$`)
        }
      })

      for (const user of users) {
        await emailService.sendBirthdayEmail(user)
        console.log(`🎂 Birthday email sent to ${user.email}`)
      }

      console.log(`✅ Sent ${users.length} birthday emails`)
    } catch (error) {
      console.error('Birthday email error:', error)
    }
  })
}

// Haftalık kampanya emaili (Her Pazartesi 10:00)
const scheduleWeeklyCampaignEmail = () => {
  cron.schedule('0 10 * * 1', async () => {
    try {
      console.log('🔄 Sending weekly campaign emails...')

      const users = await User.find({
        emailSubscribed: true,
        'notifications.promotions': true
      }).select('name email')

      const campaign = {
        title: 'Haftanın Süper Fırsatları! 🔥',
        description: 'Seçili ürünlerde %50\'ye varan indirimler!',
        code: `WEEK${new Date().getWeek()}`,
        discount: 30,
        validUntil: 'Pazar günü sonuna kadar',
        slug: 'weekly-deals'
      }

      const batchSize = 50
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize)
        await emailService.sendCampaignEmail(batch, campaign)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      console.log(`✅ Sent campaign emails to ${users.length} users`)
    } catch (error) {
      console.error('Weekly campaign email error:', error)
    }
  })
}

// Helper: Hafta numarası
Date.prototype.getWeek = function() {
  const date = new Date(this.getTime())
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  const week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

// Tüm scheduled jobları başlat
const startEmailJobs = () => {
  console.log('📧 Email jobs started!')
  scheduleAbandonedCartEmails()
  scheduleBirthdayEmails()
  scheduleWeeklyCampaignEmail()
}

module.exports = { startEmailJobs }