// routes/send.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST /send -> save a new message to the DB
router.post('/', async (req, res) => {
  try {
    const { wa_id, text, name = '', fromMe = true } = req.body;

    if (!wa_id || !text) {
      return res.status(400).json({ error: 'wa_id and text are required' });
    }

    // If no name provided, try to lookup the most recent name for this wa_id
    let resolvedName = name;
    if (!resolvedName) {
      const last = await Message.findOne({ wa_id }).sort({ timestamp: -1 });
      if (last?.name) resolvedName = last.name;
    }

    const newMessage = await Message.create({
      wa_id,
      name: resolvedName,
      number: wa_id,
      text,
      fromMe,
      status: 'sent',
      meta_msg_id: Date.now().toString(), // unique ID for the message
      timestamp: new Date(),
    });

    res.json({ ok: true, message: newMessage });
  } catch (err) {
    console.error('Send route error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
