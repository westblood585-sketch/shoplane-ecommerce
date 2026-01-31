require('dotenv').config({ path: '.env' })
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const User = require('./src/models/User')
const Product = require('./src/models/Product')
const productsData = require('./src/utils/productsData')

const seedProduction = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB Atlas')

    console.log('🗑️  Clearing existing data...')
    await User.deleteMany({})
    await Product.deleteMany({})

    console.log('👤 Creating admin user...')
    const adminPassword = await bcryptjs.hash('Admin123!', 10)
    await User.create({
      name: 'Admin User',
      email: 'admin@myshop.com',
      password: adminPassword,
      role: 'admin',
      phone: '5551234567',
      isEmailVerified: true
    })

    console.log('👥 Creating demo user...')
    const demoPassword = await bcryptjs.hash('Demo123!', 10)
    await User.create({
      name: 'Demo User',
      email: 'demo@myshop.com',
      password: demoPassword,
      role: 'user',
      phone: '5559876543',
      isEmailVerified: true
    })

    console.log('📦 Creating products...')
    if (productsData && Array.isArray(productsData) && productsData.length > 0) {
      await Product.insertMany(productsData)
      console.log(`✅ ${productsData.length} products created`)
    } else {
      console.warn('⚠️  No products data found')
    }

    console.log('\n✅ Production database seeded successfully!')
    console.log('\n📋 Admin Credentials:')
    console.log('   Email: admin@myshop.com')
    console.log('   Password: Admin123!')
    console.log('\n📋 Demo Credentials:')
    console.log('   Email: demo@myshop.com')
    console.log('   Password: Demo123!')
    
    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    await mongoose.connection.close()
    process.exit(1)
  }
}

seedProduction()
