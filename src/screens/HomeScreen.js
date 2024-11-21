import {
  Button,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { GRAY, WHITE } from '../colors';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../navigations/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AWSS3URL } from '../api/ApiURL';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const height = useWindowDimensions().height / 4;

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.topContainer}>
        <Image
          source={{
            uri: AWSS3URL.URI + '/assets/start_icon.png',
          }}
          style={styles.icon}
        />
        <Image
          source={{ uri: AWSS3URL.URI + '/assets/Crople_Text3.png' }}
          style={[styles.iconText, { resizeMode: 'center' }]}
        />
        {/* <Text style={styles.title}>크로플</Text> */}
      </View>

      <View style={styles.buttonContainer}></View>
    </View>
  );
};

HomeScreen.propTypes = {
  //PropTypes
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: WHITE,
    paddingHorizontal: 20,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderBottomWidth: 0.3,
    borderBottomColor: GRAY.DEFAULT,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 30,
  },
  iconText: {
    width: 180,
    height: 60,
  },

  buttonContainer: {},
  title: {
    fontSize: 30,
  },
});

export default HomeScreen;
