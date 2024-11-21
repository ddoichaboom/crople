import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../navigations/routes';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { PRIMARY, WHITE } from '../colors';
import { useUserState } from '../contexts/UserContext';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabBarAddButton = () => {
  const navigation = useNavigation();
  const [user, setUser] = useUserState();
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUserData();
  }, [setUser]);

  const handlePress = () => {
    if (user && user.role) {
      if (user.role === 'consumer') {
        navigation.navigate(MainRoutes.SERVICE_REQUEST);
      } else if (user.role === 'provider') {
        navigation.navigate(MainRoutes.SERVICE_UPLOAD);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handlePress}>
        <MaterialCommunityIcons name="plus" size={25} color={WHITE} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
  button: {
    backgroundColor: PRIMARY.DEFAULT,
    borderRadius: 999,
    padding: 4,
  },
});

export default TabBarAddButton;
