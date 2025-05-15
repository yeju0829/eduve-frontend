// src/pages/CharacterPage.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CharacterPage.css";

const CharacterPage = () => {
  const navigate = useNavigate();
  const [tone, setTone] = useState("정중한 말투");
  const [level, setLevel] = useState(2);
  const [username, setUsername] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const rangeRef = useRef(null);

  const characters = [
    { key: "dragon", name: "용용이" },
    { key: "dog", name: "멍멍이" },
    { key: "squirrel", name: "다람이" },
    { key: "cat", name: "냥냥이" },
    { key: "potato", name: "감자" },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  useEffect(() => {
    const percentage = (level / 4) * 100;
    if (rangeRef.current) {
      rangeRef.current.style.background = `
        linear-gradient(to right,
          #CDD6A2 0%, #CDD6A2 ${percentage}%,
          #ddd ${percentage}%, #ddd 100%)
      `;
    }
  }, [level]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    navigate("/");
  };

  const sel = characters[selectedIdx];

  return (
    <div className="character-page-container">
      <nav className="navbar">
        <h1 className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}>
          <span className="edu">Edu</span>
          <span className="ve">'ve</span>
          <span className="com">.com</span>
        </h1>
        <div className="nav-links">
          <span onClick={() => navigate("/character")}>캐릭터</span>
          <span onClick={() => navigate("/chat")}>채팅</span>
          <span onClick={() => navigate("/materials")}>학습자료</span>
          {username ? (
           <div className="user-menu">
             <button
               className="user-button"
               onClick={() => setMenuOpen(open => !open)}
             >
               {username} <span className="arrow">▼</span>
              </button>
             {menuOpen && (
               <div className="user-dropdown">
                 <button onClick={() => {/* 설정 페이지 이동 */}}>
                   <span className="icon">⚙️</span> 설정
                 </button>
                 <button onClick={handleLogout}>
                   <span className="icon">🚪</span> 로그아웃
                 </button>
               </div>
             )}
           </div>
         ) : (
            <>
              <span onClick={() => navigate("/login")}>로그인</span>
              <span onClick={() => navigate("/signup")}>회원가입</span>
            </>
          )}
        </div>
      </nav>

      <div className="character-content">
        {/* 왼쪽 캐릭터 영역 */}
        <div className="character-image">
          <div className="character-image-inner">
            <img
              src={`/${sel.key}.png`}
              alt={sel.name}
              className="main-image"
            />
            <p className="character-name">
              {customName !== ""? customName : sel.name}
            </p>

            <div className="thumbnail-list">
              {characters.map((ch, i) => (
                <img
                  key={ch.key}
                  src={`/${ch.key}.png`}
                  alt={ch.name}
                  className={
                    "thumbnail" + (i === selectedIdx ? " selected" : "")
                  }
                  onClick={() => {
                    setSelectedIdx(i);
                    setCustomName("");      // ← 캐릭터 바뀌면 커스텀 이름 초기화
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽 설정 박스 + 저장 버튼 */}
        <div className="character-settings">
          <div className="settings-box">
            {/* -- setting-group 동일 -- */}
            <div className="setting-group">
              {/* 캐릭터 이름 */}
              <div className="setting-item">
                <label>캐릭터 이름</label>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
              {/* 말투 */}
              <div className="setting-item">
                <label>말투</label>
                <div className="tone-buttons">
                  {["정중한 말투", "친근한 말투", "친절한 말투", "츤데레 말투"].map(
                    (t) => (
                      <button
                        key={t}
                        className={tone === t ? "selected" : ""}
                        onClick={() => setTone(t)}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>
              {/* 사용자 수준 */}
              <div className="setting-item">
                <div className="level-label-wrapper">
                  <label>사용자 수준</label>
                  <span className="user-level-desc">
                    챗봇이 사용자 수준을 고려하여 답변을 생성합니다.
                  </span>
                </div>
                <div className="user-level-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    ref={rangeRef}
                  />
                </div>
                <div className="level-labels">
                  <span>초등학생 수준</span>
                  <span>중학생 수준</span>
                  <span>고등학생 수준</span>
                  <span>대학생 수준</span>
                  <span>전문가 수준</span>
                </div>
              </div>
            </div>
          </div>
          {/* 저장 버튼을 박스 바깥으로 */}
          <button className="save-button">저장</button>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
