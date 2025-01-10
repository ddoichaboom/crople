import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import Input, { InputTypes } from '../components/Input';
import { useUserState } from '../contexts/UserContext';
import { GRAY, PRIMARY, WHITE } from '../colors';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Role } from '../../Category';

const WriteProductsForm = ({ onSubmit }) => {
  const [user] = useUserState();
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [details, setDetails] = useState('');
  const [photoData, setPhotoData] = useState([]);
  const { width, height } = useWindowDimensions();
  const imageWidth = (width - 30) / 4;
  const [duration, setDuration] = useState();
  const [maxprice, setMaxPrice] = useState();
  const [minprice, setMinPrice] = useState();
  const SECOND = 1000;

  const sanitizeFileName = (fileName) => {
    return fileName
      .replace(/[()]/g, '_') // 괄호를 언더스코어로 대체
      .replace(/[^a-zA-Z0-9-_\.]/g, '_'); // 나머지 안전한 문자로 대체
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => {
        const match = asset.fileName ? /\.(\w+)$/.exec(asset.fileName) : null;
        const fileType = match ? `image/${match[1]}` : 'image';

        return {
          uri: asset.uri,
          name: sanitizeFileName(
            asset.fileName ||
              `image_${new Date(now.getTime() + 9 * 60 * 60 * 1000)}`
          ), // 파일 이름 정리 추가
          type: fileType,
        };
      });

      setPhotoData(selectedImages.slice(0, 4));
    }
  };

  const handleSubmit = () => {
    const now = new Date();
    const seoulTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); //현재 서울 기준 시간
    const expired_at = new Date(
      now.getTime() + 9 * 60 * 60 * 1000 + duration * SECOND
    );
    const data = {
      categories: 'products',
      idUser: user.idUser,
      role: user.role,
      location,
      duration,
      title,
      price,
      max_price: maxprice,
      details,
      expired_at: expired_at,
      created_at: seoulTime,
      photos: photoData,
    };
    onSubmit(data);
  };

  return (
    <ScrollView>
      <View style={[styles.container, { paddingBottom: height / 10 }]}>
        <Pressable onPress={pickImages} style={styles.button}>
          <Text style={styles.buttonText}>이미지 선택하기</Text>
        </Pressable>

        {photoData.length > 0 ? (
          <View style={styles.imageContainer}>
            {photoData.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo.uri }}
                style={[
                  styles.image,
                  { width: imageWidth, height: imageWidth },
                ]}
              />
            ))}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              업로드된 이미지가 없습니다.
            </Text>
            <Text style={styles.infoText}>최대 4장까지 선택 가능합니다.</Text>
          </View>
        )}

        {/* 경매 기간 선택 박스 추가 */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>
            {user.role === Role.PROVIDER ? '입찰 기간 선택' : '요청 기간 선택'}:
          </Text>
          <Picker
            selectedValue={duration}
            onValueChange={(itemValue) => setDuration(itemValue)}
            mode="dropdown"
          >
            <Picker.Item label="1일" value={86400} />
            <Picker.Item label="7일" value={604800} />
          </Picker>
        </View>

        {/* 위치 입력 필드 */}
        <Input
          inputType={InputTypes.LOCATION}
          value={location}
          onChangeText={setLocation}
          title="위치"
          placeholder="위치를 입력하세요"
        />

        {/* 제목 입력 필드 */}
        <Input
          inputType={InputTypes.TITLE}
          value={title}
          onChangeText={setTitle}
          title="제목"
          placeholder="물품 이름을 입력하세요"
        />

        {/* 가격 입력 필드 */}
        <Input
          inputType={InputTypes.NUMBER}
          value={price}
          onChangeText={setPrice}
          title={user.role === Role.PROVIDER ? '최소 입찰가' : '희망 가격'}
          placeholder="금액을 입력하세요"
        />

        {user.role === Role.PROVIDER && (
          <Input
            inputType={InputTypes.NUMBER}
            value={maxprice}
            onChangeText={setMaxPrice}
            title="즉시 판매가"
            placeholder="즉시 판매가를 입력하세요"
          />
        )}

        {/* 상태 입력 필드 */}
        <Input
          inputType={InputTypes.DETAIL}
          value={details}
          onChangeText={setDetails}
          title="정보"
          placeholder="물품 정보를 입력하세요"
        />

        <Pressable onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>완료</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

WriteProductsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: PRIMARY.DEFAULT,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: WHITE,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  image: {
    margin: 1,
  },
  placeholderText: {
    paddingVertical: 20,
    fontSize: 14,
    color: GRAY.DARK,
    textAlign: 'center',
  },
  submitButtonText: {
    fontSize: 20,
    marginTop: 20,
    color: PRIMARY.DEFAULT,
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  infoText: {
    paddingVertical: 5,
    fontSize: 12,
    color: GRAY.DARK,
    textAlign: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  pickerContainer: {
    backgroundColor: WHITE, // 흰색 배경
    padding: 10,
    borderRadius: 5,
    width: '100%', // 전체 너비 사용
    marginBottom: 10, // Input 컴포넌트와 여백
    elevation: 2, // 안드로이드에서 그림자 효과
    shadowColor: '#000', // iOS에서 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
    shadowOpacity: 0.2, // 그림자 불투명도
    shadowRadius: 4, // 그림자 반경
    position: 'relative', // iOS에서 Picker 위치 문제 해결
  },
});

export default WriteProductsForm;
