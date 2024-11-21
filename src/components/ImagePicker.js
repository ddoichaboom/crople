import { Image, Pressable, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  // 현재 이미지 주소
  const [imageUrl, setImageUrl] = useState('');

  // 권한 요청을 위한 hooks
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  // 컴포넌트가 마운트될 때 권한 요청
  useEffect(() => {
    const requestPermissions = async () => {
      if (!status?.granted) {
        const permission = await requestPermission();
        if (!permission.granted) {
          alert('사진 접근 권한이 필요합니다.');
        }
      }
    };
    requestPermissions();
  }, [status, requestPermission]);

  const uploadImage = async () => {
    // 카메라를 통해 이미지 선택
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      aspect: [1, 1],
    });

    if (result.canceled) {
      return; // 이미지 업로드 취소한 경우
    }

    // 이미지 URI 업데이트
    console.log(result);
    setImageUrl(result.uri);

    const localUri = result.uri;
    const filename = localUri.split('/').pop();

    // 정규식 수정: 안전하게 filename을 검사
    const match = filename ? /\.(\w+)$/.exec(filename) : null;
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('image', { uri: localUri, name: filename, type });

    // 서버에 이미지 업로드
    try {
      const response = await axios({
        method: 'post',
        url: '{API주소}', // 여기에 실제 API 주소를 입력하세요.
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });
      console.log('업로드 성공:', response.data);
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('이미지 업로드 실패');
    }
  };

  return (
    <Pressable onPress={uploadImage} style={styles.container}>
      <Text style={styles.buttonText}>이미지 업로드하기</Text>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>업로드된 이미지가 없습니다.</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },
});

export default ImageUploader;
