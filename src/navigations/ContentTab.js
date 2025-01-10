import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ContentRoutes } from './routes';
import ListScreen from '../screens/ListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { GRAY, PRIMARY } from '../colors';
import TabBarAddButton from '../components/TabBarAddButton';
import MyListScreen from '../screens/MyListScreen';

const Tab = createBottomTabNavigator();

const getTabBarIcon = ({ focused, color, size, name }) => {
  const iconName = focused ? name : `${name}-outline`;
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

const AddButtonScreen = () => null;
const ContentTab = () => {
  return (
    <Tab.Navigator
      initialRouteName={ContentRoutes.HOME}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY.DARK,
        tabBarInactiveTintColor: GRAY.DARK,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name={ContentRoutes.HOME}
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'home' }),
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen
        name={ContentRoutes.LIST}
        component={ListScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'view-list' }),
          tabBarLabel: '목록',
        }}
      />
      <Tab.Screen
        name={'AddButton'}
        component={AddButtonScreen}
        options={{ tabBarButton: () => <TabBarAddButton /> }}
      />

      <Tab.Screen
        name={ContentRoutes.MYLIST}
        component={MyListScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'book' }),
          tabBarLabel: '내 목록',
        }}
      />
      <Tab.Screen
        name={ContentRoutes.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'account' }),
          tabBarLabel: '프로필',
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;
