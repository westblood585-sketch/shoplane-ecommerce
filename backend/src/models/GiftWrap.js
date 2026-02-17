const mongoose = require('mongoose')

const giftWrapSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true,
        default: 0
    },
    image: String,
    icon: String, // Emoji veya icon
    category: {
        type: String,
        enum: ['birthday', 'anniversary', 'wedding', 'baby', 'general', 'premium', 'seasonal'],
        default: 'general'
    },
    color: String, // Paket rengi
    includesCard: {
        type: Boolean,
        default: true
    },
    includesRibbon: {
        type: Boolean,
        default: true
    },
    maxMessageLength: {
        type: Number,
        default: 200
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 999999 // Unlimited
    },
    popularity: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('GiftWrap', giftWrapSchema)