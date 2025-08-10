// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./utils/db');

// Import routes (we will create them later)
const webhookRoute = require('./routes/webhook');
const chatsRoute = require('./routes/chats');
const sendRoute = require('./routes/send');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'WhatsApp backend running' });
});
app.use('/webhook', webhookRoute);
app.use('/chats', chatsRoute);
app.use('/send', sendRoute);

// Start server after DB connection
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
  }
})();
