import { StyleSheet, Text, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, forwardRef } from 'react';
import { GRAY, PRIMARY } from '../colors';

export const ReturnKeyTypes = {
  DEFAULT: 'default',
  GO: 'go',
  NEXT: 'next',
  DONE: 'done',
  SEARCH: 'search',
  SEND: 'send',
};

export const InputTypes = {
  TEXT: 'TEXT',
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  PASSWORD_CONFIRM: 'PASSWORD_CONFIRM',
  NUMBER: 'NUMBER',
  LOCATION: 'LOCATION',
  DETAIL: 'DETAIL',
  TITLE: 'TITLE',
  SUBJECT: 'SUBJECT',
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
  NUMBER: {
    title: '숫자 입력',
    placeholder: '숫자를 입력하세요',
    keyboardType: 'numeric',
    secureTextEntry: false,
    iconName: { active: 'currency-krw', inactive: 'currency-krw' },
  },
  TITLE: {
    title: '제목 입력',
    plcaeholder: '제목을 입력하세요',
    secureTextEntry: false,
    iconName: { active: 'tag', inactive: 'tag-outline' },
  },
  SUBJECT: {
    title: '과목 입력',
    plcaeholder: '과목을 입력하세요',
    secureTextEntry: false,
    iconName: { active: 'book-open', inactive: 'book-open-outline' },
  },
  DETAIL: {
    title: '텍스트 입력',
    placeholder: '입력하세요',
    keyboardType: 'default',
    secureTextEntry: false,
    iconName: { active: 'information', inactive: 'information-outline' },
  },
  LOCATION: {
    title: '위치',
    placeholder: '위치를 입력하세요',
    keyboardType: 'default',
    secureTextEntry: false,
    iconName: { active: 'map-marker', inactive: 'map-marker-outline' },
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
  TEXT: {
    title: '텍스트 입력',
    plcaeholder: '텍스트를 입력하세요',
    secureTextEntry: false,
    iconName: { active: 'format-text', inactive: 'format-text' },
  },
};

const Input = forwardRef(
  ({ inputType, title, placeholder, iconName, styles, ...props }, ref) => {
    const inputProps = InputTypeProps[inputType] || InputTypeProps.TEXT; // 기본값 설정
    const {
      title: defaultTitle,
      placeholder: defaultPlaceholder,
      keyboardType,
      secureTextEntry,
      iconName: { active, inactive },
    } = inputProps;

    const [isFocused, setIsFocused] = useState(false);
    const { value } = props;

    // 아이콘 이름 덮어쓰기
    const iconNameActive = iconName?.active || active;
    const iconNameInactive = iconName?.inactive || inactive;

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
          {title || defaultTitle}
        </Text>

        <View>
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
            placeholder={placeholder || defaultPlaceholder}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            autoCapitalize={'none'}
            autoCorrect={false}
            textContentType={'none'}
            keyboardAppearance={'light'}
          />

          <View style={[defaultStyles.icon, styles?.icon]}>
            <MaterialCommunityIcons
              name={isFocused ? iconNameActive : iconNameInactive}
              size={24}
              color={value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK}
            />
          </View>
        </View>
      </View>
    );
  }
);

Input.propTypes = {
  inputType: PropTypes.oneOf(Object.values(InputTypes)),
  value: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  styles: PropTypes.object,
  iconName: PropTypes.shape({
    active: PropTypes.string,
    inactive: PropTypes.string,
  }),
};

const defaultStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    marginTop: 4,
    marginBottom: 4,
    fontWeight: '700',
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
