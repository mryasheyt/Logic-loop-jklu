const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    try {
        // In production (NODE_ENV=production), strictly use MONGO_URI from env
        if (process.env.NODE_ENV === 'production') {
            if (!process.env.MONGO_URI) {
                throw new Error('MONGO_URI is not defined in environment variables');
            }
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } else {
            // For local development, use In-Memory MongoDB
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            const conn = await mongoose.connect(uri);
            console.log(`MongoDB In-Memory connected: ${conn.connection.host}`);
        }
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
