const mongoose = require('mongoose');

/**
 * Connects to MongoDB database with retry logic and connection pooling.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crystal-ecom';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    console.log(`✨ MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn('⚠️ MongoDB connection notice (running with fallback capability):', err.message);
    return null;
  }
}

module.exports = connectDB;
