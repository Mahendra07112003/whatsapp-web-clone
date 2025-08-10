require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../utils/db');
const Message = require('../models/Message');

async function backfillNames() {
  // Build a map of wa_id -> latest known non-empty name
  const latestNames = await Message.aggregate([
    { $match: { name: { $exists: true, $ne: '' } } },
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$wa_id',
        name: { $first: '$name' },
      },
    },
  ]);

  let updatedTotal = 0;
  for (const entry of latestNames) {
    const waId = entry._id;
    const name = entry.name;
    const res = await Message.updateMany(
      { wa_id: waId, fromMe: true, $or: [{ name: { $exists: false } }, { name: '' }] },
      { $set: { name } }
    );
    updatedTotal += res.modifiedCount || 0;
  }

  return updatedTotal;
}

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const modified = await backfillNames();
    console.log(`✅ Backfill complete. Updated ${modified} message(s).`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Backfill error:', err);
    process.exit(1);
  }
})();


