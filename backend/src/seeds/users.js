const mongoose = require('mongoose')
const User = require('../models/User')
const connectDB = require('../config/database')
require('dotenv').config()

const users = [
    {
        name: 'Demo User',
        email: 'demo@example.com',
        password: '123456', // This will be hashed by the pre-save hook
        phone: '+90 555 123 4567',
        role: 'user',
        isActive: true,
        gamification: {
            points: 500,
            level: 1,
            badges: [],
            dailySpinAvailable: true,
            totalOrders: 0,
            totalSpent: 0
        }
    },
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        phone: '+90 555 999 8888',
        role: 'admin',
        isActive: true,
        gamification: {
            points: 0,
            level: 1,
            badges: [],
            dailySpinAvailable: true,
            totalOrders: 0,
            totalSpent: 0
        }
    }
]

const seedUsers = async () => {
    try {
        await connectDB()

        // Check if users already exist
        const existingUsers = await User.countDocuments()

        if (existingUsers > 0) {
            console.log('ℹ️  Users already exist in database. Skipping seed.')
            console.log('📧 Demo User: demo@example.com / 123456')
            console.log('👤 Admin User: admin@example.com / admin123')
            process.exit(0)
            return
        }

        // Insert new users (only if none exist)
        for (const userData of users) {
            const user = new User(userData)
            await user.save() // This will trigger the password hashing
        }

        console.log('✅ Users seeded successfully')
        console.log('📧 Demo User: demo@example.com / 123456')
        console.log('👤 Admin User: admin@example.com / admin123')

        process.exit(0)
    } catch (error) {
        console.error('❌ Error seeding users:', error.message)
        process.exit(1)
    }
}

seedUsers()
