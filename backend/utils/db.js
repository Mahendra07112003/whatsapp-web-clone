// utils/db.js
const mongoose = require('mongoose');

async function connectDB(mongoUri) {
  if (!mongoUri) throw new Error('MONGO_URI is missing in environment variables');

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // stop the app if DB fails to connect
  }
}

module.exports = connectDB;
