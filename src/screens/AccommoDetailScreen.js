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
} from 'react-native';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import { BLACK, GRAY, STATUS, WHITE } from '../colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getUserInfo } from '../api/Auth';
import { useEffect, useState } from 'react';
import {
  getBoardDataByidBoard,
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from '../api/BoardList';

const AccommoDetailScreen = ({ route }) => {
  const { idBoard, photoUrls } = route.params; // route.params에서 데이터 추출
  const [boardData, setBoardData] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [status, setStatus] = useState(boardData.status);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { height } = useWindowDimensions();
  const pressButton = () => {
    setModalVisible(true);
  };

  const changeDateFormat = (date) => {
    const newFormatDate = new Date(date);
    const formattedCreatedDate = newFormatDate.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });

    return formattedCreatedDate;
  };

  const AccommoPrice =
    new Intl.NumberFormat('ko-KR').format(boardData.price) + ' 원';

  const IconName = {
    LOCATION: 'map-marker',
    PRICE: 'currency-krw',
    DETAILS: 'information',
    CALENDAR: 'calendar',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const fetchBoardData = async () => {
    try {
      const [response] = await getBoardDataByidBoard(idBoard);
      setBoardData(response); // boardData 상태 변수에 저장
      setStatus(response.status); // 상태 업데이트
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBoardData();
    setIsRefreshing(false);
  };

  const formattedStartDate = formatDate(boardData.start_date);
  const formattedEndDate = formatDate(boardData.end_date);

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
  }, []);

  useEffect(() => {
    if (boardData.idUser) {
      fetchUserInfo(boardData.idUser);
    }
  }, [boardData]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={[styles.container, { paddingBottom: height / 10 }]}>
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
                {getStatusText(status)}
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
              name={IconName.CALENDAR}
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
            <Text style={styles.defaultTextStyle}>위치 :</Text>
            <Text style={styles.defaultTextStyle}>1박 당 가격 :</Text>
            <Text style={styles.defaultTextStyle}>날짜 :</Text>
            <Text style={styles.defaultTextStyle}>상태 :</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoStyle}>{boardData.location}</Text>
            <Text style={styles.infoStyle}>{AccommoPrice}</Text>
            <Text style={styles.infoStyle}>
              {formattedStartDate} ~ {formattedEndDate}
            </Text>
            <Text style={styles.detailsStyle}>{boardData.details}</Text>
          </View>
        </View>

        <View></View>
      </View>
    </ScrollView>
  );
};

AccommoDetailScreen.propTypes = {
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 10,
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
    flexWrap: 'wrap',
    maxWidth: '95%',
    marginBottom: 4,
  },
  detailsStyle: {
    fontSize: 16,
    flexWrap: 'wrap',
    maxWidth: '95%',
  },
  headerTitle: {
    fontSize: 20,
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

export default AccommoDetailScreen;
