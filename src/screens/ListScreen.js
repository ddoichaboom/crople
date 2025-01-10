import { Image, StyleSheet, View } from 'react-native';
import { GRAY, WHITE } from '../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import TextButton from '../components/TextButton';

import { useEffect, useState } from 'react';
import { AWSS3URL } from '../api/ApiURL';
import { useUserState } from '../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductsList from '../components/ProductsList';
import TutoringList from '../components/TutoringList';
import AccommoList from '../components/AccommoList';
import { MainRoutes } from '../navigations/routes';
import { Categories, Role } from '../../Category';

const ListScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const [selectedcategory, setSelectedCategory] = useState(Categories.PRODUCTS);
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

  const onSubmit = (idBoard, category, role, photoUrls) => {
    if (category === Categories.PRODUCTS) {
      if (role === Role.CONSUMER) {
        navigation.navigate(MainRoutes.PRODUCT_REQUEST, { idBoard, photoUrls });
      } else if (role === Role.PROVIDER) {
        navigation.navigate(MainRoutes.PRODUCT_DETAIL, { idBoard, photoUrls });
      }
    } else if (category === Categories.TUTORING) {
      navigation.navigate(MainRoutes.TUTORING_DETAIL, { idBoard, photoUrls });
    } else if (category === Categories.ACCOMMODATION) {
      navigation.navigate(MainRoutes.ACCOMMO_DETAIL, { idBoard, photoUrls });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.topContainer}>
        <Image
          source={{ uri: AWSS3URL.URI + '/assets/start_icon.png' }}
          style={styles.icon}
        />
        <Image
          source={{ uri: AWSS3URL.URI + '/assets/Crople_Text3.png' }}
          style={[styles.iconText, { resizeMode: 'center' }]}
        />
      </View>
      <View style={styles.categories}>
        <TextButton
          styles={{
            title: {
              color:
                selectedcategory === Categories.PRODUCTS
                  ? GRAY.DARK
                  : GRAY.DEFAULT,
              paddingHorizontal: 5,
            },
          }}
          title={'물품 거래'}
          onPress={() => setSelectedCategory(Categories.PRODUCTS)}
        />
        <TextButton
          styles={{
            button: styles.buttontitle,
            title: {
              color:
                selectedcategory === Categories.TUTORING
                  ? GRAY.DARK
                  : GRAY.DEFAULT,
              paddingHorizontal: 5,
            },
          }}
          title={'맞춤형 레슨'}
          onPress={() => setSelectedCategory(Categories.TUTORING)}
        />
        <TextButton
          styles={{
            button: styles.buttontitle,
            title: {
              color:
                selectedcategory === Categories.ACCOMMODATION
                  ? GRAY.DARK
                  : GRAY.DEFAULT,
              paddingHorizontal: 5,
            },
          }}
          title={'숙박'}
          onPress={() => setSelectedCategory(Categories.ACCOMMODATION)}
        />
      </View>

      {selectedcategory === Categories.PRODUCTS && (
        <ProductsList onSubmit={onSubmit} />
      )}
      {selectedcategory === Categories.TUTORING && (
        <TutoringList onSubmit={onSubmit} />
      )}
      {selectedcategory === Categories.ACCOMMODATION && (
        <AccommoList onSubmit={onSubmit} />
      )}
    </View>
  );
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
  categories: {
    flexDirection: 'row',
  },
});

export default ListScreen;
