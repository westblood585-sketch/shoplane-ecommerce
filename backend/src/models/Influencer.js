const mongoose = require('mongoose')

const influencerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Influencer bilgileri
  displayName: {
    type: String,
    required: true
  },
  bio: String,
  profileImage: String,
  coverImage: String,
  
  // Sosyal medya
  socialMedia: {
    instagram: String,
    youtube: String,
    tiktok: String,
    twitter: String,
    website: String
  },
  
  // Durum
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'suspended', 'rejected'],
    default: 'pending'
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  
  // Referral kodu
  referralCode: {
    type: String,
    unique: true,
    required: true
  },
  customUrl: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Komisyon oranları (%)
  commission: {
    default: {
      type: Number,
      default: 10
    },
    tier: {
      bronze: { type: Number, default: 10 },
      silver: { type: Number, default: 15 },
      gold: { type: Number, default: 20 },
      platinum: { type: Number, default: 25 }
    }
  },
  
  // İstatistikler
  stats: {
    totalClicks: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSales: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    }
  },
  
  // Ödemeler
  paymentInfo: {
    method: {
      type: String,
      enum: ['bank_transfer', 'paypal', 'crypto']
    },
    bankAccount: {
      name: String,
      iban: String,
      bank: String
    },
    paypalEmail: String,
    walletAddress: String
  },
  minimumPayout: {
    type: Number,
    default: 100
  },
  pendingEarnings: {
    type: Number,
    default: 0
  },
  totalPaidOut: {
    type: Number,
    default: 0
  },
  
  // Ayarlar
  notificationPreferences: {
    newSale: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true },
    monthlyReport: { type: Boolean, default: true },
    payoutReady: { type: Boolean, default: true }
  },
  
  // Özel linkler
  campaignLinks: [{
    name: String,
    url: String,
    clicks: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Başvuru bilgileri
  application: {
    followers: Number,
    platform: String,
    reason: String,
    submittedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String
  }
}, {
  timestamps: true
})

// Index
influencerSchema.index({ referralCode: 1 })
influencerSchema.index({ user: 1 })
influencerSchema.index({ status: 1 })
influencerSchema.index({ tier: 1 })

// Referral kodu oluştur
influencerSchema.pre('save', async function(next) {
  if (!this.referralCode) {
    this.referralCode = this.generateReferralCode()
  }
  next()
})

// Referral code generator
influencerSchema.methods.generateReferralCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Komisyon oranını al (tier'a göre)
influencerSchema.methods.getCommissionRate = function() {
  return this.commission.tier[this.tier] || this.commission.default
}

// Conversion rate hesapla
influencerSchema.methods.updateConversionRate = function() {
  if (this.stats.totalClicks > 0) {
    this.stats.conversionRate = (this.stats.totalOrders / this.stats.totalClicks) * 100
  }
}

// Average order value hesapla
influencerSchema.methods.updateAverageOrderValue = function() {
  if (this.stats.totalOrders > 0) {
    this.stats.averageOrderValue = this.stats.totalSales / this.stats.totalOrders
  }
}

// Tier güncelle (satışa göre)
influencerSchema.methods.updateTier = function() {
  const sales = this.stats.totalSales
  
  if (sales >= 50000) {
    this.tier = 'platinum'
  } else if (sales >= 25000) {
    this.tier = 'gold'
  } else if (sales >= 10000) {
    this.tier = 'silver'
  } else {
    this.tier = 'bronze'
  }
}

module.exports = mongoose.model('Influencer', influencerSchema)
