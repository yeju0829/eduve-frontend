// src/pages/ChatArea.js
import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import ReactMarkdown from 'react-markdown';
import { Document, Page, pdfjs } from 'react-pdf';
import './ChatArea.css';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const ChatArea = ({ messages, setMessages, username }) => {
  const [input, setInput] = useState(''); // 입력창 상태
  const [liked, setLiked] = useState({}); // 좋아요 상태
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);


  const [loading, setLoading] = useState(false);
  // 메시지 목록을 참조하기 위한 ref 추가
  const messagesEndRef = useRef(null);

  // 스크롤 자동 이동 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 메시지가 업데이트될 때마다 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 토큰에서 userId 추출
  const token = localStorage.getItem('token');
  const { userId } = token ? jwtDecode(token) : {};


  // 대화 기록을 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);


  // 좋아요 상태를 토글하는 함수
  const toggleLike = async (messageId, isLiked) => {
    try {
      if (!messageId) {
        console.error('메시지 ID가 없습니다.');
        return;
      }

      setLoading(true);
      
      if (isLiked) {
        // 좋아요 취소
        await axiosInstance.delete(`/messagelike/${messageId}`);
      } else {
        // 좋아요 추가
        await axiosInstance.post(`/messagelike/${messageId}`);
      }
      
      // 상태 업데이트
      setLiked(prev => ({
        ...prev,
        [messageId]: !isLiked
      }));

    } catch (err) {
      console.error('좋아요 처리 실패:', err.response?.data || err.message);
      if (err.response) {
        console.error('Error status:', err.response.status);
        console.error('Error details:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };


  // 변경: url + page 객체 받기
  const openPdfPreview = (url) => {
    setPreviewPdfUrl(url);
  };
  const closePdfPreview = () => {
    setPreviewPdfUrl(null);
  };

  // 전송 처리
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const question = input;
    setInput('');

    // 사용자 메시지 즉시 표시
    setMessages(prev => [...prev, {
      sender: 'user',
      text: question,
      messageId: `temp-${Date.now()}`,
      userMessage: true,
    }]);

    // 백엔드 요청
    try {
      const res = await axiosInstance.post(
        `/chat/start/${userId}`, 
        { question },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const { botMessage, fileNameAndUrl } = res.data;
      const filePreview = fileNameAndUrl && fileNameAndUrl.length === 3
        ? {
            url: fileNameAndUrl[2],
            page: parseInt(fileNameAndUrl[1], 10) || 1,
            title: fileNameAndUrl[0],
          }
        : null;
      
      // 봇 응답만 추가 (사용자 메시지는 이미 표시됨)
      setMessages(prev => [
        ...prev,
        {
          sender: '잭슨',
          text: botMessage.answer ?? '답변을 불러올 수 없어요!',
          messageId: botMessage.messageId,
          pdfPreview: filePreview,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: '잭슨', text: '질문 처리 중 오류가 발생했어요 😢' }
      ]);
    }
  };

  // 엔터 키로 메시지 전송 (Shift+Enter는 제외)
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 엔터 동작 방지
      handleSend();
    }
  };

  return (
    <>
      <div className="chat-area-inner">
        <SimpleBar
          style={{ 
            height: 'calc(100vh - 180px)',  // 전체 높이에서 헤더(80px) + 하단여백(100px) 제외
            paddingRight: '18px'
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={msg.messageId || msg.id || idx}
              className={`chat-message-wrapper ${msg.userMessage ? 'user' : ''}`}
            >
              <div
                className={`chat-message ${
                  msg.userMessage ? 'message-user' : 'message-jackson'
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>

                {!msg.userMessage && (
                  <img
                    src={liked[msg.messageId || msg.id] ? '/thumbs_fill.png' : '/thumbs_blank.png'}
                    alt="thumbs up"
                    className="thumb-icon"
                    onClick={() => toggleLike(msg.messageId || msg.id, liked[msg.messageId || msg.id])}
                  />
                )}

                {/* PDF 링크로 변경 */}
                {msg.pdfPreview?.url && (
                  <div
                    style={{
                      marginTop: '6px',
                      color: 'blue',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    onClick={() => openPdfPreview(msg.pdfPreview.url, msg.pdfPreview.title, msg.pdfPreview.page)}
                  >
                    📄 {msg.pdfPreview.title
                      ? `${msg.pdfPreview.title} - ${msg.pdfPreview.page}쪽 확인하기`
                      : `PDF 파일 - ${msg.pdfPreview.page}쪽 확인하기`}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </SimpleBar>

        <div className="chat-input-wrapper">
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
      </div>

      {/* PDF 미리보기 모달 */}
      {previewPdfUrl && (
        <div
          className="modal-overlay"
          onClick={closePdfPreview}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '80vw',
              height: '90vh',
              backgroundColor: 'white',
              borderRadius: 8,
              position: 'relative',
              padding: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <button
              onClick={closePdfPreview}
              style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
            >
              닫기
            </button>
            <iframe
              src={previewPdfUrl}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;
