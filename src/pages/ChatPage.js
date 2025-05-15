// src/pages/ChatPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatArea from './ChatArea';
import './ChatPage.css';

const ChatPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [messages, setMessages] = useState([]);

  // 사용자명 로드
  useEffect(() => {
    const u = localStorage.getItem('username');
    if (u) setUsername(u);

    // 초기 메시지 로드 (로컬 또는 API)
    const saved = localStorage.getItem('chatMessages');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // 최초 Jackson 인사
      setMessages([{ sender: '잭슨', text: '안녕! 궁금한 걸 물어봐' }]);
    }
  }, []);

  // 사이드바 열 때 지난 대화 주제
  useEffect(() => {
    if (sidebarOpen) {
      fetch('/api/chat/history')
        .then(res => res.json())
        .then(data => setHistoryList(data.topics || []))
        .catch(err => console.error(err));
    }
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="chat-page">
      {/* 네비게이션 */}
      <nav className="navbar">
        <h1 className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}>
          <span className="edu">Edu</span><span className="ve">'ve</span>.com
        </h1>
        <div className="nav-links">
          <span className="nav-item" onClick={() => navigate('/character')}>캐릭터</span>
          <span className="nav-item" onClick={() => navigate('/chat')}>채팅</span>
          <span className="nav-item" onClick={() => navigate('/materials')}>학습자료</span>
          {username ? (
            <div className="user-menu">
              <button className="user-button" onClick={() => setMenuOpen(o => !o)}>
                {username} <span className="arrow">▼</span>
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <button onClick={() => navigate('/settings')}><span className="icon"></span> 설정</button>
                  <button onClick={handleLogout}><span className="icon"></span> 로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <> <span className="nav-item" onClick={() => navigate('/login')}>로그인</span>
               <span className="nav-item" onClick={() => navigate('/signup')}>회원가입</span> </>
          )}
        </div>
      </nav>

      {/* 본문 */}
      <div className={`chat-body ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* 사이드바 */}
        <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          {!sidebarOpen ? (
            <> 
              <img src="/dragon.png" alt="용용이" className="character-thumb" />
              <p className="character-name">용용이</p>
              <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>&gt;&gt;</button>
            </>
          ) : (
            <>
              <button className="sidebar-toggle" onClick={() => setSidebarOpen(false)}>&lt;&lt;</button>
              <h2 className="history-title">지난 대화 주제</h2>
              <ul className="history-list">
                {historyList.map((t,i)=>(<li key={i}>{t}</li>))}
              </ul>
            </>
          )}
        </aside>

        {/* 채팅 메인 */}
        <main className="chat-main">
          <div className="chat-box">
            <ChatArea messages={messages} setMessages={setMessages} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;