const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
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
    subscriptionNumber: {
        type: String,
        unique: true
    },
    plan: {
        type: String,
        enum: ['weekly', 'biweekly', 'monthly', 'quarterly'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'cancelled'],
        default: 'active'
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    },
    shippingAddress: {
        address: String,
        city: String,
        postalCode: String,
        country: String
    },
    paymentMethod: {
        type: String,
        default: 'Credit Card'
    },
    stripeSubscriptionId: String,
    startDate: {
        type: Date,
        default: Date.now
    },
    lastDeliveryDate: Date,
    nextDeliveryDate: {
        type: Date,
        required: true
    },
    totalDeliveries: {
        type: Number,
        default: 0
    },
    deliveryHistory: [{
        orderNumber: String,
        deliveryDate: Date,
        status: String,
        amount: Number
    }],
    cancelReason: String,
    cancelledAt: Date,
    notifications: {
        beforeDelivery: {
            type: Boolean,
            default: true
        },
        onShipped: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
})

// Calculate next delivery date based on plan
subscriptionSchema.methods.calculateNextDelivery = function () {
    const date = new Date(this.nextDeliveryDate || this.startDate)

    switch (this.plan) {
        case 'weekly':
            date.setDate(date.getDate() + 7)
            break
        case 'biweekly':
            date.setDate(date.getDate() + 14)
            break
        case 'monthly':
            date.setMonth(date.getMonth() + 1)
            break
        case 'quarterly':
            date.setMonth(date.getMonth() + 3)
            break
    }

    return date
}

// Generate subscription number before save
subscriptionSchema.pre('save', async function (next) {
    if (!this.subscriptionNumber) {
        const count = await this.constructor.countDocuments()
        const date = new Date().toISOString().slice(2, 7).replace(/-/g, '')
        // Pad with zeros to ensure unique number
        this.subscriptionNumber = `SUB${date}${(count + 1).toString().padStart(4, '0')}`
    }
    next()
})

module.exports = mongoose.model('Subscription', subscriptionSchema)