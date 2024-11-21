import React, { useEffect, useState } from 'react';
import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useUserState } from '../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BLACK, GRAY, WHITE } from '../colors';
import DangerAlert, { AlertTypes } from '../components/DangerAlert';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../navigations/routes';

const ProfileScreen = () => {
  const [user, setUser] = useUserState();
  const { top } = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const signOut = async () => {
    await AsyncStorage.removeItem('user');
    setUser({});
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <DangerAlert
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={signOut}
        alertType={AlertTypes.SIGNOUT}
      />
      <View style={styles.settingButton}>
        <Pressable
          onPress={() => {
            setVisible(true);
          }}
          hitSlop={10}
        >
          <MaterialCommunityIcons
            name="logout-variant"
            size={24}
            color={GRAY.DEFAULT}
          />
        </Pressable>
      </View>

      <View style={styles.profile}>
        <View
          style={[
            styles.photo,
            user.profile_photo || { backgroundColor: GRAY.DEFAULT },
          ]}
        >
          <Image source={{ uri: user.profile_photo }} style={styles.photo} />
          <Pressable
            style={styles.editButton}
            onPress={() => navigation.navigate(MainRoutes.UPDATE_PROFILE)}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={WHITE} />
          </Pressable>
        </View>

        <Text style={styles.nickname}>{user.nickname || '갓구운크로플'}</Text>
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.titleHeader}>개인 정보</Text>
        <Text style={styles.textTitle}>이름 : {user.name}</Text>
        <Text style={styles.textTitle}>닉네임 : {user.nickname}</Text>
        <Text style={styles.textTitle}>이메일 : {user.email}</Text>
        <Text style={styles.textTitle}>전화번호 : {user.phonenumber}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  settingButton: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: GRAY.DEFAULT,
    paddingVertical: 10,
  },
  photo: { width: 100, height: 100, borderRadius: 50 },
  nickname: {
    fontSize: 22,
    fontWeight: '400',
    marginTop: 10,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: GRAY.DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: WHITE,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
  },
  titleHeader: {
    fontSize: 25,
    fontWeight: '700',
    paddingLeft: 8,
    paddingBottom: 20,
    paddingVertical: 10,
    color: BLACK,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingBottom: 10,
    color: GRAY.DARK,
  },
});

export default ProfileScreen;
