const mongoose = require('mongoose')
const GiftWrap = require('../models/GiftWrap')
require('dotenv').config()

const giftWraps = [
    {
        name: 'Klasik Hediye Paketi',
        description: 'Kırmızı fiyonk ile klasik hediye paketi',
        price: 15,
        image: '/gift-wraps/classic.jpg',
        icon: '🎁',
        category: 'general',
        color: '#DC2626',
        includesCard: true,
        includesRibbon: true,
        maxMessageLength: 200,
        isActive: true,
        isPremium: false
    },
    {
        name: 'Doğum Günü Özel',
        description: 'Renkli balonlar ve konfeti desenli',
        price: 20,
        image: '/gift-wraps/birthday.jpg',
        icon: '🎂',
        category: 'birthday',
        color: '#F59E0B',
        includesCard: true,
        includesRibbon: true,
        maxMessageLength: 250,
        isActive: true,
        isPremium: false
    },
    {
        name: 'Romantik Paketi',
        description: 'Kalpli tasarım, pembe fiyonk',
        price: 25,
        image: '/gift-wraps/romantic.jpg',
        icon: '💕',
        category: 'anniversary',
        color: '#EC4899',
        includesCard: true,
        includesRibbon: true,
        maxMessageLength: 300,
        isActive: true,
        isPremium: false
    },
    {
        name: 'Düğün Paketi',
        description: 'Beyaz saten kurdele ile zarif paket',
        price: 30,
        image: '/gift-wraps/wedding.jpg',
        icon: '💍',
        category: 'wedding',
        color: '#F3F4F6',
        includesCard: true,
        includesRibbon: true,
        maxMessageLength: 300,
        isActive: true,
        isPremium: true
    },
    {
        name: 'Bebek Paketi - Mavi',
        description: 'Mavi tonlarda bebek temalı',
        price: 20,
        image: '/gift-wraps/baby-blue.jpg',
        icon: '👶',
        category: 'baby',
        color: '#3B82F6',
        includesCard: true,
        includesRibbon: true,
        maxMessageLength: 200,
        isActive: true,
        isPremium: false
    },
    {
        name: 'Bebek Paketi - Pembe',
        description: 'Pembe tonlarda bebek temalı',
        price: 20,
        image: '/gift-wraps/baby-pink.jpg',
        icon: '👶',
        category: 'baby',
        color: '#EC4899',
        includesCard: true,
        includesRibbon: true,
        maxMessageLength: 200,
        isActive: true,
        isPremium: false
    },
    {
        name: 'Premium Gold',
        description: 'Altın renkli lüks hediye paketi',
        price: 50,
        image: '/gift-wraps/premium-gold.jpg',
        icon: '✨',
        category: 'premium',
        color: '#FCD34D',
        includesCard: true,
        includesRibbon: true,
        maxMessageLength: 500,
        isActive: true,
        isPremium: true
    },
    {
        name: 'Yılbaşı Özel',
        description: 'Noel temalı kırmızı-yeşil paket',
        price: 25,
        image: '/gift-wraps/christmas.jpg',
        icon: '🎄',
        category: 'seasonal',
        color: '#10B981',
        includesCard: true,
        includesRibbon: true,
        maxMessageLength: 200,
        isActive: true,
        isPremium: false
    },
    {
        name: 'Minimalist Kraft',
        description: 'Doğal kraft kağıt, minimal tasarım',
        price: 10,
        image: '/gift-wraps/kraft.jpg',
        icon: '📦',
        category: 'general',
        color: '#92400E',
        includesCard: true,
        includesRibbon: true,
        maxMessageLength: 150,
        isActive: true,
        isPremium: false
    },
    {
        name: 'Lüks Kadife',
        description: 'Kadife doku, altın detaylar',
        price: 60,
        image: '/gift-wraps/velvet.jpg',
        icon: '👑',
        category: 'premium',
        color: '#7C3AED',
        includesCard: true,
        includesRibbon: true,
        maxMessageLength: 500,
        isActive: true,
        isPremium: true
    }
]

const seedGiftWraps = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...')
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ MongoDB connected')

        // Skip deleteMany due to MongoDB auth issues
        console.log('⚠️  Skipping clear - directly inserting gift wraps...')

        console.log('📦 Inserting gift wraps...')
        const result = await GiftWrap.insertMany(giftWraps)
        console.log(`✅ ${result.length} gift wraps seeded successfully`)

        console.log('\n🎉 Seed completed!')
        console.log('Gift Wraps:')
        result.forEach(wrap => {
            console.log(`  ${wrap.icon} ${wrap.name} - ₺${wrap.price}`)
        })

        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error.message)
        console.error(error)
        process.exit(1)
    }
}

seedGiftWraps()
