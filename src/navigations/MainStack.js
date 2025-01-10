import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WHITE } from '../colors';
import { MainRoutes } from './routes';
import ContentTab from './ContentTab';
import ServiceUploadScreen from '../screens/ServiceUploadScreen';
import ServiceRequestScreen from '../screens/ServiceRequestScreen';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';
import HeaderLeft from '../components/HeaderLeft';
import EditProfileImageScreen from '../screens/EditProfileImageScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import TutoringDetailScreen from '../screens/TutoringDetailScreen';
import AccommoDetailScreen from '../screens/AccommoDetailScreen';
import ProductRequestScreen from '../screens/ProductRequestScreen';
import PaymentScreen from '../screens/PaymentScreen';

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
        options={{ title: '서비스 등록' }}
      />
      <Stack.Screen
        name={MainRoutes.SERVICE_REQUEST}
        component={ServiceRequestScreen}
        options={{ title: '서비스 요청' }}
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
        name={MainRoutes.PRODUCT_DETAIL}
        component={ProductDetailScreen}
      />
      <Stack.Screen
        name={MainRoutes.PRODUCT_REQUEST}
        component={ProductRequestScreen}
      />
      <Stack.Screen
        name={MainRoutes.TUTORING_DETAIL}
        component={TutoringDetailScreen}
      />
      <Stack.Screen
        name={MainRoutes.ACCOMMO_DETAIL}
        component={AccommoDetailScreen}
      />
      <Stack.Screen name={MainRoutes.PAYMENT} component={PaymentScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
