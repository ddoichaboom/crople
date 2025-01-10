import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Categories } from '../../Category';
import { getBoardData, getPhotoURLByidBoard } from '../api/BoardList';
import { BLACK, GRAY, WHITE } from '../colors';
import { useUserState } from '../contexts/UserContext';

const AccommoList = ({ onSubmit }) => {
  const [user] = useUserState();
  const [boardData, setBoardData] = useState([]);
  const [photoData, setPhotoData] = useState({}); // idBoard에 따른 photo_url 저장
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchBoardData();
  }, [user.role]);

  const fetchBoardData = async () => {
    const category = Categories.ACCOMMODATION;

    try {
      const response = await getBoardData(category, user.role);
      setBoardData(response);

      // 각 idBoard에 대한 photo_url 가져오기
      const photos = {};
      for (const item of response) {
        const response = await getPhotoURLByidBoard(item.idBoard);
        photos[item.idBoard] = response;
      }
      setPhotoData(photos);
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBoardData();
    setIsRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const renderItem = ({ item }) => {
    if (!item || !item.details) {
      return null;
    }

    const photoUrls = photoData[item.idBoard] || []; // 해당 idBoard의 사진
    const representativePhoto = photoUrls[0]?.photo_url; // 대표 사진 (첫 번째 사진)
    const photoCount = photoUrls.length; // 사진 수

    // 상태 정보를 10글자만 표시하고 "..." 추가
    const displayDetails =
      item.details.length > 10
        ? `${item.details.substring(0, 10)}...`
        : item.details;

    // 가격 포맷팅
    const displayPrice =
      new Intl.NumberFormat('ko-KR').format(item.price) + ' 원';

    const formattedStartDate = formatDate(item.start_date);
    const formattedEndDate = formatDate(item.end_date);

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          onSubmit(item.idBoard, item.categories, item.role, photoUrls)
        }
      >
        <View style={styles.ContainerStyle}>
          <View style={styles.infoContainer}>
            <Text style={styles.textStyle}>위치: {item.location}</Text>
            <Text style={styles.textStyle}>
              날짜: {formattedStartDate} ~ {formattedEndDate}
            </Text>
            <Text style={styles.textStyle}>가격: {displayPrice}</Text>
            <Text style={styles.textStyle}>정보: {displayDetails}</Text>
          </View>

          <View style={styles.imageContainer}>
            {representativePhoto && (
              <Image
                source={{ uri: representativePhoto }}
                style={styles.representativeImage}
              />
            )}
            {photoCount > 1 && (
              <View style={styles.photoCountContainer}>
                <Text style={styles.photoCountText}>{photoCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={boardData}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      keyExtractor={(item) => item.idBoard.toString()}
    />
  );
};

AccommoList.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: GRAY.LIGHT,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },
  ContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center', // 수직 중앙 정렬
    width: '100%', // 전체 너비 사용
  },
  infoContainer: {
    flex: 1, // 남은 공간을 차지하게 함
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginLeft: 10,
  },
  representativeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  photoCountContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: BLACK,
    borderRadius: 5,
    padding: 5,
  },
  photoCountText: {
    color: WHITE,
  },
  textStyle: {
    fontSize: 14,
    color: GRAY.DARK,
  },
});

export default AccommoList;
