import axios from 'axios';
import { Alert, Image, Keyboard, StyleSheet, View } from 'react-native';
import { useRef, useReducer } from 'react';
import Input, { InputTypes, ReturnKeyTypes } from '../components/Input';
import Button from '../components/Button';
import SafeInputView from '../components/SafeInputView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextButton from '../components/TextButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthRoutes, MainRoutes } from '../navigations/routes';
import HR from '../components/HR';
import { WHITE } from '../colors';
import { StatusBar } from 'expo-status-bar';
import {
  authFormReducer,
  initAuthForm,
  AuthFormTypes,
} from '../reducers/authFormReducer';
import { API_URL } from '../api/ApiURL';

const SignUpScreen = () => {
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const route = useRoute();
  const { selectedRole } = route.params;

  const [form, dispatch] = useReducer(authFormReducer, initAuthForm);

  const { top } = useSafeAreaInsets();
  const { navigate } = useNavigation();

  const updateForm = (payload) => {
    const newForm = { ...form, ...payload };
    const disabled =
      !newForm.email ||
      !newForm.password ||
      newForm.password !== newForm.passwordConfirm;

    dispatch({
      type: AuthFormTypes.UPDATE_FORM,
      payload: { disabled, ...payload },
    });
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    if (!form.disabled && !form.isLoading) {
      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });

      //사용자가 선택한 역할 확인
      // console.log('사용자가 선택한 역할: ', selectedRole);
      // console.log('사용자 이메일(아이디): ', form.email);
      // console.log('사용자 비밀번호: ', form.password);

      try {
        // 회원가입 요청
        const response = await axios.post(`${API_URL}` + '/signup', {
          email: form.email,
          pw: form.password,
          role: selectedRole,
        });

        // console.log('회원가입 성공:', response.data);
        Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');

        // 회원가입 후 다른 화면으로 이동
        navigate(AuthRoutes.SIGN_IN); // 현재는 로그인 화면으로 이동
      } catch (error) {
        console.error(
          '회원가입 실패:',
          error.response ? error.response.data : error.message
        );
        Alert.alert(
          '회원가입 실패',
          error.response
            ? error.response.data.message
            : '서버 오류가 발생했습니다.'
        );
      } finally {
        dispatch({ type: AuthFormTypes.TOGGLE_LOADING });
      }
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
          onSubmitEditing={() => passwordConfirmRef.current.focus()}
          styles={{ container: { marginBottom: 20 } }}
          returnKeyType={ReturnKeyTypes.NEXT}
        />
        <Input
          ref={passwordConfirmRef}
          inputType={InputTypes.PASSWORD_CONFIRM}
          value={form.passwordConfirm}
          onChangeText={(text) => updateForm({ passwordConfirm: text.trim() })}
          onSubmitEditing={onSubmit}
          styles={{ container: { marginBottom: 20 } }}
          returnKeyType={ReturnKeyTypes.DONE}
        />
        <Button
          title={'회원가입'}
          disabled={form.disabled}
          isLoading={form.isLoading}
          onPress={onSubmit}
          styles={{ container: { marginTop: 20 } }}
        />

        <HR text={'또는'} styles={{ container: { marginVertical: 30 } }} />

        <TextButton
          title={'로그인'}
          onPress={() => navigate(AuthRoutes.SIGN_IN)}
        />
      </View>
    </SafeInputView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
});

export default SignUpScreen;
