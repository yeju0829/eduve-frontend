import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType || "student"; // 회원가입 시 전달된 사용자 타입
  const [username, setUsername] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (userType === "student") {
      navigate("/dashboard", { state: { name: username } });
    } else {
      navigate("/teacher-dashboard", { state: { name: username } });
    }
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
      <hr />
      <p className="links">
        <span>아이디 찾기</span> | <span>비밀번호 찾기</span> |  
        <span className="signup-link" onClick={() => navigate("/signup")}> 회원가입</span>
      </p>
    </div>
  );
};

export default Login;



