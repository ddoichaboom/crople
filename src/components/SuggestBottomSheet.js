import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  PanResponder,
  Modal,
  Button,
  ActivityIndicator,
} from 'react-native';
import { DANGER, GRAY, PRIMARY, WHITE } from '../colors';
import { useUserState } from '../contexts/UserContext';
import Input, { InputTypes } from './Input';
import { Role } from '../../Category';

const SuggestBottomSheet = (props) => {
  const { modalVisible, setModalVisible, disabled, onSubmit, Data } = props;
  const [data, setData] = useState([]);
  const [user] = useUserState();
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [details, setDetails] = useState('');
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });
  const [loading, setLoading] = useState(false);

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const handleComplete = async () => {
    if (location || title || price || details) {
      setLoading(true);
      const newData = {
        location: location || Data.location,
        title: title || Data.title,
        price: price || Data.price,
        details: details || '세부 제안 사항 없습니다.',
      };
      setData(newData);
      await onSubmit(newData);
      setData([]);
      setLoading(false);
      closeModal();
    }
  };

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal();
        } else {
          resetBottomSheet.start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (props.modalVisible) {
      resetBottomSheet.start();
    }
  }, [props.modalVisible]);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
    });
  };

  return (
    <Modal
      visible={modalVisible}
      animationType={'fade'}
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            ...styles.bottomSheetContainer,
            transform: [{ translateY: translateY }],
          }}
          {...panResponders.panHandlers}
        >
          <View style={styles.container}>
            <View style={styles.alertContainer}>
              <Text style={styles.alertHeader}>서비스 제안</Text>
              <Text style={styles.alertText}>기존 서비스 요청 정보에 대해</Text>
              <Text style={styles.alertText}>
                제안하실 서비스 정보를 작성해주세요.
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.alertHeader}>기존 서비스 정보</Text>
              <Input
                inputType={InputTypes.LOCATION}
                value={location}
                onChangeText={setLocation}
                title="위치"
                placeholder={Data.location}
              />
              <Input
                inputType={InputTypes.TITLE}
                value={title}
                onChangeText={setTitle}
                title="제목"
                placeholder={Data.title}
              />
              <Input
                inputType={InputTypes.NUMBER}
                value={price}
                onChangeText={setPrice}
                title="가격"
                placeholder={Data.price}
              />
              <Input
                inputType={InputTypes.DETAIL}
                value={details}
                onChangeText={setDetails}
                title="정보"
                placeholder="물품 정보를 입력하세요"
              />
            </View>
            <Button
              color={PRIMARY.DEFAULT}
              disabled={disabled || loading}
              title={loading ? '로딩 중...' : '조건 제시'}
              onPress={handleComplete}
            />
            {loading && (
              <ActivityIndicator size="small" color={PRIMARY.DEFAULT} />
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  background: {
    flex: 1,
  },
  alertContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingBottom: 50,
  },
  bottomSheetContainer: {
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  container: {
    width: '90%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
  },
  alertHeader: {
    color: PRIMARY.DEFAULT,
    fontSize: 20,
    fontWeight: '700',
    paddingBottom: 20,
  },
  alertText: {
    fontSize: 15,
    color: GRAY.DARK,
    paddingBottom: 5,
  },
  input: {
    padding: 15,
    borderWidth: 0.5,
    borderColor: GRAY.DARK,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default SuggestBottomSheet;
