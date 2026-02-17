require('dotenv').config()
const mongoose = require('mongoose')
const Funnel = require('./src/models/Funnel')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eticaret'

const seedFunnel = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('📦 Connected to MongoDB')

    // Check if funnel already exists
    const existing = await Funnel.findOne({ name: 'E-commerce Purchase Funnel' })
    if (existing) {
      console.log('✅ Funnel already exists:')
      console.log(`   - ID: ${existing._id}`)
      console.log(`   - Name: ${existing.name}`)
      process.exit(0)
    }

    // Create E-commerce funnel
    const ecommerceFunnel = await Funnel.create({
      name: 'E-commerce Purchase Funnel',
      description: 'Track customer journey from homepage to purchase',
      steps: [
        {
          name: 'Homepage',
          type: 'pageview',
          url: '/',
          order: 0
        },
        {
          name: 'Product View',
          type: 'pageview',
          urlPattern: '/products/.*',
          order: 1
        },
        {
          name: 'Add to Cart',
          type: 'event',
          eventName: 'add_to_cart',
          order: 2
        },
        {
          name: 'Checkout',
          type: 'pageview',
          url: '/checkout',
          order: 3
        },
        {
          name: 'Purchase',
          type: 'event',
          eventName: 'purchase',
          order: 4
        }
      ],
      timeWindow: {
        value: 24,
        unit: 'hours'
      },
      analytics: {
        totalSessions: 0,
        completedSessions: 0,
        conversionRate: 0,
        avgTimeToComplete: 0,
        stepData: []
      }
    })

    console.log('✅ Funnel created successfully!')
    console.log(`   - ID: ${ecommerceFunnel._id}`)
    console.log(`   - Name: ${ecommerceFunnel.name}`)
    console.log(`   - Steps: ${ecommerceFunnel.steps.length}`)
    console.log('\n📝 Update App.jsx with this funnel ID:')
    console.log(`   const { trackEvent } = useFunnelTracking('${ecommerceFunnel._id}', ecommerceFunnelSteps)`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding funnel:', error.message)
    process.exit(1)
  }
}

seedFunnel()
