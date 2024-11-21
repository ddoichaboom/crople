import { Image, StyleSheet, Text, View } from 'react-native';
import { AuthRoutes } from '../navigations/routes';
import { useNavigation } from '@react-navigation/native';
import TextButton from '../components/TextButton';
import Button from '../components/Button';
import { GRAY } from '../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SplashScreen = () => {
  const { navigate } = useNavigation();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.imageText}>
        <View>
          <Image source={require('../../assets/start_icon.png')} />
        </View>

        <Text style={styles.title}>크로스 서비스 플랫폼 크로플</Text>
        <Text style={styles.text}>원하시는 서비스가 있나요?</Text>
        <Text style={styles.text}>또는 고객을 찾고 계신가요?</Text>
        <Text style={styles.text}>저희와 함께 시작하세요!</Text>
      </View>
      <View style={[styles.form, { paddingBottom: bottom ? bottom + 10 : 40 }]}>
        <Button
          title="시작하기"
          onPress={() => navigate(AuthRoutes.ROLE_CHOOSE)}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.row}>
            <Text style={styles.rowText}>이미 계정이 있나요? </Text>
            <TextButton
              title="로그인"
              onPress={() => navigate(AuthRoutes.SIGN_IN)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageText: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  form: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
  },
  text: {
    fontSize: 15,
    paddingTop: 4,
    fontWeight: '400',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  rowText: {
    fontSize: 14,
    color: GRAY.DARK,
    paddingRight: 5,
  },
});

export default SplashScreen;
