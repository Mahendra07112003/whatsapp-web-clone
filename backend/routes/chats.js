// routes/chats.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET /chats -> list of chats with last message
router.get('/', async (req, res) => {
  try {
    const chats = await Message.aggregate([
      { $sort: { timestamp: -1 } }, // newest first
      {
        $group: {
          _id: '$wa_id',
          lastMessage: { $first: '$$ROOT' },
          count: { $sum: 1 },
          nameList: { $push: '$name' },
        },
      },
      {
        $project: {
          wa_id: '$_id',
          lastMessage: 1,
          count: 1,
          nameList: 1,
          _id: 0,
        },
      },
      {
        $addFields: {
          name: {
            $let: {
              vars: {
                filtered: {
                  $filter: {
                    input: '$nameList',
                    as: 'n',
                    cond: { $and: [ { $ne: ['$$n', null] }, { $ne: ['$$n', ''] } ] }
                  }
                }
              },
              in: { $ifNull: [ { $arrayElemAt: ['$$filtered', 0] }, '$lastMessage.name' ] }
            }
          }
        }
      },
      { $project: { nameList: 0 } },
      { $sort: { 'lastMessage.timestamp': -1 } },
    ]);

    res.json(chats);
  } catch (err) {
    console.error('Chats route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /chats/:wa_id -> messages for a chat
router.get('/:wa_id', async (req, res) => {
  try {
    const wa_id = req.params.wa_id;
    const messages = await Message.find({ wa_id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Chat messages route error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
