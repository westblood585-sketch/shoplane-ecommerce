const mongoose = require('mongoose')
const User = require('../src/models/User')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const seedTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    // Admin user oluştur
    const adminPassword = await bcrypt.hash('123456', 10)
    await User.deleteOne({ email: 'admin@example.com' })
    await User.collection.insertOne({
      name: 'Admin Kullanıcı',
      email: 'admin@example.com',
      password: adminPassword,
      phone: '05551234567',
      isEmailVerified: true,
      role: 'admin',
      gamification: {
        level: 1,
        points: 0,
        badges: [],
        totalOrders: 0,
        totalSpent: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Demo user oluştur
    const demoPassword = await bcrypt.hash('123456', 10)
    await User.deleteOne({ email: 'demo@example.com' })
    await User.collection.insertOne({
      name: 'Demo Kullanıcı',
      email: 'demo@example.com',
      password: demoPassword,
      phone: '05559876543',
      isEmailVerified: true,
      role: 'user',
      gamification: {
        level: 1,
        points: 0,
        badges: [],
        totalOrders: 0,
        totalSpent: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('✅ Kullanıcılar oluşturuldu:')
    console.log('👤 Admin:')
    console.log('   📧 Email: admin@example.com')
    console.log('   🔐 Password: 123456')
    console.log('')
    console.log('👤 Demo:')
    console.log('   📧 Email: demo@example.com')
    console.log('   🔐 Password: 123456')

    await mongoose.connection.close()
  } catch (error) {
    console.error('❌ Hata:', error.message)
    process.exit(1)
  }
}

seedTestUser()
