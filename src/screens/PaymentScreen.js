// PaymentScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const PaymentScreen = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={require('./payment.html')} // payment.html 파일 경로
        style={styles.webview}
        javaScriptEnabled={true} // JavaScript 활성화
        domStorageEnabled={true} // DOM 저장소 활성화
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default PaymentScreen;
