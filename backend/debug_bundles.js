const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bundle = require('./src/models/Bundle');
const Product = require('./src/models/Product');

dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in .env");
        }
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const debugBundles = async () => {
    await connectDB();

    try {
        console.log('Running Product Query...');
        const products = await Product.find().limit(1);
        console.log('Product Query Result:', products.length > 0 ? 'Success' : 'Empty');

        console.log('Running Bundle Query...');
        const filter = {
            isActive: true,
            endDate: { $gte: new Date() },
            stock: { $gt: 0 }
        };

        console.log('Filter:', filter);

        const bundles = await Bundle.find(filter)
            .populate('products.product', 'name price images brand stock')
            .sort({ createdAt: -1 });

        console.log('Query Successful!');
        console.log('Bundles found:', bundles.length);
        console.log(JSON.stringify(bundles, null, 2));

    } catch (error) {
        console.error('CRITICAL ERROR:', error);
    } finally {
        process.exit();
    }
};

debugBundles();
