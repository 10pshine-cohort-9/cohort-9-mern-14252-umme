const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Connects to MongoDB using the connection string in MONGO_URI.
 * Call this once at startup (see src/server.js).
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notes_app';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return mongoose.connection;
};

module.exports = { mongoose, connectDB };
