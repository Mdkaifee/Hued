import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';

export default function ContinueWithComponent({title, image, onPress}) {
  return (
    <TouchableOpacity style={styles.continueView} onPress={onPress}>
      <Image source={image} />
      <Text style={styles.continueText}>{title}</Text>
      <Image style={styles.blankImg} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  continueView: {
    flexDirection: 'row',
    alignItems: 'center',
  
    backgroundColor: COLORS.transparent,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 54,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 16,
  },
  blankImg: {
    height: 24,
    width: 24,
  },
  continueText: {
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.black,
  },
});
