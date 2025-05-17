import axios from "axios";

const BASE_URL = "http://15.165.205.11:8080";

// 공통 Authorization 헤더 생성 함수
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { headers: { Authorization: `${token}` } }
    : {};
};

// 1. 전체 캐릭터 목록 가져오기 (토큰 없이도 가능)
export const fetchAllCharacters = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/characters`);
    return response.data.allCharacterList;
  } catch (error) {
    console.error("캐릭터 목록 불러오기 실패:", error);
    return [];
  }
};

// 2. 개별 캐릭터 정보 가져오기 (토큰 없이도 가능)
export const fetchCharacterDetail = async (characterId) => {
  try {
    const response = await axios.get(`${BASE_URL}/characters/${characterId}`);
    return response.data;
  } catch (error) {
    console.error(`캐릭터 ${characterId} 정보 불러오기 실패:`, error);
    return null;
  }
};

// 3. 특정 유저의 캐릭터 설정 가져오기 (토큰 필요)
export const fetchUserCharacter = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/userCharacter/${userId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(`유저 ${userId} 캐릭터 불러오기 실패:`, error);
    return null;
  }
};

// 4. 유저 캐릭터 설정 저장/업데이트 (토큰 필요)
export const updateUserCharacter = async (userId, characterData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/userCharacter/${userId}`,
      characterData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("캐릭터 설정 저장 실패:", error);
    throw error;
  }
};
