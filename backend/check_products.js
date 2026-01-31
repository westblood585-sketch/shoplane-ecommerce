const mongoose = require('mongoose');
const Product = require('./src/models/Product');

async function check() {
  try {
    await mongoose.connect('mongodb://localhost:27017/eticaret');
    const count = await Product.countDocuments();
    console.log('Total products:', count);
    
    if (count > 0) {
      const products = await Product.find().limit(5).select('name brand price category');
      console.log('\nSample products:');
      products.forEach(p => console.log(`- ${p.name} (${p.brand}) - ₺${p.price} - ${p.category}`));
    }
    
    process.exit(0);
  } catch (e) {
    console.log('Error:', e.message);
    process.exit(1);
  }
}

check();
