const mongoose = require('mongoose');
const path = require('path');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('❌ MONGODB_URI environment variable is not set.');
        process.exit(1);
    }

    // Absolute path to the AWS CA bundle — anchored to this file's directory
    // so it works regardless of where PM2 / Node starts the process from.
    const tlsCAFile = path.join(__dirname, '..', 'certs', 'global-bundle.pem');

    try {
        const conn = await mongoose.connect(uri, {
            tls: true,
            tlsCAFile,
        });

        console.log(`✅ Connected to Amazon DocumentDB: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ DocumentDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
