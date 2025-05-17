import axios from "axios";

const BASE_URL = "https://your.api.server"; // ← 실제 백엔드 주소로 변경

// 1. 전체 캐릭터 목록 가져오기 (/characters)
export const fetchAllCharacters = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/characters`);
    return response.data.allCharacterList;
  } catch (error) {
    console.error("캐릭터 목록 불러오기 실패:", error);
    return [];
  }
};

// 2. 개별 캐릭터 정보 가져오기 (/characters/{id})
export const fetchCharacterById = async (characterId) => {
  try {
    const response = await axios.get(`${BASE_URL}/characters/${characterId}`);
    return response.data;
  } catch (error) {
    console.error(`캐릭터 ${characterId} 정보 불러오기 실패:`, error);
    return null;
  }
};

// 3. 특정 유저의 캐릭터 설정 가져오기 (/userCharacter/{userId})
export const fetchUserCharacter = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/userCharacter/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`유저 ${userId} 캐릭터 불러오기 실패:`, error);
    return null;
  }
};

// 4. 유저 캐릭터 설정 저장/업데이트 (PUT /userCharacter/{userId})
export const updateUserCharacter = async (userId, characterData) => {
  try {
    const response = await axios.put(`${BASE_URL}/userCharacter/${userId}`, characterData);
    return response.data;
  } catch (error) {
    console.error("캐릭터 설정 저장 실패:", error);
    throw error;
  }
};
