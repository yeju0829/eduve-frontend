import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // localStorage에서 사용자 이름 가져오기
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    } else {
      setUsername(""); // 처음 로드될 때 로그인 안 한 상태로 설정
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username"); // 로그아웃 시 localStorage에서 삭제
    setUsername(""); // 상태 초기화
    navigate("/"); // 메인 페이지로 이동
  };

  return (
    <div className="main-container">
      {/* 네비게이션 바 */}
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo">
            <span className="edu">Edu</span><span className="ve">'ve</span>.com
          </h1>
        </div>

        <div className="nav-links">
          <span className="nav-item" onClick={() => navigate("/character")}>캐릭터</span>
          <span className="nav-item" onClick={() => navigate("/chat")}>채팅</span>
          <span className="nav-item" onClick={() => navigate("/materials")}>학습자료</span>

          {username ? (
            <>
              <span className="user-name">{username}</span>
              <span className="nav-item logout-btn" onClick={handleLogout}>로그아웃</span>
            </>
          ) : (
            <>
              <span className="nav-item" onClick={() => navigate("/login")}>로그인</span>
              <span className="nav-item" onClick={() => navigate("/signup")}>회원가입</span>
            </>
          )}
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <div className="main-content">
        <div className="text-container">
          <h2>Ask, Learn, Grow</h2>
          <p className="sub-text">Your Custom AI Teacher Is <br /> Always Here</p>
        </div>
        <div className="image-container">
          <img src="/ai-teacher.png" alt="AI Teacher" className="ai-teacher" />
          <img src="/learning-student.png" alt="Learning Student" className="learning-student" />
          <img src="/ai-character.png" alt="AI Character" className="ai-character" />
        </div>
      </div>
    </div>
  );
};

export default MainPage;







