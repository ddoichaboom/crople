import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { AuthRoutes } from './routes';
import { WHITE } from '../colors';
import RoleChooseScreen from '../screens/RoleChooseScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundcolor: WHITE },
        headerShown: false,
      }}
    >
      <Stack.Screen name={AuthRoutes.SPLASH} component={SplashScreen} />
      <Stack.Screen
        name={AuthRoutes.ROLE_CHOOSE}
        component={RoleChooseScreen}
      />
      <Stack.Screen name={AuthRoutes.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={AuthRoutes.SIGN_UP} component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
