// src/pages/ChatArea.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import ReactMarkdown from 'react-markdown';
import './ChatArea.css';

const ChatArea = () => {
  const [messages, setMessages] = useState([
    { sender: '잭슨', text: '안녕! 궁금한 걸 물어보라듀' }
    // 나중에 백엔드에서 { sender, text, thumbnails: [{ imgUrl, pdfUrl }, …] } 형태로 내려올 수 있습니다
  ]);
  const [input, setInput] = useState('');
  const [liked, setLiked] = useState({});
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

  // 대화 기록을 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // 좋아요 토글
  const toggleLike = idx => {
    setLiked(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // PDF 모달 열기/닫기
  const openPdfPreview = url => {
    setPreviewPdfUrl(url);
  };
  const closePdfPreview = () => {
    setPreviewPdfUrl(null);
  };

  // 전송 처리
  const handleSend = async () => {
    if (!input.trim()) return;
    // 1) 유저 메시지 추가
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const question = input;
    setInput('');

    // 2) 백엔드 요청
    try {
      const token = localStorage.getItem('token');
      const { userId } = jwtDecode(token);
      const res = await axiosInstance.post(
        `/chat/start/${userId}`,
        { question },
        { headers: { 'Content-Type': 'application/json' } }
      );
      // 예: res.data.botMessage.answer, res.data.botMessage.thumbnails
      const bot = res.data.botMessage || {};
      const answer = bot.answer ?? '답변을 불러올 수 없어요!';
      const thumbnails = bot.thumbnails; // [{ imgUrl, pdfUrl }, …]
      setMessages(prev => [...prev, { sender: '잭슨', text: answer, thumbnails }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: '잭슨', text: '질문 처리 중 오류가 발생했어요 😢' }
      ]);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <div className="chat-area-inner">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className="chat-message-wrapper">
              <div
                className={`chat-message ${
                  msg.sender === 'user' ? 'message-user' : 'message-jackson'
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>

                {/* 좋아요 아이콘 (잭슨 메시지에만) */}
                {msg.sender === '잭슨' && (
                  <img
                    src={liked[idx] ? '/thumbs_fill.png' : '/thumbs_blank.png'}
                    alt="thumbs up"
                    className="thumb-icon"
                    onClick={() => toggleLike(idx)}
                  />
                )}

                {/* PDF 썸네일 (백엔드가 thumbnails 배열을 내려줄 때) */}
                {msg.thumbnails?.map((t, i) => (
                  <img
                    key={i}
                    src={t.imgUrl}
                    alt="pdf preview"
                    className="pdf-thumbnail"
                    onClick={() => openPdfPreview(t.pdfUrl)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-separator" />

        <div className="chat-input-box">
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="질문을 입력하세요..."
          />
          <button className="chat-send-btn" onClick={handleSend}>
            전송
          </button>
        </div>
      </div>

      {/* PDF 미리보기 모달 */}
      {previewPdfUrl && (
        <div className="modal-overlay" onClick={closePdfPreview}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <iframe
              src={previewPdfUrl}
              title="PDF Viewer"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
            <button className="close-btn" onClick={closePdfPreview}>
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;
