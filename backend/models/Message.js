// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  wa_id: { type: String, index: true },        // WhatsApp user ID or phone number
  name: String,                                // Contact name
  number: String,                              // Phone number
  text: String,                                // Message text
  timestamp: { type: Date, default: Date.now },// Message time
  status: { type: String, default: 'sent' },   // sent | delivered | read
  meta_msg_id: { type: String, index: true },  // Unique ID for status updates
  fromMe: { type: Boolean, default: false },   // If message is sent by us
  raw: { type: mongoose.Schema.Types.Mixed }   // Store full original payload
}, { collection: 'processed_messages' });      // Use fixed collection name

module.exports = mongoose.model('Message', MessageSchema);
