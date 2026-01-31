const mongoose = require('mongoose');
const Product = require('./src/models/Product');

async function createIndex() {
  try {
    await mongoose.connect('mongodb://localhost:27017/eticaret');
    
    // Existing indexes
    const indexes = await Product.collection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));
    
    // Create text index
    await Product.collection.createIndex({ name: 'text', description: 'text', brand: 'text' });
    console.log('✅ Text index created successfully');
    
    process.exit(0);
  } catch (e) {
    console.log('Error:', e.message);
    process.exit(1);
  }
}

createIndex();
