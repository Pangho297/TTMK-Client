import React from 'react';
import './style/Login.scss';

//1. 카카오 소셜로그인하기
//2. autorization code 서버로 보내기
//3. isLogin true로 만들기
const Login: React.FC = () => {

  const kakaoLogin = () => {
    const clientId = 'b215c82657f8b9b2b4b7122c866cf0e4';

    const redirectUri = 'http://localhost:3000/ko/search';

    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.assign(kakaoLoginUrl);
  };

  return (
    <div className='login-container'>
      <button className='login-button'onClick={kakaoLogin}></button>
    </div>
  );
};

export default Login;