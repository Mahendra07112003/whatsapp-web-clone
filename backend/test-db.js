require('dotenv').config();
const connectDB = require('./utils/db');

(async () => {
  await connectDB(process.env.MONGO_URI);
  console.log('Connection test complete ✅');
  process.exit(0);
})();
