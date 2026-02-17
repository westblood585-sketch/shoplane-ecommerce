const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongooseOptions = {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    console.error(`Connection URI: ${process.env.MONGODB_URI}`)
    process.exit(1)
  }
}

module.exports = connectDB

