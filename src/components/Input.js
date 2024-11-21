import { StyleSheet, Text, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, forwardRef } from 'react';
import { GRAY, PRIMARY } from '../colors';

export const InputTypes = {
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  PASSWORD_CONFIRM: 'PASSWORD_CONFIRM',
};

const PasswordProps = {
  keyboardType: 'default',
  secureTextEntry: true,
  iconName: { active: 'lock', inactive: 'lock-outline' },
};

const InputTypeProps = {
  EMAIL: {
    title: '이메일',
    placeholder: '이메일을 입력하세요',
    keyboardType: 'email-address',
    secureTextEntry: false,
    iconName: { active: 'email', inactive: 'email-outline' },
  },
  PASSWORD: {
    title: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    ...PasswordProps,
  },
  PASSWORD_CONFIRM: {
    title: '비밀번호 확인',
    placeholder: '비밀번호 확인',
    ...PasswordProps,
  },
};

export const ReturnKeyTypes = {
  DONE: 'done',
  NEXT: 'next',
};

const Input = forwardRef(({ inputType, styles, ...props }, ref) => {
  const {
    title,
    placeholder,
    keyboardType,
    secureTextEntry,
    iconName: { active, inactive },
  } = InputTypeProps[inputType];

  const [isFocused, setIsFocused] = useState(false);
  const { value } = props;

  return (
    <View style={[defaultStyles.container, styles?.container]}>
      <Text
        style={[
          defaultStyles.title,
          {
            color: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK,
          },
          styles?.title,
        ]}
      >
        {title}
      </Text>

      <View style={{}}>
        <TextInput
          ref={ref}
          {...props}
          style={[
            defaultStyles.input,
            {
              borderColor: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK,
              color: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK,
            },
            styles?.input,
          ]}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          autoCaptialize={'none'}
          autoCorrect={false}
          textContentType={'none'}
          keyboardAppearance={'light'}
        />
        <View style={[defaultStyles.icon, styles?.icon]}>
          <MaterialCommunityIcons
            name={isFocused ? active : inactive}
            size={24}
            color={value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK}
          />
        </View>
      </View>
    </View>
  );
});

Input.propTypes = {
  inputType: PropTypes.oneOf(Object.values(InputTypes)),
  value: PropTypes.string,
  styles: PropTypes.object,
};

const defaultStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    marginTop: 4,
    marginBottom: 4,
    fontweight: '700',
  },
  input: {
    borderBottomWidth: 1,
    height: 42,
    paddingHorizontal: 10,
    paddingLeft: 40,
  },
  icon: {
    position: 'absolute',
    left: 8,
    height: '100%',
    justifyContent: 'center',
  },
});

export default Input;
