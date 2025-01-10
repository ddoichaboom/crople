import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WriteProductsForm from '../components/WriteProductsForm';
import WriteTutoringForm from '../components/WriteTutoringForm';
import WriteAccommoForm from '../components/WriteAccommoForm';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import SafeInputView from '../components/SafeInputView';
import TextButton from '../components/TextButton';
import {
  NewProductBoard,
  NewTutoringBoard,
  NewAccommoBoard,
  UploadImagesToS3,
} from '../api/MakeBoard';
import { PRIMARY } from '../colors';

const ServiceUploadScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const Categories = {
    PRODUCTS: 'products',
    TUTORING: 'tutoring',
    ACCOMMODATION: 'accommodation',
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log(data);

      let response;
      // 카테고리에 따라 다른 API 호출
      if (data.categories === Categories.PRODUCTS) {
        response = await NewProductBoard(data); // 보드 생성
        console.log('Board Creation Response:', response);
        // S3에 이미지 업로드
        const uploadResponse = await UploadImagesToS3(
          data.photos,
          response.idBoard,
          data.categories,
          data.idUser
        );

        // S3 URL을 포함한 응답
        console.log('S3 Upload Response:', uploadResponse);
      } else if (data.categories === Categories.TUTORING) {
        response = await NewTutoringBoard(data);
        console.log('Board Creation Response:', response);

        const uploadResponse = await UploadImagesToS3(
          data.photos,
          response.idBoard,
          data.categories,
          data.idUser
        );

        console.log('S3 Upload Response:', uploadResponse);
      } else if (data.categories === Categories.ACCOMMODATION) {
        response = await NewAccommoBoard(data);
        console.log('Board Creation Response:', response);

        const uploadResponse = await UploadImagesToS3(
          data.photos,
          response.idBoard,
          data.categories,
          data.idUser
        );

        console.log('S3 Upload Response:', uploadResponse);
      }

      navigation.goBack(); // 성공적으로 처리된 후 화면을 이전으로 돌아감
    } catch (error) {
      console.error('Error submitting data: ', error);
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <SafeInputView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.Header}>카테고리 선택 :</Text>
          <View style={styles.checkBoxStyle}>
            <BouncyCheckbox
              size={20}
              isChecked={selectedCategory === Categories.PRODUCTS}
              onPress={() => {
                setSelectedCategory(Categories.PRODUCTS);
              }}
            />
            <TextButton
              title="물품 거래"
              onPress={() => {
                setSelectedCategory(Categories.PRODUCTS);
              }}
              styles={{ title: { fontSize: 18, paddingRight: 10 } }}
            />
            <BouncyCheckbox
              size={20}
              isChecked={selectedCategory === Categories.TUTORING}
              onPress={() => {
                setSelectedCategory(Categories.TUTORING);
              }}
            />
            <TextButton
              title="맞춤형 레슨"
              onPress={() => {
                setSelectedCategory(Categories.TUTORING);
              }}
              styles={{ title: { fontSize: 18, paddingRight: 10 } }}
            />
            <BouncyCheckbox
              size={20}
              isChecked={selectedCategory === Categories.ACCOMMODATION}
              onPress={() => {
                setSelectedCategory(Categories.ACCOMMODATION);
              }}
            />
            <TextButton
              title="숙박"
              onPress={() => {
                setSelectedCategory(Categories.ACCOMMODATION);
              }}
              styles={{ title: { fontSize: 18, paddingRight: 10 } }}
            />
          </View>

          {/* 선택된 카테고리에 따라 해당 Form 컴포넌트를 렌더링 */}
          {selectedCategory === Categories.PRODUCTS && (
            <WriteProductsForm onSubmit={onSubmit} />
          )}
          {selectedCategory === Categories.TUTORING && (
            <WriteTutoringForm onSubmit={onSubmit} />
          )}
          {selectedCategory === Categories.ACCOMMODATION && (
            <WriteAccommoForm onSubmit={onSubmit} />
          )}

          {/* 로딩 인디케이터 */}
          {isLoading && (
            <ActivityIndicator size="large" color={PRIMARY.DEFAULT} />
          )}
        </View>
      </ScrollView>
    </SafeInputView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Header: {
    paddingVertical: 5,
    marginLeft: 5,
    fontSize: 20,
  },
  checkBoxStyle: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingLeft: 5,
  },
});

export default ServiceUploadScreen;
