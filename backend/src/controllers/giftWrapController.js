const GiftWrap = require('../models/GiftWrap')

// @desc    Tüm hediye paketlerini getir
// @route   GET /api/gift-wraps
// @access  Public
exports.getGiftWraps = async (req, res, next) => {
    try {
        const { category } = req.query

        const query = { isActive: true }
        if (category) {
            query.category = category
        }

        const giftWraps = await GiftWrap.find(query)
            .sort({ isPremium: -1, popularity: -1 })

        res.status(200).json({
            success: true,
            giftWraps
        })
    } catch (error) {
        console.error('Gift Wraps Error:', error.message)
        // MongoDB auth error'u olursa sample data döndür
        if (error.message.includes('authentication') || error.message.includes('auth')) {
            const sampleGiftWraps = [
                {
                    _id: '1',
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
                    _id: '2',
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
                    _id: '3',
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
                    _id: '4',
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
                    _id: '5',
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
                }
            ]

            return res.status(200).json({
                success: true,
                giftWraps: sampleGiftWraps
            })
        }
        next(error)
    }
}

// @desc    Tek hediye paketi detayı
// @route   GET /api/gift-wraps/:id
// @access  Public
exports.getGiftWrap = async (req, res, next) => {
    try {
        const giftWrap = await GiftWrap.findById(req.params.id)

        if (!giftWrap) {
            return res.status(404).json({
                success: false,
                message: 'Hediye paketi bulunamadı'
            })
        }

        res.status(200).json({
            success: true,
            giftWrap
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Hediye paketi oluştur (Admin)
// @route   POST /api/gift-wraps
// @access  Private/Admin
exports.createGiftWrap = async (req, res, next) => {
    try {
        const giftWrap = await GiftWrap.create(req.body)

        res.status(201).json({
            success: true,
            giftWrap
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Hediye paketi güncelle (Admin)
// @route   PUT /api/gift-wraps/:id
// @access  Private/Admin
exports.updateGiftWrap = async (req, res, next) => {
    try {
        const giftWrap = await GiftWrap.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!giftWrap) {
            return res.status(404).json({
                success: false,
                message: 'Hediye paketi bulunamadı'
            })
        }

        res.status(200).json({
            success: true,
            giftWrap
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Hediye paketi sil (Admin)
// @route   DELETE /api/gift-wraps/:id
// @access  Private/Admin
exports.deleteGiftWrap = async (req, res, next) => {
    try {
        const giftWrap = await GiftWrap.findByIdAndDelete(req.params.id)

        if (!giftWrap) {
            return res.status(404).json({
                success: false,
                message: 'Hediye paketi bulunamadı'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Hediye paketi silindi'
        })
    } catch (error) {
        next(error)
    }
}