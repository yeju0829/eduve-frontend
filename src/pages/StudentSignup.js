import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentSignup.css";

const StudentSignup = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/login");
  }

  return (
    <div className="student-signup-container">
      <h1 className="title">
        <span className="edu">Edu</span><span className="ve">'ve</span>
      </h1>
      <h2>학생 회원가입</h2>
      <form className="signup-form">

        {/* 아이디 입력 + 중복확인 버튼 */}
        <div className="input-group">
          <label>아이디<span className="required">*</span></label>
          <div className="input-container with-button">
            <input type="text" placeholder="6자 이상의 영문 혹은 영문과 숫자 조합" />
            <button type="button">중복확인</button>
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="input-group">
          <label>비밀번호<span className="required">*</span></label>
          <div className="input-container">
            <input type="password" placeholder="비밀번호를 입력해주세요" />
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="input-group">
          <label>비밀번호 확인<span className="required">*</span></label>
          <div className="input-container">
            <input type="password" placeholder="비밀번호를 한번 더 입력해주세요" />
          </div>
        </div>

        {/* 이름 입력 */}
        <div className="input-group">
          <label>이름<span className="required">*</span></label>
          <div className="input-container">
            <input type="text" placeholder="이름을 입력해주세요" />
          </div>
        </div>

        {/* 이메일 입력 + 중복확인 버튼 */}
        <div className="input-group">
          <label>이메일<span className="required">*</span></label>
          <div className="input-container with-button">
            <input type="email" placeholder="이메일을 입력해주세요" />
            <button type="button">중복확인</button>
          </div>
        </div>

        {/* 학원 코드 입력 + 코드 확인 버튼 */}
        <div className="input-group">
          <label>학원 코드<span className="required">*</span></label>
          <div className="input-container with-button">
            <input type="text" placeholder="학원 코드를 입력해주세요" />
            <button type="button">코드 확인</button>
          </div>
        </div>

        {/* 가입하기 버튼 */}
        <button type="submit" className="submit-btn">가입하기</button>

        {/* 로그인 링크 */}
        <p className="login-link">
          이미 계정이 있으신가요? 
          <span className="login-button" onClick={() => navigate("/login", { state: { userType: "student" } })}>
            로그인하기
          </span>
        </p>
      </form>
    </div>
  );
};

export default StudentSignup;


