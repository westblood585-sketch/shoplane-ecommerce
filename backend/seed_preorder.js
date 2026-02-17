const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./src/models/Product')
const connectDB = require('./src/config/database')

dotenv.config()

const createTestProduct = async () => {
    try {
        await connectDB()

        const testProduct = {
            name: "PlayStation 6 - Ön Sipariş",
            brand: "Sony",
            category: "Elektronik",
            price: 15000,
            stock: 0,
            images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000&auto=format&fit=crop"], // Gerçek bir resim URL'i kullandım
            description: "Yeni nesil oyun konsolu (Test Ürünü)",
            isActive: true,
            isPreOrder: true,
            preOrderInfo: {
                releaseDate: new Date("2026-12-01"),
                estimatedShipDate: new Date("2026-12-05"),
                depositPercentage: 30,
                maxPreOrders: 100,
                currentPreOrders: 0,
                preOrderBenefits: [
                    "İlk 100 kişiye özel hediye paketi",
                    "Özel renk seçenekleri",
                    "1 yıl ekstra garanti",
                    "Öncelikli teslimat"
                ],
                description: "PlayStation 6 ön siparişi. İlk sahiplerden biri olun!"
            }
        }

        // Upsert (Varsa güncelle, yoksa oluştur)
        const product = await Product.findOneAndUpdate(
            { name: testProduct.name },
            testProduct,
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        )
        console.log('✅ Test product created/updated:', product.name)
        console.log('🆔 ID:', product._id)

        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

createTestProduct()
