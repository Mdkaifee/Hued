import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';

export default function TextComponent({label, value, labelStyle, textStyle}) {
  return (
    <View
      style={[
        Platform.OS === 'android'
          ? styles.androidtextInputViewButton
          : styles.iostextInputViewButton,
        labelStyle,
      ]}>
      <Text
        style={[
          Platform.OS === 'android'
            ? styles.androidLabelButton
            : styles.iosLabelButton,
          textStyle,
        ]}>
        {label}
      </Text>
      <Text style={styles.textValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  androidtextInputViewButton: {
    height: 'auto',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorderLine,
    marginBottom: 20,
    justifyContent: 'center',
  },
  iostextInputViewButton: {
    height: 'auto',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorderLine,
    marginBottom: 20,
    justifyContent: 'center',
  },
  textValue: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 20,
  },
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
});
