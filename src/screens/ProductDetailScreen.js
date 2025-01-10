import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  Platform,
  Button,
  useWindowDimensions,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import { BLACK, GRAY, STATUS, WHITE } from '../colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getUserInfo } from '../api/Auth';
import { useEffect, useState } from 'react';
import {
  boardStatusUpdate,
  getBoardDataByidBoard,
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from '../api/BoardList';
import BottomSheet from '../components/BottomSheet';
import { createBids, getLatestBidData, updateBidStatus } from '../api/BidData';
import { BoardSTATUS } from '../../Category';
import { useUserState } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const ProductDetailScreen = ({ route }) => {
  const { idBoard, photoUrls } = route.params; // route.params에서 데이터 추출
  const navigation = useNavigation();
  const [user] = useUserState();
  const [boardData, setBoardData] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [status, setStatus] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [bidData, setBidData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { height } = useWindowDimensions();

  const [modalVisible, setModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const pressBidButton = () => {
    setModalVisible(true);
  };

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

  const onSubmit = async (bid_price) => {
    const { idBoard, price, max_price, min_inc, status } = boardData;
    const idUser = user.idUser;
    const prev_bid_price = parseFloat(bidData.bid_price); // 이전 입찰 가격을 숫자로 변환
    const idBids = bidData.idBids;

    if (loading) {
      return;
    }
    setLoading(true);

    const bid_price_num = parseFloat(bid_price); // 입력된 가격을 숫자로 변환
    const minimum_price = prev_bid_price + parseFloat(min_inc); // 최소 입찰 가격 계산

    // 가격과 최소 가격 확인
    console.log(
      `입찰 가격: ${bid_price_num}, 최소 입찰 가격: ${minimum_price}`
    );

    try {
      // ONBOARD 상태일 때
      if (status === BoardSTATUS.ONBOARD) {
        if (bid_price_num >= parseFloat(price)) {
          await createBids(idBoard, idUser, bid_price_num);
          Alert.alert('입찰 성공', '입찰이 성공적으로 등록되었습니다.');
        } else {
          Alert.alert('입찰 실패', '입찰 가격이 시작 가격보다 작습니다.');
        }
      }
      // INPROCESS 상태일 때
      else if (status === BoardSTATUS.INPROCESS) {
        // 입찰가 비교 로직
        if (bid_price_num >= parseFloat(max_price)) {
          // 최고가로 입찰
          await updateBidStatus(idBoard, idBids); // 기존 입찰 상태 업데이트
          await createBids(idBoard, idUser, max_price);
          await boardStatusUpdate(idBoard, status);
          Alert.alert('입찰 성공', '최고가로 입찰이 등록되었습니다.');
        } else if (bid_price_num >= minimum_price) {
          // 최소 입찰 단위를 만족하는 경우
          await updateBidStatus(idBoard, idBids); // 기존 입찰 상태 업데이트
          await createBids(idBoard, idUser, bid_price_num);
          Alert.alert('입찰 성공', '입찰이 성공적으로 등록되었습니다.');
        } else {
          Alert.alert(
            '입찰 실패',
            '현재 최소 입찰 단위는 ' + formatPrice(min_inc) + ' 입니다.'
          );
        }
      }
    } catch (error) {
      console.error('Error creating bids data: ', error);
      Alert.alert(
        '입찰 생성 중 오류',
        '입찰 생성 중 오류가 발생했습니다. 다시 시도해 주세요.'
      );
    } finally {
      setLoading(false);
    }
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

  const fetchBidData = async (idBoard) => {
    if (status === BoardSTATUS.EXAUCTION) {
      return;
    }
    try {
      const response = await getLatestBidData(idBoard);
      if (Array.isArray(response) && response.length > 0) {
        setBidData(response[0]); // 첫 번째 입찰 데이터만 사용
      } else {
        setBidData(null); // 데이터가 없을 경우
      }
    } catch (error) {
      console.error('Error fetching Bids Data :', error);
      Alert.alert(
        '입찰 데이터 가져오기 실패',
        '입찰 데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.'
      );
    }
  };

  //수요자만 구매 버튼 누르기 가능 + 구매 기능 로직 적용 필요
  const handlePress = () => {
    console.log(bidData);
  };

  // 위 아래 두 함수 는 추후 결제 API 연동 시 사용될 예정
  const pressPurchaseButton = async () => {
    try {
      setLoading(true);
      Alert.alert(
        '구매',
        `해당 가격 ${formatPrice(
          boardData.discount_price
        )}에 구매하시겠습니까?`,
        [
          {
            text: '수락',
            onPress: async () => {
              navigation.navigate('Payment', {
                boardData: boardData,
                user: user,
              });
            },
            style: 'default',
          },
          { text: '취소', onPress: () => {}, style: 'cancel' },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        }
      );

      setIsRefreshing(true);
      await fetchBoardData();
      setIsRefreshing(false);
    } catch (error) {
      console.error('보드 상태 업데이트 중 오류 발생:', error);
      Alert.alert(
        '구매 실패',
        '보드 상태를 업데이트하는 동안 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
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
    if (boardData.idBoard) {
      // 상태가 COMPLETED이고 bids 데이터가 없을 경우 fetchBidData를 호출하지 않음
      if (boardData.status === BoardSTATUS.COMPLETED && !bidData) {
        return; // 데이터가 없으므로 fetchBidData 호출하지 않음
      }
      fetchBidData(boardData.idBoard);
    }
  }, [boardData]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={[styles.container, { paddingBottom: height / 5 }]}>
        <View style={styles.topContainer}>
          <Text style={styles.headerTitle}>서비스 정보</Text>
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
              <View style={{ marginTop: Platform.OS === 'android' ? 5 : 0 }}>
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
                서비스 등록 시간 : {changeDateFormat(boardData.created_at)}
              </Text>
              <Text style={[styles.timeText, { color: STATUS.COMPLETED }]}>
                입찰 만료 시간 : {changeDateFormat(boardData.expired_at)}
              </Text>
            </View>
          </View>
        </View>

        <Swiper style={styles.wrapper} loop={false}>
          {photoUrls.map((photo, index) => (
            <View key={index} style={styles.slide}>
              <Image source={{ uri: photo.photo_url }} style={styles.image} />
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
            <Text style={styles.defaultTextStyle}>가격 :</Text>
            <Text style={styles.defaultTextStyle}>즉시 구매가 :</Text>
            <Text style={styles.defaultTextStyle}>정보 :</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoStyle}>{boardData.title}</Text>
            <Text style={styles.infoStyle}>{boardData.location}</Text>
            <Text style={styles.infoStyle}>{formatPrice(boardData.price)}</Text>
            <Text style={styles.infoStyle}>
              {formatPrice(boardData.max_price)}
            </Text>
            <Text style={styles.detailsStyle}>{boardData.details}</Text>
          </View>
        </View>

        {status === BoardSTATUS.EXAUCTION ||
        (status === BoardSTATUS.COMPLETED && !bidData) ? (
          <Pressable
            onPress={handlePress}
            disabled={status === BoardSTATUS.COMPLETED ? false : true}
          >
            <View
              style={[
                styles.discountContainer,
                {
                  borderColor:
                    status === BoardSTATUS.COMPLETED
                      ? STATUS.COMPLETED
                      : STATUS.EXAUCTION,
                },
              ]}
            >
              <Text style={styles.headerTitle}>현재 할인 가격</Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Text style={styles.bidTitle}>할인 된 가격 :</Text>
                <Text style={styles.bidPrice}>
                  {formatPrice(boardData.discount_price)}
                </Text>
              </View>
            </View>
          </Pressable>
        ) : null}

        {user.idUser !== boardData.idUser &&
          status === BoardSTATUS.EXAUCTION && (
            <Button title={'구매 하기'} onPress={pressPurchaseButton} />
          )}

        {status === BoardSTATUS.INPROCESS ||
        (status === BoardSTATUS.COMPLETED && bidData) ? (
          <Pressable
            onPress={handlePress}
            disabled={
              user.idUser === bidData.idUser && status === BoardSTATUS.COMPLETED
                ? false
                : true
            }
          >
            <View
              style={[
                styles.bidContainer,
                {
                  borderColor:
                    status === BoardSTATUS.COMPLETED
                      ? STATUS.COMPLETED
                      : STATUS.INPROCESS,
                },
              ]}
            >
              <Text style={styles.headerTitle}>현재 최고 입찰 내역</Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Text style={styles.bidTitle}>입찰 가격 :</Text>
                <Text style={styles.bidPrice}>
                  {formatPrice(bidData.bid_price)}
                </Text>
              </View>
            </View>
          </Pressable>
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text
              style={{
                marginTop: 20,
                textAlign: 'center',
              }}
            >
              입찰 참여자가 없습니다.
            </Text>
          </View>
        )}

        {user.idUser !== boardData.idUser &&
          (status === BoardSTATUS.INPROCESS ||
            status === BoardSTATUS.ONBOARD) && (
            <Button title={'입찰 참여'} onPress={pressBidButton} />
          )}

        {loading && <ActivityIndicator size="large" color={GRAY.DARK} />}
        <BottomSheet
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          disabled={disabled || loading}
          onSubmit={onSubmit}
          Data={boardData}
        />
      </View>
    </ScrollView>
  );
};

ProductDetailScreen.propTypes = {
  boardData: PropTypes.object,
  photoUrls: PropTypes.array,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: WHITE,
    paddingHorizontal: 20,
  },
  bidContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderColor: GRAY.LIGHT,
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 10,
    padding: 20,
  },
  discountContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderColor: GRAY.LIGHT,
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 10,
    padding: 20,
  },
  bidTitle: {
    fontSize: 18,
    alignItems: 'center',
  },
  bidPrice: {
    fontSize: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
  profileText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: GRAY.DARK,
    marginVertical: 10,
  },
  iconContainer: {
    justifyContent: 'flex-start', // 아이콘 수직 정렬
    marginRight: 10,
    marginTop: Platform.OS == 'android' ? 18 : 10,
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
  titleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: 5,
    marginTop: 10,
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
    marginBottom: 3,
  },
  detailsStyle: {
    fontSize: 16,
    flexWrap: 'wrap',
  },
  headerTitle: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: '700',
  },
  defaultTextStyle: {
    fontSize: 18,
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
});

export default ProductDetailScreen;
