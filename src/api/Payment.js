// payment.js
import IMP from 'iamport-react-native';
import React from 'react';
import { Alert } from 'react-native';

const makePayment = async (boardData, user) => {
  const paymentData = {
    channelKey: 'store-2af24544-b2a5-4671-b1a4-b734ea972565', // 채널 키 입력
    pay_method: 'card', // 결제 수단
    merchant_uid: `payment-${crypto.randomUUID()}`, // 주문 고유 번호
    name: boardData.title, // 상품 이름
    amount: boardData.discount_price, // 결제 금액
    buyer_email: user.email, // 사용자 이메일
    buyer_name: user.nickname, // 사용자 이름
    buyer_tel: user.phone, // 연락처
  };

  IMP.request_pay(paymentData, async (response) => {
    if (response.error_code) {
      Alert.alert(`결제에 실패하였습니다. 에러 내용: ${response.error_msg}`);
    } else {
      // 서버에 결제 정보 전달
      try {
        const result = await fetch(`${SERVER_BASE_URL}/payment/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imp_uid: response.imp_uid,
            merchant_uid: response.merchant_uid,
            // 다른 필요한 정보 추가
          }),
        });

        if (result.ok) {
          Alert.alert('결제 성공', '결제가 완료되었습니다.');
        } else {
          Alert.alert('결제 오류', '서버와의 통신 중 오류가 발생했습니다.');
        }
      } catch (error) {
        Alert.alert('결제 오류', '서버와의 통신 중 오류가 발생했습니다.');
      }
    }
  });
};

export default makePayment;
