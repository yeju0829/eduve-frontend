// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: "http://15.165.205.11:8080", // API 주소
=======
  baseURL: 'http://15.165.205.11:8080', // API 주소
  timeout: 50000,
  withCredentials: true,
>>>>>>> 8ecfb48f70108026030f79a5f33dfc01ddbc9416
});

// 요청 인터셉터: 요청 로그 출력 + 토큰 헤더 처리
axiosInstance.interceptors.request.use(
  config => {
    console.log('🌐 [Request]', config.method.toUpperCase(), config.url);

    // localStorage에 저장된 토큰에서 "Bearer " 접두사 제거 후 재조립
    const raw = localStorage.getItem('token') || '';
    const token = raw.replace(/^Bearer\s+/i, '').trim();

    if (token) {
<<<<<<< HEAD
      // Ensure token has Bearer prefix
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    if (!config.headers['Content-Type'] && !config.headers['content-type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    console.log('[Request]', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    
=======
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization:', config.headers.Authorization);
    } else {
      console.warn('❌ No token found in localStorage');
    }

    console.log('🌐 [Request Headers]', config.headers);
>>>>>>> 8ecfb48f70108026030f79a5f33dfc01ddbc9416
    return config;
  },
  error => {
    console.error('🌐 [Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 응답 로그 출력 + 에러 처리
axiosInstance.interceptors.response.use(
  response => {
    console.log('🌐 [Response]', response.status, response.config.url);
    console.log('🌐 [Response Data]', response.data);
    return response;
  },
  error => {
    if (error.response) {
      console.error(
        '🌐 [Response Error]',
        error.response.status,
        error.response.config.url
      );
      console.error('🌐 [Error Data]', error.response.data);
    } else {
      console.error('🌐 [Network/Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
