// MongoDB connection test endpoint
const connectDB = require('../config/db');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
  try {
    // Attempt to connect to MongoDB
    await connectDB();
    
    // If we get here, connection is successful
    const info = {
      status: 'Database connection successful',
      dbName: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      models: Object.keys(mongoose.models)
    };
    
    res.status(200).json(info);
  } catch (error) {
    console.error('DB test error:', error);
    res.status(500).json({
      status: 'Database connection failed',
      error: error.message,
      mongoUri: process.env.MONGO_URI ? 
        `${process.env.MONGO_URI.substring(0, 20)}...` : 
        'MONGO_URI not set',
      stack: error.stack
    });
  }
}; 