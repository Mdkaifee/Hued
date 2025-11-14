import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';

import {COLORS, FONT_SIZES, FONT_FAMILIES} from '../utils/constants';
export default function TextInputWImage({
  value,
  onChangeText,
  placeholder,
  inputStyle,
  inputContainerStyle,
  inputContainerStyle2,
  label,
  onBlur,
  props,
  keyboardType,
  maxLength,
  labelStyle,
  multiline,
  textAlignVertical,
  editable,
  image,
  rightImageVisible,
  secureTextEntry,
  onPressEye,
  imageStyle,
}) {
  return (
    <View style={{...styles.textInputView, ...inputContainerStyle}}>
      <Text
        style={[
          styles.skipView,
          Platform.OS === 'android'
            ? styles.androidLabelButton
            : styles.iosLabelButton,
          labelStyle,
        ]}>
        {label}
      </Text>
      <View style={{...styles.textInputView2, ...inputContainerStyle2}}>
        <TextInput
          placeholder={placeholder}
          style={{...styles.inputText, ...inputStyle}}
          placeholderTextColor={COLORS.textInputColor2}
          onBlur={onBlur}
          maxLength={maxLength}
          onChangeText={onChangeText}
          value={value}
          {...props}
          editable={editable}
          multiline={multiline}
          textAlignVertical={textAlignVertical}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />

        {rightImageVisible && (
          <TouchableOpacity style={imageStyle} onPress={onPressEye}>
            <Image source={image} tintColor={COLORS.black} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  androidLabelButton: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.tenor,
    color: COLORS.lightText,
    lineHeight: 16,

    marginBottom: -4,
  },
  iosLabelButton: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.tenor,
    color: COLORS.lightText,
    lineHeight: 16,
    marginBottom: 9,
  },
  textInputView: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLine,
    marginBottom: 20,
  },
  textInputView2: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  inputText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
    flex: 1,
  },
});
