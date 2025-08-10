import React, { useEffect, useState } from 'react';
import { getMessages, sendMessage } from '../api';

export default function MessageView({ wa_id, name, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  useEffect(() => {
    if (!wa_id) return;

    // Fetch messages for the selected chat
    getMessages(wa_id)
      .then(res => setMessages(res.data))
      .catch(err => console.error('Error fetching messages:', err));
  }, [wa_id]);

  // Light polling to refresh statuses/timestamps periodically
  useEffect(() => {
    if (!wa_id) return;
    const intervalId = setInterval(() => {
      getMessages(wa_id)
        .then(res => setMessages(res.data))
        .catch(() => {});
    }, 4000);
    return () => clearInterval(intervalId);
  }, [wa_id]);

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await sendMessage({ wa_id, text });
      const saved = res?.data?.message || {
        wa_id,
        text,
        fromMe: true,
        timestamp: new Date(),
        status: 'sent',
      };
      setMessages(prev => [...prev, saved]);
      setText('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (!wa_id) {
    return (
      <section className="wa-chat" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#667781' }}>Select a chat to view messages</div>
      </section>
    );
  }

  return (
    <section className="wa-chat">
      <div className="wa-chat-header">
        <button
          className="wa-back"
          aria-label="Back"
          onClick={() => onBack && onBack()}
        >
          ←
        </button>
        <div className="wa-avatar" />
        <div style={{ fontWeight: 600 }}>{name || wa_id}</div>
      </div>

      <div className="wa-messages">
        {messages.map((m, i) => (
          <div key={i} className={`wa-bubble ${m.fromMe ? 'me' : 'them'}`}>
            <div>{m.text}</div>
            <div className="wa-meta">
              <span>{formatTime(m.timestamp)}</span>
              {m.fromMe && <span>{m.status || 'sent'}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="wa-input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </section>
  );
}
