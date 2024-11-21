import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserState } from '../contexts/UserContext';
import { GRAY, WHITE } from '../colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HeaderRight from '../components/HeaderRight';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from 'react';
import { updateUserInfo } from '../api/Auth';
import SafeInputView from '../components/SafeInputView';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage import
import {
  updateFormReducer,
  UpdateFormTypes,
} from '../reducers/updateFormReducer';
import { ContentRoutes, MainRoutes } from '../navigations/routes';

const UpdateProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useUserState();

  // 초기 상태를 설정합니다.
  const initUpdateForm = {
    nickname: user.nickname || '',
    name: user.name || '',
    email: user.email || '',
    phonenumber: user.phonenumber || '',
  };

  const [form, dispatch] = useReducer(updateFormReducer, initUpdateForm);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const updateForm = (payload) => {
    const newForm = { ...form, ...payload };
    dispatch({
      type: UpdateFormTypes.UPDATE_FORM,
      payload: newForm,
    });
  };

  const onSubmit = useCallback(async () => {
    Keyboard.dismiss();
    if (!disabled) {
      setIsLoading(true);
      try {
        const updatedUser = await updateUserInfo(user.idUser, form);

        // AsyncStorage에 업데이트된 사용자 정보 저장
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser.user));
        // 사용자 상태 업데이트
        setUser(updatedUser.user);

        navigation.goBack();
      } catch (e) {
        Alert.alert('사용자 수정 실패', e.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [disabled, form, navigation, setUser]);

  useEffect(() => {
    setDisabled(!form.nickname || isLoading); // nickname이 없거나 로딩 중이면 비활성화
  }, [form, isLoading]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight disabled={disabled} onPress={onSubmit} />,
    });
  }, [navigation, disabled, onSubmit]);

  return (
    <SafeInputView>
      <View style={styles.container}>
        <Text style={styles.title}>개인정보 수정</Text>
        <View>
          <Image style={styles.photo} source={{ uri: user.profile_photo }} />
          <Pressable
            onPress={() => navigation.navigate(MainRoutes.EDIT_PROFILE)}
            style={styles.imageButton}
          >
            <MaterialCommunityIcons name="image" size={20} color={WHITE} />
          </Pressable>
        </View>

        <View style={styles.listContainer}>
          <TextInput
            value={form.nickname}
            onChangeText={(text) => updateForm({ nickname: text.trim() })}
            style={styles.input}
            placeholder={'닉네임'}
            textAlign={'center'}
            maxLength={10}
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
          />

          <TextInput
            value={form.name}
            onChangeText={(text) => updateForm({ name: text.trim() })}
            style={styles.input}
            placeholder={'이름'}
            textAlign={'center'}
            maxLength={10}
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
          />

          <TextInput
            value={form.email}
            onChangeText={(text) => updateForm({ email: text.trim() })}
            style={styles.input}
            keyboardType="email-address"
            placeholder={'이메일'}
            textAlign={'center'}
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
          />

          <TextInput
            value={form.phonenumber}
            onChangeText={(text) => updateForm({ phonenumber: text.trim() })}
            style={styles.input}
            keyboardType="phone-pad"
            placeholder={'전화번호'}
            textAlign={'center'}
            maxLength={11}
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
          />
        </View>
      </View>
    </SafeInputView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 30,
    paddingVertical: 20,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: GRAY.LIGHT,
  },
  input: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: 300,
    fontSize: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: GRAY.DEFAULT,
  },
  imageButton: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GRAY.DARK,
  },
  listContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: WHITE,
  },
});

export default UpdateProfileScreen;
