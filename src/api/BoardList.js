import axios from 'axios';
import { API_URL } from './ApiURL';
import { GRAY, STATUS } from '../colors';
import { BoardSTATUS, Role } from '../../Category';

export const getStatusText = (status, role) => {
  if (role === Role.PROVIDER) {
    switch (status) {
      case BoardSTATUS.ONBOARD:
        return '입찰 대기 중';
      case BoardSTATUS.EXAUCTION:
        return '가격 할인 적용 중';
      case BoardSTATUS.INPROCESS:
        return '입찰 진행 중';
      case BoardSTATUS.COMPLETED:
        return '거래 완료';
      default:
        return '상태 정보 없음';
    }
  } else if (role === Role.CONSUMER) {
    switch (status) {
      case BoardSTATUS.ONBOARD:
        return '제안 대기 중';
      case BoardSTATUS.INPROCESS:
        return '제안 검토 중';
      case BoardSTATUS.COMPLETED:
        return '거래 완료';
      default:
        return '상태 정보 없음';
    }
  }
};

export const getStatusIcon = (status) => {
  if (status === BoardSTATUS.INPROCESS) {
    return 'dots-circle';
  } else if (status === BoardSTATUS.EXAUCTION) {
    return 'dots-circle';
  } else {
    return 'circle';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case BoardSTATUS.ONBOARD:
      return STATUS.ONBOARD;
    case BoardSTATUS.INPROCESS:
      return STATUS.INPROCESS;
    case BoardSTATUS.COMPLETED:
      return STATUS.COMPLETED;
    case BoardSTATUS.EXAUCTION:
      return STATUS.EXAUCTION;
    default:
      return GRAY.LIGHT;
  }
};

// 카테고리에 따라 게시물 데이터를 가져오는 함수
export const getBoardData = async (category, role) => {
  try {
    const response = await axios.get(
      `${API_URL}/BoardData/${category}/${role}`
    );
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error('Error fetching board data:', error);
    throw error; // 에러를 호출한 곳으로 전달
  }
};

export const getBoardDataByidBoard = async (idBoard) => {
  try {
    const response = await axios.get(`${API_URL}/BoardData/${idBoard}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Board Data: ', error);
    throw error;
  }
};

//idBoard 값에 따라 BoardPhotos의 photo_url을 가져오는 함수
export const getPhotoURLByidBoard = async (idBoard) => {
  try {
    const response = await axios.get(`${API_URL}/BoardPhotos/${idBoard}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching BoardPhotos data:', error);
    throw error;
  }
};

export const boardStatusUpdate = async (idBoard, status) => {
  try {
    const response = await axios.put(`${API_URL}/BoardData/update/${idBoard}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating board status:', error);
    throw error;
  }
};

export const getMyList = async (idUser) => {
  try {
    const response = await axios.get(`${API_URL}/myList/${idUser}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my list:', error);
    throw error;
  }
};
