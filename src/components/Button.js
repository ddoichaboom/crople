import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DANGER, GRAY, PRIMARY, WHITE } from '../colors';
import PropTypes from 'prop-types';

export const ButtonTypes = {
  PRIMARY: 'PRIMARY',
  DANGER: 'DANGER',
  CANCEL: 'CANCEL',
};

const ButtonTypeColors = {
  PRIMARY: {
    DEFAULT: PRIMARY.DEFAULT,
    LIGHT: PRIMARY.LIGHT,
    DARK: PRIMARY.DARK,
  },
  DANGER: {
    DEFAULT: DANGER.DEFAULT,
    LIGHT: DANGER.LIGHT,
    DARK: DANGER.DARK,
  },
  CANCEL: {
    DEFAULT: GRAY.DEFAULT,
    LIGHT: GRAY.LIGHT,
    DARK: GRAY.DARK,
  },
};

const Button = ({
  title,
  onPress,
  disabled,
  isLoading,
  styles,
  buttonType,
}) => {
  const Colors = ButtonTypeColors[buttonType];
  return (
    <View style={[defaultStyles.container, styles?.container]}>
      <Pressable
        onPress={onPress}
        disabled={disabled || isLoading}
        style={({ pressed }) => [
          defaultStyles.button,
          {
            backgroundColor: (() => {
              switch (true) {
                case disabled || isLoading:
                  return Colors.LIGHT;
                case pressed:
                  return Colors.DARK;
                default:
                  return Colors.DEFAULT;
              }
            })(),
          },
          styles?.button,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator size={'small'} color={GRAY.DARK} />
        ) : (
          <Text style={defaultStyles.title}>{title}</Text>
        )}
      </Pressable>
    </View>
  );
};

Button.defaultProps = {
  buttonType: ButtonTypes.PRIMARY,
};

Button.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  styles: PropTypes.object,
  buttonType: PropTypes.oneOf(Object.values(ButtonTypes)),
};

const defaultStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
});

export default Button;
