import React, { useState } from 'react';
import './ChatPage.css';

const ChatArea = () => {
  const [messages, setMessages] = useState([
    { sender: '잭슨', text: '안녕! 궁금한 걸 물어봐달라냥' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { sender: 'user', text: input };
    setMessages([...messages, newMsg, { sender: '잭슨', text: '잭슨의 응답~' }]);
    setInput('');
  };

  return (
    <div className="chat-area-inner">
      {/* 채팅 메시지 스크롤 영역 */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === 'user' ? 'message-user' : 'message-jackson'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div className="chat-input-box">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요..."
        />
        <button className="chat-send-btn" onClick={handleSend}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatArea;




