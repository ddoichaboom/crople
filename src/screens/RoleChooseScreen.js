import { StyleSheet, Text, View, Alert } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { AuthRoutes } from '../navigations/routes';
import TextButton from '../components/TextButton';
import { Role } from '../../Category';

const RoleChooseScreen = () => {
  const { navigate } = useNavigation();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleConfirm = () => {
    if (!selectedRole) {
      Alert.alert('역할 선택', '수요자 또는 공급자를 선택해 주세요.');
      return;
    }
    // console.log('선택한 역할: ', selectedRole);
    // 회원가입 화면으로 이동하며 선택한 역할을 전달
    navigate(AuthRoutes.SIGN_UP, { selectedRole });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사용자 역할 선택</Text>
      <View style={styles.checkBoxContainer}>
        <View style={styles.checkBoxStyle}>
          <BouncyCheckbox
            isChecked={selectedRole === Role.CONSUMER}
            onPress={() => setSelectedRole(Role.CONSUMER)}
          />
          <TextButton
            title="수요자"
            onPress={() => setSelectedRole(Role.CONSUMER)}
            styles={{ title: { fontSize: 20 } }}
          />
        </View>
        <View style={styles.checkBoxStyle}>
          <BouncyCheckbox
            isChecked={selectedRole === Role.PROVIDER}
            onPress={() => setSelectedRole(Role.PROVIDER)}
          />
          <TextButton
            title="공급자"
            onPress={() => setSelectedRole(Role.PROVIDER)}
            styles={{ title: { fontSize: 20 } }}
          />
        </View>
      </View>
      <Button title="확인" onPress={handleConfirm} style={styles.button} />
    </View>
  );
};

RoleChooseScreen.propTypes = {
  // PropTypes 정의 (필요시)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  checkBoxStyle: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  checkBoxContainer: {
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default RoleChooseScreen;
