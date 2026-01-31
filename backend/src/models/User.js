const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  // SOCIAL AUTH
  socialAuth: {
    google: String,
    facebook: String,
    apple: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // GAMİFİKASYON - YENİ
  gamification: {
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    badges: [{
      id: String,
      name: String,
      description: String,
      icon: String,
      earnedAt: Date
    }],
    dailySpinAvailable: {
      type: Boolean,
      default: true
    },
    lastSpinDate: {
      type: Date,
      default: null
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
})

// Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

// Token oluştur
userSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken')
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  })
}

// Puan hesaplama
userSchema.methods.calculateLevel = function() {
  const points = this.gamification.points
  // Her 1000 puan = 1 level
  this.gamification.level = Math.floor(points / 1000) + 1
}

// Puan ekle
userSchema.methods.addPoints = function(points, reason) {
  this.gamification.points += points
  this.calculateLevel()
  return this.save()
}

// Rozet ekle
userSchema.methods.addBadge = function(badge) {
  const exists = this.gamification.badges.find(b => b.id === badge.id)
  if (!exists) {
    this.gamification.badges.push({
      ...badge,
      earnedAt: new Date()
    })
    return this.save()
  }
  return Promise.resolve(this)
}

module.exports = mongoose.model('User', userSchema)