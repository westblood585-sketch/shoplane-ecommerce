const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('../models/User')
const Product = require('../models/Product')
const productsData = require('./productsData') // YENİ

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB bağlantısı başarılı')
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    await connectDB()

    // Mevcut verileri temizle
    console.log('🗑️  Mevcut veriler temizleniyor...')
    await User.deleteMany()
    await Product.deleteMany()

    // Admin kullanıcısı oluştur
    console.log('👤 Admin kullanıcısı oluşturuluyor...')
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin',
      phone: '5551234567'
    })

    // Test kullanıcısı oluştur
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      phone: '5559876543'
    })

    console.log('✅ Kullanıcılar oluşturuldu')

    // Ürünleri oluştur (100+ ürün)
    console.log('📦 Ürünler oluşturuluyor...')
    const products = await Product.insertMany(productsData)
    console.log(`✅ ${products.length} ürün oluşturuldu`)

    console.log('\n🎉 Seed işlemi tamamlandı!')
    console.log('\n📋 Giriş Bilgileri:')
    console.log('-------------------')
    console.log('Admin:')
    console.log('  Email: admin@example.com')
    console.log('  Şifre: 123456')
    console.log('\nKullanıcı:')
    console.log('  Email: test@example.com')
    console.log('  Şifre: 123456')
    console.log('-------------------\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seed hatası:', error)
    process.exit(1)
  }
}

// Script çalıştırma
if (require.main === module) {
  seedData()
}

module.exports = seedData