const mongoose = require('mongoose');
// Hardcoded connection string to avoid env issues
const uri = 'mongodb://127.0.0.1:27017/eticaret';

console.log('Connecting to:', uri);

mongoose.connect(uri)
    .then(async () => {
        console.log('✅ Connected successfully');

        // Perform a simple operation
        try {
            const count = await mongoose.connection.db.collection('users').countDocuments();
            console.log('User count:', count);

            // Try to insert a document
            await mongoose.connection.db.collection('test').insertOne({ test: 1 });
            console.log('Insert successful');

            process.exit(0);
        } catch (opError) {
            console.error('Operation failed:', opError);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('❌ Connection failed:', err);
        process.exit(1);
    });
