import {StyleSheet, Text, View, TextInput, Platform} from 'react-native';
import React from 'react';

import {COLORS, FONT_SIZES, FONT_FAMILIES} from '../utils/constants';
export default function TextInputWithLabel({
  value,
  onChangeText,
  placeholder,
  inputStyle,
  inputContainerStyle,
  label,
  onBlur,
  props,
  keyboardType,
  maxLength,
  labelStyle,
  multiline,
  textAlignVertical,
  editable,
  secureTextEntry,
}) {
  return (
    <View>
      <View
        style={[
          Platform.OS === 'android'
            ? styles.androidtextInputViewButton
            : styles.iostextInputViewButton,
          inputContainerStyle,
        ]}>
        <Text
          style={[
            Platform.OS === 'android'
              ? styles.androidLabelButton
              : styles.iosLabelButton,
            labelStyle,
          ]}>
          {label}
        </Text>

        <TextInput
          placeholder={placeholder}
          style={{...styles.inputText, ...inputStyle}}
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
    marginBottom: -2,
  },
  iosLabelButton: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.tenor,
    color: COLORS.lightText,
    lineHeight: 16,
    marginBottom: 7,
  },
  androidtextInputViewButton: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLine,
    marginBottom: 20,
    justifyContent: 'center',
  },
  iostextInputViewButton: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLine,
    marginBottom: 20,
    justifyContent: 'center',
  },
  inputText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
  },
});
