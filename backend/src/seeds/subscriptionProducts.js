const mongoose = require('mongoose')
const Product = require('../models/Product')
const connectDB = require('../config/database')
require('dotenv').config()

const updateProductsForSubscription = async () => {
    try {
        await connectDB()

        // Abonelik için uygun ürünleri güncelle (günlük kullanım ürünleri)
        const subscriptionProducts = [
            {
                name: 'Organik Kahve - 250g',
                subscriptionPlans: [
                    { plan: 'weekly', discount: 10, available: true },
                    { plan: 'biweekly', discount: 15, available: true },
                    { plan: 'monthly', discount: 20, available: true }
                ],
                subscriptionBenefits: [
                    'Her teslimat %20\'ye varan indirim',
                    'Ücretsiz kargo',
                    'İstediğin zaman iptal et',
                    'Teslimat sıklığını değiştir'
                ]
            },
            {
                name: 'Premium Protein Tozu - 1kg',
                subscriptionPlans: [
                    { plan: 'monthly', discount: 15, available: true },
                    { plan: 'quarterly', discount: 25, available: true }
                ],
                subscriptionBenefits: [
                    '%25\'e varan tasarruf',
                    'Her ay kapınızda',
                    'Ücretsiz kargo',
                    'Esnek iptal'
                ]
            }
        ]

        for (const prodData of subscriptionProducts) {
            await Product.findOneAndUpdate(
                { name: prodData.name },
                {
                    isSubscriptionAvailable: true,
                    subscriptionPlans: prodData.subscriptionPlans,
                    subscriptionBenefits: prodData.subscriptionBenefits
                }
            )
            console.log(`✅ Updated: ${prodData.name}`)
        }

        console.log('Subscription products updated!')
        process.exit(0)
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

updateProductsForSubscription()
