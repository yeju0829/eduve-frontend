import React, { useState } from 'react';
import axios from 'axios';
import './ChatPage.css';

const ChatArea = () => {
  const [messages, setMessages] = useState([
    { sender: '잭슨', text: '안녕! 궁금한 걸 물어봐달라냥' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem('token');
    const userQuestion = input;

    // 사용자 메시지를 먼저 표시
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userQuestion }
    ]);
    setInput(''); // 입력창 비우기

    try {
      const res = await axios.post(
        `http://15.164.97.117:8080/chat/start/2`,
        { content: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botAnswer = res.data.botMessage?.answer;

      setMessages((prev) => [
        ...prev,
        { sender: '잭슨', text: botAnswer || '답변을 불러오지 못했어요!' },
      ]);
    } catch (err) {
      console.error('채팅 질문 전송 실패:', err);
      setMessages((prev) => [
        ...prev,
        { sender: '잭슨', text: '질문을 처리하는 중 오류가 발생했어요 😢' },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-area-inner">
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

      <div className="chat-input-box">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="질문을 입력하세요..."
        />
        <button className="chat-send-btn" onClick={handleSend}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatArea;







