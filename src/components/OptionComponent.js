import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
// import imagePath from '../utils/imagePath';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';

export default function OptionComponent({title, onPress, image}) {
  return (
    <TouchableOpacity style={styles.nameView} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
      <Image source={image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  text: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.primary,
    fontFamily: FONT_FAMILIES.medium,
  },
});
