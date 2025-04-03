import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatArea from './ChatArea';
import './ChatPage.css';

const ChatPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    navigate('/');
  };

  return (
    <div className="chat-page">
      {/* 네비게이션 바 */}
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo">
            <span className="edu">Edu</span><span className="ve">'ve</span>.com
          </h1>
        </div>
        <div className="nav-links">
          <span className="nav-item" onClick={() => navigate('/character')}>캐릭터</span>
          <span className="nav-item" onClick={() => navigate('/chat')}>채팅</span>
          <span className="nav-item" onClick={() => navigate('/materials')}>학습자료</span>
          {username ? (
            <>
              <span className="user-name">{username}</span>
              <span className="nav-item logout-btn" onClick={handleLogout}>로그아웃</span>
            </>
          ) : (
            <>
              <span className="nav-item" onClick={() => navigate('/login')}>로그인</span>
              <span className="nav-item" onClick={() => navigate('/signup')}>회원가입</span>
            </>
          )}
        </div>
      </nav>

      {/* 본문 레이아웃 */}
      <div className="chat-body">
        {/* 왼쪽: 잭슨 이미지 */}
        <div className="chat-left">
          <img src="/jackson.png" alt="잭슨" className="jackson-chat-img" />
          <p className="jackson-label">잭슨</p>
        </div>

        {/* 오른쪽: 채팅 화면 */}
        <div className="chat-right">
          <div className="chat-box">
            <ChatArea />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
