import { NavigationContainer } from '@react-navigation/native';
import { useUserState } from '../contexts/UserContext';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//로그인(SignInScreen.js)에서 로그인 후 데이터베이스 내의 해당 user의 정보를 객체형태로 전달하여 user.uid혹은 user.idUser의 값을 확인하려고 함
const Navigation = () => {
  const [user, setUser] = useUserState();
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        // console.log(userData);
      }
    };
    loadUserData();
  }, [setUser]);

  return (
    <NavigationContainer>
      {user.idUser ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigation;
