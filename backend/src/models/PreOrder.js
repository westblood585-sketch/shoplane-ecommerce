const mongoose = require('mongoose')

const preOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    orderNumber: {
        type: String,
        unique: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    depositAmount: {
        type: Number,
        required: true
    },
    remainingAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        fullName: { type: String },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        district: { type: String },
        zipCode: { type: String }
    },
    status: {
        type: String,
        enum: ['pending', 'deposit_paid', 'full_paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    estimatedDelivery: {
        type: Date
    },
    actualDeliveryDate: {
        type: Date
    },
    depositPaid: {
        type: Boolean,
        default: false
    },
    depositPaidAt: {
        type: Date
    },
    depositPaymentId: {
        type: String
    },
    fullPaymentPaid: {
        type: Boolean,
        default: false
    },
    fullPaymentPaidAt: {
        type: Date
    },
    fullPaymentPaymentId: {
        type: String
    },
    notifications: {
        depositReminder: { type: Boolean, default: false },
        fullPaymentReminder: { type: Boolean, default: false },
        shippingNotification: { type: Boolean, default: false }
    },
    trackingNumber: {
        type: String
    },
    trackingUrl: {
        type: String
    },
    cancelReason: {
        type: String
    },
    cancelledAt: {
        type: Date
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundStatus: {
        type: String,
        enum: ['not_requested', 'pending', 'refunded'],
        default: 'not_requested'
    }
}, {
    timestamps: true
})

// Ön sipariş numarası otomatik oluştur
preOrderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const year = new Date().getFullYear()
        const count = await this.constructor.countDocuments()
        // PRE-2025-000001 formatında
        this.orderNumber = `PRE-${year}-${String(count + 1).padStart(6, '0')}`
    }
    next()
})

module.exports = mongoose.model('PreOrder', preOrderSchema)
