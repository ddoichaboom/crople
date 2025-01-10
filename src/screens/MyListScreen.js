import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserState } from '../contexts/UserContext';
import { Categories, Role } from '../../Category'; // STATUS import 추가
import { MainRoutes } from '../navigations/routes';
import { BLACK, BOARD_STATUS, GRAY, WHITE } from '../colors';
import TextButton from '../components/TextButton';
import { getMyList } from '../api/BoardList';
import { AWSS3URL } from '../api/ApiURL';

const MyListScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState(Categories.PRODUCTS);
  const [user] = useUserState();
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await getMyList(user.idUser);
      // console.log('Fetched data:', response); // 응답 확인

      const boards = response.consumerBoards || response.providerBoards || [];
      setData(boards);
    } catch (error) {
      console.error('Error fetching my list:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const InfoTitleByCategories = {
    PRODUCTS: {
      title: '제목',
      location: '위치',
      price: '가격',
      details: '정보',
    },
    TUTORING: {
      subject: '과목',
      location: '위치',
      price: '시간 당 가격',
      details: '정보',
    },
    ACCOMMODATION: {
      location: '위치',
      price: '가격',
      details: '정보',
      date: '날짜',
    },
  };

  const onSubmit = (idBoard, category, role, photoUrls) => {
    if (category === Categories.PRODUCTS) {
      if (role === Role.CONSUMER) {
        navigation.navigate(MainRoutes.PRODUCT_REQUEST, { idBoard, photoUrls });
      } else if (role === Role.PROVIDER) {
        navigation.navigate(MainRoutes.PRODUCT_DETAIL, { idBoard, photoUrls });
      }
    } else if (category === Categories.TUTORING) {
      navigation.navigate(MainRoutes.TUTORING_DETAIL, { idBoard, photoUrls });
    } else if (category === Categories.ACCOMMODATION) {
      navigation.navigate(MainRoutes.ACCOMMO_DETAIL, { idBoard, photoUrls });
    }
  };

  const renderItem = ({ item }) => {
    if (!item || !item.details) {
      return null;
    }

    const photoUrls = item.photoURLs || [];
    const representativePhoto = photoUrls[0]?.photo_url;
    const photoCount = photoUrls.length;

    const displayDetails =
      item.details.length > 10
        ? `${item.details.substring(0, 10)}...`
        : item.details;
    const displayPrice =
      new Intl.NumberFormat('ko-KR').format(item.price) + ' 원';

    const categoryTitles = InfoTitleByCategories[item.categories.toUpperCase()];

    // 상태에 따라 borderColor 설정
    const borderColor = BOARD_STATUS[item.status.toUpperCase()] || GRAY.LIGHT; // 대문자로 변환하여 STATUS에서 매칭

    return (
      <Pressable
        style={[styles.card, { borderColor }]} // borderColor 적용
        onPress={() =>
          onSubmit(item.idBoard, item.categories, item.role, photoUrls)
        }
      >
        <View style={styles.ContainerStyle}>
          <View style={styles.infoContainer}>
            <Text style={styles.textStyle}>
              {categoryTitles.title}: {item.title}
            </Text>
            <Text style={styles.textStyle}>
              {categoryTitles.location}: {item.location}
            </Text>
            <Text style={styles.textStyle}>
              {categoryTitles.price}: {displayPrice}
            </Text>
            <Text style={styles.textStyle}>
              {categoryTitles.details}: {displayDetails}
            </Text>
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
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.topContainer}>
        <Image
          source={{ uri: AWSS3URL.URI + '/assets/start_icon.png' }}
          style={styles.icon}
        />
        <Image
          source={{ uri: AWSS3URL.URI + '/assets/Crople_Text3.png' }}
          style={[styles.iconText, { resizeMode: 'center' }]}
        />
      </View>
      <View style={styles.categories}>
        <TextButton
          styles={{
            title: {
              color:
                selectedCategory === Categories.PRODUCTS
                  ? GRAY.DARK
                  : GRAY.DEFAULT,
              paddingHorizontal: 5,
            },
          }}
          title={'물품 거래'}
          onPress={() => setSelectedCategory(Categories.PRODUCTS)}
        />
        <TextButton
          styles={{
            button: styles.buttontitle,
            title: {
              color:
                selectedCategory === Categories.TUTORING
                  ? GRAY.DARK
                  : GRAY.DEFAULT,
              paddingHorizontal: 5,
            },
          }}
          title={'맞춤형 레슨'}
          onPress={() => setSelectedCategory(Categories.TUTORING)}
        />
        <TextButton
          styles={{
            button: styles.buttontitle,
            title: {
              color:
                selectedCategory === Categories.ACCOMMODATION
                  ? GRAY.DARK
                  : GRAY.DEFAULT,
              paddingHorizontal: 5,
            },
          }}
          title={'숙박'}
          onPress={() => setSelectedCategory(Categories.ACCOMMODATION)}
        />
      </View>

      <FlatList
        data={data.filter((item) => item.categories === selectedCategory)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        keyExtractor={(item) => item.idBoard.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: WHITE,
    paddingHorizontal: 20,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderBottomWidth: 0.3,
    borderBottomColor: GRAY.DEFAULT,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 30,
  },
  iconText: {
    width: 180,
    height: 60,
  },
  categories: {
    flexDirection: 'row',
  },
  card: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1, // borderWidth 설정
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },
  ContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  infoContainer: {
    flex: 1,
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

export default MyListScreen;
