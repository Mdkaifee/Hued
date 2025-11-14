import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
import imagePath from '../utils/imagePath';
import {useNavigation} from '@react-navigation/native';
const CommonHeader = ({
  title,
  imageLeft,
  imageRight,
  onPressLeft,
  onPressRight,
  viewStyle,
  textStyle,
  imageStyleLeft,
  imageStyleRight,
  headerStyle,
}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.header, headerStyle]}>
      <TouchableOpacity
        style={[styles.blankView, viewStyle]}
        onPress={() => navigation.goBack()}>
        <Image source={imageLeft} style={[styles.image, imageStyleLeft]} />
      </TouchableOpacity>
      <Text style={[styles.headerText, textStyle]}>{title}</Text>
      <TouchableOpacity
        style={[styles.blankView, viewStyle]}
        onPress={onPressRight}>
        <Image source={imageRight} style={[styles.image, imageStyleRight]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.white,
  },
  headerText: {
    fontSize: FONT_SIZES.twenty,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 27,
  },

  blankView: {
    width: 24,
    height: 24,
  },
  headerImg: {
    width: 24,
    height: 24,
  },
});

export default CommonHeader;
