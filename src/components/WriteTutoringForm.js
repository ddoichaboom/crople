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

const WriteTutoringForm = ({ onSubmit }) => {
  const [user] = useUserState();
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [price, setPrice] = useState('');
  const [details, setDetails] = useState('');
  const [photoData, setPhotoData] = useState([]); // 이미지 데이터 상태 변수
  const { width } = useWindowDimensions();
  const imageWidth = (width - 30) / 4; // 여유 공간을 고려한 이미지 너비 설정
  const [duration, setDuration] = useState();
  const SECOND = 1000;

  const sanitizeFileName = (fileName) => {
    return fileName
      .replace(/[()]/g, '_') // 괄호를 언더스코어로 대체
      .replace(/[^a-zA-Z0-9-_\.]/g, '_'); // 나머지 안전한 문자로 대체
  };

  // 기존 코드 중 이미지 선택 함수 수정
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

  // 폼 제출 처리
  const handleSubmit = () => {
    const now = new Date();
    const seoulTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); //현재 서울 기준 시간
    console.log(seoulTime);
    console.log(now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })); // 2024. 11. 28. 오후 9:35:29 와 같은 형식으로 바꾸어줌
    const expired_at = new Date(
      now.getTime() + 9 * 60 * 60 * 1000 + duration * SECOND
    );
    const data = {
      categories: 'tutoring',
      idUser: user.idUser,
      role: user.role,
      location,
      subject,
      price: price,
      details,
      duration,
      expired_at: expired_at,
      created_at: seoulTime,
      photos: photoData,
    };

    onSubmit(data); // 최종 데이터 제출
  };

  return (
    <ScrollView>
      <View style={styles.container}>
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

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>입찰 기간 선택 :</Text>
          <Picker
            selectedValue={duration}
            onValueChange={(itemValue) => setDuration(itemValue)}
            mode="dropdown"
          >
            <Picker.Item label="1일" value={86400} />
            <Picker.Item label="7일" value={604800} />
          </Picker>
        </View>

        <Input
          inputType={InputTypes.LOCATION}
          value={location}
          onChangeText={setLocation}
          title="위치"
          placeholder="위치를 입력하세요"
        />
        <Input
          inputType={InputTypes.SUBJECT}
          value={subject}
          onChangeText={setSubject}
          title="주제"
          placeholder="주제를 입력하세요"
        />
        <Input
          inputType={InputTypes.NUMBER}
          value={price}
          onChangeText={setPrice}
          title="시간당 가격"
          placeholder="가격을 입력하세요"
        />
        <Input
          inputType={InputTypes.DETAIL}
          value={details}
          onChangeText={setDetails}
          title="세부사항"
          placeholder="세부사항을 입력하세요"
        />

        <Pressable onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>완료</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

WriteTutoringForm.propTypes = {
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
  placeholderContainer: {
    alignItems: 'center',
  },
  infoText: {
    paddingVertical: 5,
    fontSize: 12,
    color: GRAY.DARK,
    textAlign: 'center',
  },
  submitButtonText: {
    fontSize: 20,
    marginTop: 20,
    color: PRIMARY.DEFAULT,
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

export default WriteTutoringForm;
