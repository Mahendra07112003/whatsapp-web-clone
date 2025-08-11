
## Live Demo
https://whatsapp-web-clone-indol.vercel.app/

## WhatsApp Web Clone (Demo)

A WhatsApp web–style chat viewer built with Node/Express + MongoDB and React. It ingests webhook-like JSON payloads, stores messages, aggregates chats by contact, shows timestamps and delivery status, and lets you send messages (DB only, no external WhatsApp API).

### Features
- Chat list with last message and contact name
- Conversation view with WhatsApp-like UI
- 12-hour timestamps with AM/PM, message status (sent/delivered/read)
- Webhook endpoint to ingest JSON payloads
- Script to bulk-import sample payloads
- Name backfill for outgoing messages
- Responsive layout (mobile list/chat views)

### Tech Stack
- Backend: Node.js, Express, Mongoose, MongoDB
- Frontend: React (CRA), Axios
- Tooling: dotenv, morgan, cors

### Monorepo Structure
- `backend/`: Express server, routes, Mongo models, scripts
- `frontend/`: React app (CRA)

### Quick Start
Prereqs: Node 18+, MongoDB (local or Atlas)

1) Backend
```bash
cd backend
# set MONGO_URI for your environment
# local example:
set MONGO_URI=mongodb://127.0.0.1:27017/whatsapp_clone
npm install
npm run dev
# Health check: http://localhost:5000/
```

2) Seed sample data (optional)
```bash
cd backend
# uses backend/payloads/*.json
set MONGO_URI=...
npm run process-payloads
# optional: backfill names for older outgoing messages
npm run backfill-names
```

3) Frontend
```bash
cd frontend
npm install
npm start
# App will use API_BASE http://localhost:5000 (see src/api.js)
```

### Backend Endpoints
- `GET /` → health
- `POST /webhook` → ingest payload (`metaData.entry[].changes[].value`)
- `GET /chats` → list chats with `{ wa_id, name, lastMessage, count }`
- `GET /chats/:wa_id` → messages for a chat (ascending by timestamp)
- `POST /send` → create outgoing message `{ wa_id, text }` (stored only)

### Environment
- `MONGO_URI` (required, backend)
- Frontend API base: `frontend/src/api.js` (`API_BASE`)

### Scripts
Backend:
- `npm run dev` – start server with nodemon
- `npm run start` – start server
- `npm run process-payloads` – import sample payloads from `backend/payloads/`
- `npm run backfill-names` – fill missing names on outgoing messages

Frontend:
- `npm start`, `npm build`, `npm test`

### Notes
- Data stored in Mongo collection `processed_messages`
- `fromMe` is derived from payload `m.from !== wa_id`
- CORS enabled for local dev

### Roadmap
- Real-time updates (Socket.io)
- Pagination and search
- Auth and multi-user support
- Message delivery via provider API (out of scope for this demo)

License: MIT
