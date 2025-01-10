import axios from 'axios';
import { API_URL } from './ApiURL';
import { Platform } from 'react-native';

// products 보드 생성 API
export const NewProductBoard = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/boards/products/${data.idUser}`,
      data
    );
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error('Error creating product board:', error);
    throw error; // 에러 발생 시 호출자에게 전달
  }
};

// 맞춤형 레슨 보드 생성 API
export const NewTutoringBoard = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/boards/tutoring/${data.idUser}`,
      data
    );
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error('Error creating tutoring board:', error);
    throw error; // 에러 발생 시 호출자에게 전달
  }
};

// 숙박 보드 생성 API
export const NewAccommoBoard = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/boards/accommodation/${data.idUser}`,
      data
    );
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error('Error creating accommodation board:', error);
    throw error; // 에러 발생 시 호출자에게 전달
  }
};

export const UploadImagesToS3 = async (photos, idBoard, category, idUser) => {
  const formData = new FormData();

  photos.forEach((photo) => {
    formData.append('photos', {
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
      type: photo.type,
      name: photo.name,
    });
  });

  try {
    const response = await axios.post(
      `${API_URL}/boards/${idBoard}/${category}/${idUser}/photos`, // S3 업로드 엔드포인트 확인
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => {
          return data; // FormData를 그대로 반환
        },
      }
    );

    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error(
      'Error uploading images to S3:',
      error.response ? error.response.data : error.message
    );
    throw error; // 에러 발생 시 호출자에게 전달
  }
};
