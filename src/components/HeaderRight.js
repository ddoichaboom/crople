import { Pressable, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BLACK, GRAY, PRIMARY } from '../colors';

const HeaderRight = ({ onPress, disabled }) => {
  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={10}>
      <MaterialCommunityIcons
        name="check"
        size={28}
        color={disabled ? GRAY.DEFAULT : PRIMARY.DEFAULT}
      />
    </Pressable>
  );
};

HeaderRight.defaultProps = {
  disabled: false,
};

HeaderRight.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
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

export default HeaderRight;
