// src/api/CharacterApi.js
import axiosInstance from './axiosInstance';

// userId로 캐릭터 정보 가져오기
export const fetchUserCharacter = async (userId) => {
  try {
    const response = await axiosInstance.get(`/user/character/${userId}`);
    return response.data;
  } catch (error) {
    console.error('fetchUserCharacter error:', error.response?.data || error.message);
    return null;
  }
};

// 캐릭터 정보 업데이트
export const updateUserCharacter = async (userId, characterData) => {
  try {
    const response = await axiosInstance.put(`/user/character/${userId}`, characterData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('updateUserCharacter error:', error.response?.data || error.message);
    throw error;
  }
};
