// src/api.js
import axios from 'axios';

// Backend base URL. In production, set REACT_APP_API_BASE in your host.
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// Get list of chats
export const getChats = () => axios.get(`${API_BASE}/chats`);

// Get all messages for a specific chat
export const getMessages = (wa_id) => axios.get(`${API_BASE}/chats/${wa_id}`);

// Send a message
export const sendMessage = (data) => axios.post(`${API_BASE}/send`, data);
