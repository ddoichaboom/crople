import { Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { GRAY, WHITE } from '../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import TextButton from '../components/TextButton';

import { useEffect, useState } from 'react';
import { AWSS3URL } from '../api/ApiURL';
import { useUserState } from '../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Category = {
  PRODUCT: 'products',
  TUTORING: 'tutoring',
  ACCOMODATION: 'accomodation',
};

const ListByCategory = (category) => {
  console.log('Selected Category:', category);
};

const ListScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const [selectedcategory, setSelectedCategory] = useState();
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

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    ListByCategory(category);
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
            button: styles.buttontitle,
            title: {
              color:
                selectedcategory === Category.PRODUCT
                  ? GRAY.DARK
                  : GRAY.DEFAULT,
              paddingHorizontal: 5,
            },
          }}
          title={'물품 거래'}
          onPress={() => handleCategoryPress(Category.PRODUCT)}
        />
        <TextButton
          styles={{
            button: styles.buttontitle,
            title: {
              color:
                selectedcategory === Category.TUTORING
                  ? GRAY.DARK
                  : GRAY.DEFAULT,
              paddingHorizontal: 5,
            },
          }}
          title={'맞춤형 레슨'}
          onPress={() => handleCategoryPress(Category.TUTORING)}
        />
        <TextButton
          styles={{
            button: styles.buttontitle,
            title: {
              color:
                selectedcategory === Category.ACCOMODATION
                  ? GRAY.DARK
                  : GRAY.DEFAULT,
              paddingHorizontal: 5,
            },
          }}
          title={'숙박'}
          onPress={() => handleCategoryPress(Category.ACCOMODATION)}
        />
      </View>
    </View>
  );
};

ListScreen.propTypes = {
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
  categories: {
    flexDirection: 'row',
  },
});

export default ListScreen;
