import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
// import BaseView from '../screens/BaseView';
import {useNavigation} from '@react-navigation/native';

export default function HomeHeader({inputHeader}) {
  const navigation = useNavigation();
  return (
    <View
      style={[
        Platform.OS === 'android' ? styles.androidHeader : styles.iosHeader,
        inputHeader,
      ]}>
      <View style={styles.bellSearchView}>
        {/* <Image source={imagePath.Search} tintColor="white" /> */}
        <Image source={imagePath.bell} tintColor="white" />
      </View>
      <Text style={styles.logoText}>{i18n.t('home.hued')}</Text>
      <View style={styles.bellSearchView}>
        {/* <TouchableOpacity>
          <Image source={imagePath.Search} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Image source={imagePath.bell} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: COLORS.white,
    shadowColor: '#0000000A',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.7,
    shadowRadius: 5,
    paddingHorizontal: 20,
  },
  androidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.textBlack,
    elevation: 14,
    shadowOpacity: 0.5,
    paddingHorizontal: 20,
  },
  mainView: {
    // paddingHorizontal: 20,
  },
  bellSearchView: {
    flexDirection: 'row',
    gap: 20,
  },
  logoText: {
    fontSize: FONT_SIZES.twenty,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 27,
  },
});
