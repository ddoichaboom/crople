import axios from 'axios'; // axios를 사용하여 HTTP 요청을 보냅니다.
import { API_URL } from './ApiURL';

export const updateUserInfo = async (idUser, payload) => {
  try {
    // PUT 요청을 통해 사용자 정보를 업데이트합니다.
    const response = await axios.put(
      `${API_URL}` + '/user/' + `${idUser}`,
      payload
    );

    // 서버에서 반환된 사용자 정보를 반환합니다.
    return response.data;
  } catch (error) {
    console.error('Failed to update user info:', error);
    throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록 합니다.
  }
};

export const getUserInfo = async (idUser) => {
  try {
    const response = await axios.get(`${API_URL}/user/${idUser}`);

    return response.data;
  } catch (error) {
    console.error('Failed to update user info :', error);
    throw error;
  }
};
