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
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native';
import { DANGER, GRAY, PRIMARY } from '../colors';

const BottomSheet = (props) => {
  const { modalVisible, setModalVisible, disabled, onSubmit } = props;
  const [bids_price, setBidsPrice] = useState(''); // 입찰 가격 상태 관리
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
    if (bids_price) {
      setLoading(true);
      await onSubmit(bids_price);
      setBidsPrice(''); // 제출 후 입력 필드 초기화
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
            <Text style={styles.alertHeader}>알림</Text>
            <Text style={styles.alertText}>
              입찰에 참여한 후 취소가 불가하니
            </Text>
            <Text style={styles.alertText}>신중한 참여 부탁드립니다.</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={'입찰 가격을 입력하세요'}
                keyboardType="numeric"
                value={bids_price}
                textAlign={'center'}
                onChangeText={setBidsPrice} // 입력값 상태 업데이트
              />
              <Button
                color={PRIMARY.DEFAULT}
                disabled={disabled || loading}
                title={loading ? '로딩 중...' : '가격 제시'}
                onPress={handleComplete}
              />
              {loading && (
                <ActivityIndicator size="small" color={PRIMARY.DEFAULT} />
              )}
            </View>
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
  bottomSheetContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 100,
  },
  inputContainer: {
    paddingVertical: 20,
  },
  alertHeader: {
    color: DANGER.DEFAULT,
    fontSize: 20,
    fontWeight: '700',
    paddingBottom: 40,
  },
  alertText: {
    fontSize: 15,
    color: GRAY.DARK,
    paddingBottom: 5,
  },
  input: {
    width: 200,
    height: 50, // 고정된 높이 설정
    padding: 15,
    borderWidth: 0.5,
    borderColor: GRAY.DARK,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default BottomSheet;
