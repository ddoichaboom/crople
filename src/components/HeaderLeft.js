import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BLACK } from '../colors';

const HeaderLeft = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      hitSlop={10}
      onPress={() => navigation.canGoBack() && navigation.goBack()}
    >
      <MaterialCommunityIcons name="chevron-left" size={28} color={BLACK} />
    </Pressable>
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
});

export default HeaderLeft;
