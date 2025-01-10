import {
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
  Platform,
  Button,
  useWindowDimensions,
  Pressable,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useUserState } from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import {
  boardStatusUpdate,
  getBoardDataByidBoard,
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from '../api/BoardList';
import { getUserInfo } from '../api/Auth';
import Swiper from 'react-native-swiper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BoardSTATUS, Categories } from '../../Category';
import { BLACK, GRAY, STATUS, WHITE } from '../colors';
import SuggestBottomSheet from '../components/SuggestBottomSheet';
import { createSuggest, getSuggestByidBoard } from '../api/Suggest';

const ProductRequestScreen = ({ route }) => {
  const { idBoard, photoUrls } = route.params;
  const [user] = useUserState();
  const [boardData, setBoardData] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [status, setStatus] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { height } = useWindowDimensions();

  const [suggestData, setSuggestData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const changeDateFormat = (date) => {
    const newFormatDate = new Date(date);
    const formattedCreatedDate = newFormatDate.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });

    return formattedCreatedDate;
  };

  const formatPrice = (price) => {
    const formattedPrice =
      new Intl.NumberFormat('ko-KR').format(price || 0) + ' 원';
    return formattedPrice;
  };

  const IconName = {
    TITLE: 'tag',
    LOCATION: 'map-marker',
    PRICE: 'currency-krw',
    DETAILS: 'information',
  };

  const fetchBoardData = async () => {
    try {
      const [response] = await getBoardDataByidBoard(idBoard);
      setBoardData(response); // boardData 상태 변수에 저장
      setStatus(response.status); // 상태 업데이트
    } catch (error) {
      console.error('Error fetching board data:', error);
      Alert.alert(
        '데이터 가져오기 실패',
        '보드 데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.'
      );
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBoardData();
    setIsRefreshing(false);
  };

  const fetchUserInfo = async (idUser) => {
    try {
      const response = await getUserInfo(idUser);
      setUserInfo(response);
    } catch (error) {
      console.error('Error fetching user Data: ', error);
    }
  };

  const fetchSuggestData = async (idBoard, status) => {
    try {
      const response = await getSuggestByidBoard(idBoard, status); // status를 전달
      if (response.length === 0) {
        console.log('제안된 서비스가 없습니다.');
      }
      setSuggestData(response);
      console.log('Suggested Data checking at Client:', response);
    } catch (error) {
      console.error('Error fetching suggest data:', error);
      Alert.alert(
        '데이터 가져오기 실패',
        '제안 데이터를 가져오는 중 오류가 발생했습니다.'
      );
    }
  };

  useEffect(() => {
    fetchBoardData();
    setStatus(boardData.status);
  }, []);

  useEffect(() => {
    if (boardData.idUser) {
      fetchUserInfo(boardData.idUser);
    }
  }, [boardData]);

  useEffect(() => {
    if (
      boardData.status === BoardSTATUS.INPROCESS ||
      boardData.status === BoardSTATUS.COMPLETED
    ) {
      fetchSuggestData(idBoard, boardData.status);
    }
  }, [boardData]);

  const pressSuggestButton = () => {
    setModalVisible(true);
  };

  const handlePress = async ({ item }, boardData) => {
    if (boardData.idUser === user.idUser) {
      Alert.alert(
        '제안 수락',
        '제안을 수락하시겠습니까?',
        [
          {
            text: '수락',
            onPress: () => handleAccept(item, boardData),
            style: 'default',
          },
          { text: '취소', onPress: () => {}, style: 'cancel' },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        }
      );
    }
  };

  const handleAccept = async ({ item }, boardData) => {
    try {
      setLoading(true);
      const response = await boardStatusUpdate({
        idBoard: boardData.idBoard,
        status: BoardSTATUS.INPROCESS,
      });
      console.log('Board Status Update Response:', response);
    } catch (error) {
      console.error('Error updating board status:', error);
      Alert.alert(
        '수락 실패',
        '제안 수락 중 오류가 발생했습니다. 다시 시도해 주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const now = new Date();
    const seoulTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const suggest = {
      idBoard: idBoard,
      idUser: user.idUser,
      categories: Categories.PRODUCTS,
      role: user.role,
      created_at: seoulTime,
      ...data,
    };
    try {
      setLoading(true);
      const response = await createSuggest(suggest);
      console.log('Suggest Creation Response:', response);
    } catch (error) {
      console.error('Error creating suggest:', error);
      Alert.alert(
        '제안 실패',
        '서비스 제안 중 오류가 발생했습니다. 다시 시도해 주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    if (!item) {
      return null;
    }
    const displayDetails =
      item.details.length > 10
        ? `${item.details.substring(0, 10)}...`
        : item.details;

    const displayPrice =
      new Intl.NumberFormat('ko-KR').format(item.price) + ' 원';

    return (
      <Pressable
        onPress={handlePress}
        disabled={status === BoardSTATUS.INPROCESS ? false : true}
      >
        <View
          style={[
            styles.card,
            {
              borderColor:
                status === BoardSTATUS.COMPLETED
                  ? STATUS.COMPLETED
                  : STATUS.EXAUCTION,
            },
          ]}
        >
          <View style={styles.informContainer}>
            <Text style={styles.textStyle}>제목: {item.title}</Text>
            <Text style={styles.textStyle}>위치: {item.location}</Text>
            <Text style={styles.textStyle}>가격: {displayPrice}</Text>
            <Text style={styles.textStyle}>정보: {displayDetails}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={suggestData}
      renderItem={renderItem}
      ListHeaderComponent={
        <>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Text style={styles.headerTitle}>서비스 요청 정보</Text>
            </View>
            <View>
              <View style={styles.UserProfile}>
                <View style={styles.rowView}>
                  <Image
                    source={{ uri: userInfo.profile_photo }}
                    style={styles.profileImage}
                  />
                  <Text style={styles.profileText}>{userInfo.nickname}</Text>
                </View>
                <View style={styles.rowView}>
                  <View
                    style={{ marginTop: Platform.OS === 'android' ? 5 : 0 }}
                  >
                    <MaterialCommunityIcons
                      name={getStatusIcon(status)}
                      size={18}
                      color={getStatusColor(status)}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: getStatusColor(status),
                      marginLeft: 5,
                    }}
                  >
                    {getStatusText(status, boardData.role)}
                  </Text>
                </View>
              </View>

              <View style={styles.timeView}>
                <View style={styles.timelog}>
                  <Text style={styles.timeText}>
                    서비스 요청 시간 : {changeDateFormat(boardData.created_at)}
                  </Text>
                  <Text style={[styles.timeText, { color: STATUS.COMPLETED }]}>
                    요청 만료 시간 : {changeDateFormat(boardData.expired_at)}
                  </Text>
                </View>
              </View>
            </View>

            <Swiper style={styles.wrapper} loop={false}>
              {photoUrls.map((photo, index) => (
                <View key={index} style={styles.slide}>
                  <Image
                    source={{ uri: photo.photo_url }}
                    style={styles.image}
                  />
                </View>
              ))}
            </Swiper>

            <View style={styles.rowContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={IconName.TITLE}
                  size={22}
                  color={BLACK}
                />
                <MaterialCommunityIcons
                  name={IconName.LOCATION}
                  size={22}
                  color={BLACK}
                />
                <MaterialCommunityIcons
                  name={IconName.PRICE}
                  size={22}
                  color={BLACK}
                />
                <MaterialCommunityIcons
                  name={IconName.DETAILS}
                  size={22}
                  color={BLACK}
                />
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.defaultTextStyle}>제목 :</Text>
                <Text style={styles.defaultTextStyle}>위치 :</Text>
                <Text style={styles.defaultTextStyle}>희망 가격 :</Text>
                <Text style={styles.defaultTextStyle}>정보 :</Text>
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.infoStyle}>{boardData.title}</Text>
                <Text style={styles.infoStyle}>{boardData.location}</Text>
                <Text style={styles.infoStyle}>
                  {formatPrice(boardData.price)}
                </Text>
                <Text style={styles.detailsStyle}>{boardData.details}</Text>
              </View>
            </View>

            {user.idUser !== boardData.idUser &&
            status !== BoardSTATUS.COMPLETED ? (
              <Button title={'조건 제시'} onPress={pressSuggestButton} />
            ) : null}

            {loading && <ActivityIndicator size="large" color={GRAY.DARK} />}
            <SuggestBottomSheet
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              disabled={disabled || loading}
              onSubmit={onSubmit}
              Data={boardData}
            />
          </View>
        </>
      }
      ListEmptyComponent={
        <Text
          style={{
            marginTop: 20,
            textAlign: 'center',
            paddingBottom: 20,
          }}
        >
          제안된 서비스가 없습니다.
        </Text>
      } // 데이터가 없을 때 보여줄 컴포넌트
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      keyExtractor={(item) => item.idSuggest.toString()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: GRAY.DARK,
    marginVertical: 10,
  },
  card: {
    width: '90%', // 전체 너비의 90%로 설정
    alignSelf: 'center', // 중앙 정렬
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: GRAY.LIGHT,
    borderWidth: 2,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },

  headerTitle: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: '700',
  },
  UserProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: GRAY.DARK,
    marginBottom: 10,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  profileText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  timeView: {
    flexDirection: 'row-reverse',
    borderBottomWidth: 0.3,
    borderBottomColor: GRAY.DARK,
    marginBottom: 5,
  },
  timelog: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 12,
    color: GRAY.DARK,
  },
  wrapper: {
    height: 400, // Swiper 높이 조정 가능
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderBottomColor: GRAY.DARK,
    borderTopColor: GRAY.DARK,
    marginVertical: 10,
    alignItems: 'flex-start', // 수직 정렬
  },
  iconContainer: {
    justifyContent: 'flex-start', // 아이콘 수직 정렬
    marginRight: 10,
    marginTop: Platform.OS == 'android' ? 18 : 10,
  },
  titleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: 5,
    marginTop: 10,
  },
  defaultTextStyle: {
    fontSize: 18,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 10,
  },
  infoStyle: {
    fontSize: 16,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  detailsStyle: {
    fontSize: 16,
    flexWrap: 'wrap',
  },
  informContainer: {
    flex: 1, // 남은 공간을 차지하게 함
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 14,
    color: BLACK,
  },
});

export default ProductRequestScreen;
