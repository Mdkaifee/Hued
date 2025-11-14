import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import imagePath from '../utils/imagePath';

import {COLORS, FONT_SIZES, FONT_FAMILIES} from '../utils/constants';
import i18n from '../translation/i18n';
export default function WalkThroughComponent({
  splashImage,
  title,
  description,
}) {
  return (
    <View style={styles.container}>
      <Image style={styles.splashImg} source={splashImage} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
  },
  blankView: {
    height: 24,
    width: 24,
  },

  skipText: {
    fontSize: FONT_SIZES.eighteen,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.primary,
    lineHeight: 38,
    textDecorationLine: 'underline',
  },
  splashImg: {
    alignSelf: 'center',
    marginTop: 66,
  },
  title: {
    fontSize: FONT_SIZES.eighteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 24,
    marginTop: 44,
    textAlign: 'center',
  },
  description: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.textBlack,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 20,
    paddingHorizontal: 70,
    marginTop: 6,
    textAlign: 'center',
  },
});
