// src/api/fileApi.js
import axios from 'axios';
import axiosInstance from './axiosInstance'; // 👈 우리가 만든 인스턴스 import

// ✅ Spring Boot 백엔드 주소
const BASE_URL = 'http://15.164.97.117:8080';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/*
// ✅ 인증 헤더 생성 함수
const getAuthHeaders = (isJson = false) => {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `${token}`,
  };

  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }

  return { headers };
};
*/

//
// ✅ 파일 업로드 (FormData + 인증 헤더)
//
export const uploadFile = (formData) => {
  return axiosInstance.post(`/resources/file/text`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


//
// ✅ 파일 조회
//
export const fetchFile = (fileId) => {
  return axios.get(`${BASE_URL}/resources/file/${fileId}`);
};

//
// ✅ 파일 이름 변경
//
export const renameFile = (fileId, newName) => {
  return axios.patch(
    `${BASE_URL}/resources/file/${fileId}/rename`,
    { name: newName },
    //getAuthHeaders(true)
  );
};

//
// ✅ 파일 이동
//
export const moveFile = (fileId, folderId) => {
  return axios.patch(
    `${BASE_URL}/resources/file/${fileId}/move`,
    { folderId },
    //getAuthHeaders(true)
  );
};

//
// ✅ 파일 삭제
//
export const deleteFile = (fileId) => {
  return axios.delete(`${BASE_URL}/resources/file/${fileId}`);
};

