import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 사용자 이름 저장
    localStorage.setItem("username", username);

    // 메인 페이지로 이동
    navigate("/");
  };

  return (
    <div className="login-container">
      <h1 className="title">
        <span className="edu">Edu</span><span className="ve">'ve</span>
      </h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="password" placeholder="비밀번호" />
        <button type="submit" className="login-btn">로그인</button>
      </form>
    </div>
  );
};

export default Login;



