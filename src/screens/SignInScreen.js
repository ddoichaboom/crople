import axios from 'axios';
import { Alert, Image, Keyboard, StyleSheet, View } from 'react-native';
import { useRef, useCallback, useReducer, useEffect } from 'react';
import Input, { InputTypes, ReturnKeyTypes } from '../components/Input';
import Button from '../components/Button';
import SafeInputView from '../components/SafeInputView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextButton from '../components/TextButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthRoutes } from '../navigations/routes';
import HR from '../components/HR';
import { WHITE } from '../colors';
import { StatusBar } from 'expo-status-bar';
import {
  authFormReducer,
  AuthFormTypes,
  initAuthForm,
} from '../reducers/authFormReducer';
import { useUserState } from '../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../api/ApiURL';

const SignInScreen = () => {
  const passwordRef = useRef();

  const { top } = useSafeAreaInsets();
  const { navigate } = useNavigation();

  const [, setUser] = useUserState();

  const [form, dispatch] = useReducer(authFormReducer, initAuthForm);

  useFocusEffect(
    useCallback(() => {
      return () => dispatch({ type: AuthFormTypes.RESET });
    }, [])
  );

  // 앱 실행 시 AsyncStorage에서 사용자 정보 확인
  useEffect(() => {
    const checkUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    checkUser();
  }, [setUser]);

  const updateForm = (payload) => {
    const newForm = { ...form, ...payload };
    const disabled = !newForm.email || !newForm.password;

    dispatch({
      type: AuthFormTypes.UPDATE_FORM,
      payload: { disabled, ...payload },
    });
  };

  // 유효한 이메일 형식인지 확인
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    if (!form.disabled && !form.isLoading) {
      if (!isValidEmail(form.email)) {
        Alert.alert('로그인 오류', '올바른 이메일 형식이 아닙니다.');
        return;
      }

      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });

      try {
        // 로그인 요청
        const response = await axios.post(`${API_URL}` + '/login', {
          email: form.email,
          pw: form.password,
        });

        // console.log('로그인 성공:', response.data);
        Alert.alert('로그인 성공', '로그인이 완료되었습니다.');

        // 유저 정보를 setUser로 설정
        setUser(response.data.user); // 이제 user 정보가 포함됨
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message || '알 수 없는 오류가 발생했습니다.'
          : '서버 오류가 발생했습니다.';

        Alert.alert('로그인 실패', errorMessage);
      } finally {
        dispatch({ type: AuthFormTypes.TOGGLE_LOADING });
      }
    } else {
      Alert.alert('입력 오류', '이메일과 비밀번호를 모두 입력해 주세요.');
    }
  };

  return (
    <SafeInputView>
      <StatusBar style={'black'} />
      <View>
        <Image
          source={require('../../assets/Crople_Text3.png')}
          style={{ width: '100%' }}
          resizeMode={'center'}
          backgroundColor={WHITE}
        />
      </View>
      <View style={[styles.container, { paddingTop: top }]}>
        <Input
          inputType={InputTypes.EMAIL}
          value={form.email}
          onChangeText={(text) => updateForm({ email: text.trim() })}
          onSubmitEditing={() => passwordRef.current.focus()}
          styles={{ container: { marginBottom: 20 } }}
          returnKeyType={ReturnKeyTypes.NEXT}
        />
        <Input
          ref={passwordRef}
          inputType={InputTypes.PASSWORD}
          value={form.password}
          onChangeText={(text) => updateForm({ password: text.trim() })}
          onSubmitEditing={onSubmit}
          styles={{ container: { marginBottom: 20 } }}
          returnKeyType={ReturnKeyTypes.DONE}
        />
        <Button
          title={'로그인'}
          disabled={form.disabled}
          isLoading={form.isLoading}
          onPress={onSubmit}
          styles={{ container: { marginTop: 20 } }}
        />

        <HR text={'또는'} styles={{ container: { marginVertical: 30 } }} />

        <TextButton
          title={'회원가입'}
          onPress={() => navigate(AuthRoutes.ROLE_CHOOSE)}
        />
      </View>
    </SafeInputView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
});

export default SignInScreen;
