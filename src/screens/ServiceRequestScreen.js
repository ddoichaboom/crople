import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../navigations/routes';
import { GRAY } from '../colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useUserState } from '../contexts/UserContext';

const ServiceRequestScreen = () => {
  const [user, setUser] = useUserState();

  const navigation = useNavigation();

  const width = useWindowDimensions().width;

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        이미지는 최대 4장까지 선택 가능합니다.
      </Text>

      <View style={{ width, height: width }}>
        <Pressable
          onPress={() => navigation.navigate(MainRoutes.IMAGE_PICKER)}
          style={styles.photoButton}
        >
          <MaterialCommunityIcons
            name="image-plus"
            size={60}
            color={GRAY.DEFAULT}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    color: GRAY.DARK,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  photoButton: {
    backgroundColor: GRAY.LIGHT,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServiceRequestScreen;
