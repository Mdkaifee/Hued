import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
import imagePath from '../utils/imagePath';

const CustomButton = ({
  title,
  onPress,
  style,
  textStyle,
  imageLeft,
  imageRight,
  imageStyleRight,
  imageStyleLeft,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Image style={[styles.img, imageStyleLeft]} source={imageLeft} />
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      <Image style={[styles.img, imageStyleRight]} source={imageRight} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.black,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sixteen,
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.medium,
  },
  img: {
    height: 24,
    width: 24,
  },
});

export default CustomButton;
