require("dotenv").config();
const fs = require("fs");
const path = require("path");
const connectDB = require("../utils/db");
const Message = require("../models/Message");

async function processFile(filePath) {
  const rawData = fs.readFileSync(filePath, "utf8");
  const payload = JSON.parse(rawData);

  // Navigate into metaData.entry changes
  if (payload.metaData?.entry) {
    for (const entry of payload.metaData.entry) {
      for (const change of entry.changes) {
        const value = change.value;

        // 1️⃣ Handle new messages
        if (Array.isArray(value.messages) && value.messages.length) {
          const contactName = value.contacts?.[0]?.profile?.name || "";
          const wa_id = value.contacts?.[0]?.wa_id || "";

          for (const m of value.messages) {
            const metaId = m.id;
            const text = m.text?.body || "";
            const timestamp = m.timestamp
              ? new Date(Number(m.timestamp) * 1000)
              : new Date();
            const fromMe = m.from && wa_id ? m.from !== wa_id : false;

            console.log("Inserting message:", {
              wa_id,
              name: contactName,
              text,
              metaId,
              timestamp,
            });

            await Message.findOneAndUpdate(
              { meta_msg_id: metaId },
              {
                wa_id,
                name: contactName,
                number: wa_id,
                text,
                timestamp,
                status: "sent",
                fromMe,
                raw: m,
              },
              { upsert: true }
            );
          }
        }

        // 2️⃣ Handle status updates
        if (Array.isArray(value.statuses) && value.statuses.length) {
          for (const s of value.statuses) {
            const metaId = s.id;
            const status = s.status || "";
            await Message.findOneAndUpdate({ meta_msg_id: metaId }, { status });
          }
        }
      }
    }
  }
}

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const payloadDir = path.join(__dirname, "..", "payloads");
    const files = fs.readdirSync(payloadDir).filter((f) => f.endsWith(".json"));

    for (const file of files) {
      console.log(`Processing: ${file}`);
      await processFile(path.join(payloadDir, file));
    }

    console.log("✅ Finished processing payloads");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error processing payloads:", err);
    process.exit(1);
  }
})();
