import axios from "axios";

// 기본 axios 인스턴스 만들기
const axiosInstance = axios.create({
  baseURL: "http://15.165.205.11:8080", // API 주소
});

// 요청마다 토큰 붙이기
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token; // "Bearer ..." 형식 그대로 저장돼 있음
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;