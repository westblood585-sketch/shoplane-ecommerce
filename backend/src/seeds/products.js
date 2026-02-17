const mongoose = require('mongoose')
const Product = require('../models/Product')
require('dotenv').config()

const products = [
    {
        name: 'Premium Wireless Headphones',
        description: 'High-quality noise-cancelling wireless headphones with superior sound',
        price: 299.99,
        oldPrice: 399.99,
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
        ],
        category: 'Elektronik',
        brand: 'AudioTech',
        rating: 4.8,
        numReviews: 245,
        stock: 50,
        isActive: true,
        isFeatured: true
    },
    {
        name: 'Smartphone Pro Max',
        description: 'Latest flagship smartphone with 5G connectivity',
        price: 999.99,
        oldPrice: 1199.99,
        images: [
            'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500',
            'https://images.unsplash.com/photo-1592286927505-f7d8b85ab8f5?w=500'
        ],
        category: 'Elektronik',
        brand: 'TechBrand',
        rating: 4.7,
        numReviews: 512,
        stock: 30,
        isActive: true,
        isFeatured: true
    },
    {
        name: 'Smart Watch Series 6',
        description: 'Advanced fitness tracking smartwatch',
        price: 349.99,
        oldPrice: 449.99,
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
            'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500'
        ],
        category: 'Elektronik',
        brand: 'WatchCo',
        rating: 4.6,
        numReviews: 189,
        stock: 45,
        isActive: true,
        isFeatured: true
    },
    {
        name: 'Leather Messenger Bag',
        description: 'Premium leather bag for professionals',
        price: 189.99,
        oldPrice: 249.99,
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'
        ],
        category: 'Aksesuar',
        brand: 'BagPro',
        rating: 4.5,
        numReviews: 98,
        stock: 60,
        isActive: true,
        isFeatured: false
    },
    {
        name: 'Wireless Keyboard & Mouse Combo',
        description: 'Ergonomic wireless keyboard and mouse set',
        price: 79.99,
        oldPrice: 99.99,
        images: [
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
            'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500'
        ],
        category: 'Aksesuar',
        brand: 'TechHub',
        rating: 4.4,
        numReviews: 156,
        stock: 100,
        isActive: true,
        isFeatured: false
    },
    {
        name: 'Running Shoes Pro',
        description: 'Professional running shoes with gel cushioning',
        price: 129.99,
        oldPrice: 169.99,
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'
        ],
        category: 'Ayakkabı',
        brand: 'SportGear',
        rating: 4.7,
        numReviews: 234,
        stock: 80,
        isActive: true,
        isFeatured: false
    },
    {
        name: 'Portable Power Bank 20000mAh',
        description: 'Fast charging power bank with dual USB ports',
        price: 49.99,
        oldPrice: 69.99,
        images: [
            'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
            'https://images.unsplash.com/photo-1619641805634-37884c52062c?w=500'
        ],
        category: 'Elektronik',
        brand: 'PowerCell',
        rating: 4.6,
        numReviews: 412,
        stock: 150,
        isActive: true,
        isFeatured: true
    },
    {
        name: 'Gaming Mouse RGB',
        description: 'Ergonomic gaming mouse with customizable RGB',
        price: 39.99,
        oldPrice: 54.99,
        images: [
            'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
            'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'
        ],
        category: 'Aksesuar',
        brand: 'InputPro',
        rating: 4.3,
        numReviews: 189,
        stock: 120,
        isActive: true,
        isFeatured: false
    },
    {
        name: 'Blue Light Blocking Glasses',
        description: 'Protect your eyes from screen fatigue',
        price: 69.99,
        oldPrice: 89.99,
        images: [
            'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500',
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'
        ],
        category: 'Aksesuar',
        brand: 'VisionCare',
        rating: 4.4,
        numReviews: 267,
        stock: 90,
        isActive: true,
        isFeatured: false
    },
    {
        name: 'Mechanical Keyboard RGB',
        description: 'Gaming keyboard with customizable RGB lighting',
        price: 119.99,
        oldPrice: 159.99,
        images: [
            'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'
        ],
        category: 'Elektronik',
        brand: 'GameKey',
        rating: 4.8,
        numReviews: 345,
        stock: 75,
        isActive: true,
        isFeatured: true
    },
    {
        name: 'Laptop Stand Aluminum',
        description: 'Premium aluminum laptop stand for ergonomics',
        price: 59.99,
        oldPrice: 79.99,
        images: [
            'https://images.unsplash.com/photo-1625225233840-695456021cde?w=500',
            'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=500'
        ],
        category: 'Aksesuar',
        brand: 'DeskPro',
        rating: 4.5,
        numReviews: 178,
        stock: 110,
        isActive: true,
        isFeatured: false
    },
    {
        name: 'USB-C Cable 2m',
        description: 'Fast charging and data transfer cable',
        price: 19.99,
        oldPrice: 29.99,
        images: [
            'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
            'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500'
        ],
        category: 'Aksesuar',
        brand: 'CablePro',
        rating: 4.6,
        numReviews: 534,
        stock: 200,
        isActive: true,
        isFeatured: false
    }
]

const seedProducts = async () => {
    try {
        console.log('🔄 MongoDB bağlanıyor...')
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ MongoDB bağlandı')

        console.log('🗑️  Eski ürünler siliniyor...')
        await Product.deleteMany({})
        console.log('✅ Eski ürünler silindi')

        console.log('📦 Yeni ürünler ekleniyor...')
        const result = await Product.insertMany(products)
        console.log(`✅ ${result.length} ürün eklendi`)

        console.log('\n🎉 Seed tamamlandı!')
        process.exit(0)
    } catch (error) {
        console.error('❌ Hata:', error.message)
        process.exit(1)
    }
}

seedProducts()
