import React, { useEffect, useState } from 'react';
import { getChats } from '../api';

export default function ChatList({ onSelect }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Fetch chats when component mounts
    getChats()
      .then(res => setChats(res.data))
      .catch(err => console.error('Error fetching chats:', err));
  }, []);

  return (
    <aside className="wa-sidebar">
      <div className="wa-sidebar-header">Chats</div>
      <div className="wa-chat-list">
        {chats.length === 0 && (
          <div style={{ padding: 12, color: '#667781' }}>No chats found.</div>
        )}
        {chats.map((chat) => (
          <div
            key={chat.wa_id}
            className="wa-chat-item"
            onClick={() => onSelect(chat)}
          >
            <div className="wa-avatar" />
            <div className="wa-chat-item-main">
              <div className="wa-chat-title">
                {chat.name || chat.lastMessage?.name || chat.wa_id}
              </div>
              <div className="wa-chat-sub">{chat.lastMessage?.text}</div>
            </div>
            {/* Optional time placeholder could be added here */}
          </div>
        ))}
      </div>
    </aside>
  );
}
