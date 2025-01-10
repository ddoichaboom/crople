import {
  Alert,
  Image,
  Pressable,
  Text,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { GRAY, PRIMARY, WHITE } from '../colors';
import { useNavigation } from '@react-navigation/native';
import HeaderRight from '../components/HeaderRight';
import { API_URL } from '../api/ApiURL';
import { useUserState } from '../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileImageScreen = () => {
  const navigation = useNavigation();
  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useUserState();

  // 현재 이미지 주소
  const [imageUrl, setImageUrl] = useState('');
  const [localUri, setLocalUri] = useState('');
  const [filename, setFilename] = useState('');
  const [fileType, setFileType] = useState('');

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

  const pickImage = async () => {
    // 이미지 라이브러리에서 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      return; // 이미지 선택이 취소된 경우
    }

    // 이미지 URI 및 파일 정보 업데이트
    const selectedImage = result.assets[0];
    setImageUrl(selectedImage.uri);
    setLocalUri(selectedImage.uri);
    setFilename(selectedImage.fileName || `image_${Date.now()}`);

    const match = selectedImage.fileName
      ? /\.(\w+)$/.exec(selectedImage.fileName)
      : null;
    setFileType(match ? `image/${match[1]}` : `image`);

    setDisabled(false);
  };

  const onSubmit = async () => {
    if (!localUri) {
      alert('업로드할 이미지를 선택해 주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri:
        Platform.OS === 'android' ? localUri : localUri.replace('file://', ''),
      name: filename,
      type: fileType,
    });

    try {
      const response = await axios.post(
        `${API_URL}/profiles/${user.idUser}/image`,
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

      console.log('업로드 성공:', response.data);

      // 프로필 사진만 업데이트
      const updatedUser = {
        ...user,
        profile_photo: response.data.profile_photo, // 새 프로필 사진 URL로 업데이트
      };

      // AsyncStorage에 전체 사용자 정보 업데이트
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser); // 사용자 상태 업데이트

      Alert.alert('변경 성공', '프로필 사진이 업로드되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('이미지 업로드 실패');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight disabled={disabled} onPress={onSubmit} />,
    });
  }, [navigation, disabled]);

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>업로드된 이미지가 없습니다.</Text>
      )}
      <Pressable onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>이미지 선택하기</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: PRIMARY.DEFAULT,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: WHITE,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: GRAY.LIGHT,
    marginBottom: 20,
  },
  placeholderText: {
    paddingVertical: 20,
    fontSize: 14,
    color: GRAY.DARK,
  },
});

export default EditProfileImageScreen;
