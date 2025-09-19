const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Track connection status
let isConnected = false;

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('MongoDB URI not found in environment variables');
        throw new Error('MONGO_URI is required');
    }

    // If already connected, reuse the connection
    if (isConnected) {
        console.log('Using existing database connection');
        return mongoose.connection;
    }

    const options = {
        serverSelectionTimeoutMS: 30000, // Increased timeout (30 seconds)
        socketTimeoutMS: 45000,
        maxPoolSize: 10, // Set max pool size for better connection reuse
        minPoolSize: 5, // Maintain at least 5 connections
        family: 4, // Use IPv4
        bufferCommands: false, // Disable command buffering
    };

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle disconnection events
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            isConnected = false;
        });
        
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        isConnected = false;
        throw error;
    }
};

module.exports = connectDB;
