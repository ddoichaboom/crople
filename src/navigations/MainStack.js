import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WHITE } from '../colors';
import { MainRoutes } from './routes';
import ContentTab from './ContentTab';
import ServiceUploadScreen from '../screens/ServiceUploadScreen';
import ServiceRequestScreen from '../screens/ServiceRequestScreen';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';
import HeaderLeft from '../components/HeaderLeft';
import EditProfileImageScreen from '../screens/EditProfileImageScreen';
import ImagePickerScreen from '../screens/ImagePickerScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: WHITE },
        title: '',
        headerLeft: HeaderLeft,
      }}
    >
      <Stack.Screen
        name={MainRoutes.CONTENT_TAB}
        component={ContentTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={MainRoutes.SERVICE_UPLOAD}
        component={ServiceUploadScreen}
      />
      <Stack.Screen
        name={MainRoutes.SERVICE_REQUEST}
        component={ServiceRequestScreen}
      />
      <Stack.Screen
        name={MainRoutes.UPDATE_PROFILE}
        component={UpdateProfileScreen}
      />
      <Stack.Screen
        name={MainRoutes.EDIT_PROFILE}
        component={EditProfileImageScreen}
      />
      <Stack.Screen
        name={MainRoutes.IMAGE_PICKER}
        component={ImagePickerScreen}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
