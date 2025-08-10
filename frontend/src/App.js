import React, { useEffect, useState } from 'react';
import ChatList from './components/ChatList';
import MessageView from './components/MessageView';
import './whatsapp.css';

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const appClass = isMobile
    ? `wa-app ${selectedChat ? 'mobile-chat' : 'mobile-list'}`
    : 'wa-app';

  return (
    <div className={appClass}>
      <ChatList onSelect={(chat) => setSelectedChat(chat)} />
      <MessageView wa_id={selectedChat?.wa_id} name={selectedChat?.name || selectedChat?.lastMessage?.name} onBack={() => setSelectedChat(null)} />
    </div>
  );
}

export default App;
