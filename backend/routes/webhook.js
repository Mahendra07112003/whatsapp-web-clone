const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/', async (req, res) => {
  try {
    const payload = req.body;

    if (payload.metaData?.entry) {
      for (const entry of payload.metaData.entry) {
        for (const change of entry.changes) {
          const value = change.value;

          // Handle messages
          if (Array.isArray(value.messages) && value.messages.length) {
            const contactName = value.contacts?.[0]?.profile?.name || '';
            const wa_id = value.contacts?.[0]?.wa_id || '';

            for (const m of value.messages) {
              const metaId = m.id;
              const text = m.text?.body || '';
              const timestamp = m.timestamp
                ? new Date(Number(m.timestamp) * 1000)
                : new Date();
              const fromMe = m.from && wa_id ? m.from !== wa_id : false;

              await Message.findOneAndUpdate(
                { meta_msg_id: metaId },
                {
                  wa_id,
                  name: contactName,
                  number: wa_id,
                  text,
                  timestamp,
                  status: 'sent',
                  fromMe,
                  raw: m
                },
                { upsert: true }
              );
            }
          }

          // Handle statuses
          if (Array.isArray(value.statuses) && value.statuses.length) {
            for (const s of value.statuses) {
              const metaId = s.id;
              const status = s.status || '';
              await Message.findOneAndUpdate(
                { meta_msg_id: metaId },
                { status }
              );
            }
          }
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Webhook error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
