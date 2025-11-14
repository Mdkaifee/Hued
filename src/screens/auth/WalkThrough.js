import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import React, {useRef, useState} from 'react';
import PagerView from 'react-native-pager-view';
import {COLORS, FONT_SIZES, FONT_FAMILIES} from '../../utils/constants';
import i18n from '../../translation/i18n';
import imagePath from '../../utils/imagePath';
import WalkThroughComponent from '../../components/WalkThroughComponent';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {VARIABLES} from '../../utils/globalVariables';
import {ToastMessage} from '../../components/ToastMessage';
import {KEYS, saveData} from '../../utils/UserPrefs';

const {width, height} = Dimensions.get('window');

const WalkThrough = props => {
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = pageIndex => {
    setCurrentPage(pageIndex);
  };
  // location Permissions
  const Location = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs location permission to show results accordingly.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        ToastMessage('Location permission denied');
        pagerRef.current.setPage(currentPage + 1);
      }
    } else if (Platform.OS === 'ios') {
      getLocation();
      // const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      // const result = await request(permission);
      // console.log('resultt', result);
      // if (result === RESULTS.GRANTED) {
      //   getLocation();
      // } else {
      //   ToastMessage('Location permission denied');
      // }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      info => {
        console.log(info);

        VARIABLES.lat = info?.coords?.latitude;
        VARIABLES.long = info?.coords?.longitude;
        console.log('variable lat', VARIABLES.lat);
        console.log('variable lon', VARIABLES.long);

        pagerRef.current.setPage(currentPage + 1);
      },
      error => {
        console.error('Error getting location:', error);
        pagerRef.current.setPage(currentPage + 1);
      },
    );
  };
  const Camera = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // ToastMessage('Camera permission granted');
        props.navigation.navigate('ContinueAs');
      } else {
        ToastMessage('Camera permission denied');
        props.navigation.navigate('ContinueAs');
      }
    } else if (Platform.OS === 'ios') {
      const permission = PERMISSIONS.IOS.CAMERA;

      const result = await request(permission);
      console.log('resultt', result);
      if (result === RESULTS.GRANTED) {
        // ToastMessage('Camera permission granted');
        props.navigation.navigate('ContinueAs');
      } else {
        ToastMessage(
          'Camera permission denied. Please enable camera permissions in settings.',
        );
        props.navigation.navigate('ContinueAs');
      }
    }
  };

  const handleNextPress = () => {
    if (currentPage === 0) {
      Location();

      // pagerRef.current.setPage(currentPage + 1);
    } else {
      Camera();
      // props.navigation.navigate('ContinueAs');
    }
  };

  return (
    <View style={{flex: 1}}>
      <PagerView
        ref={pagerRef}
        style={{flex: 1}}
        scrollEnabled={false}
        onPageSelected={e => handlePageChange(e.nativeEvent.position)}>
        {/* <View key="1">
          <WalkThroughComponent
            splashImage={imagePath.splash2}
            title={i18n.t('walkthrough.dont')}
            description={i18n.t('walkthrough.help')}
          />
        </View> */}
        <View key="1">
          <WalkThroughComponent
            splashImage={imagePath.splash2}
            title={i18n.t('walkthrough.add')}
            description={i18n.t('walkthrough.help')}
          />
        </View>
        <View key="2">
          <WalkThroughComponent
            splashImage={imagePath.splash3}
            title={i18n.t('walkthrough.camera')}
            description={i18n.t('walkthrough.help')}
          />
        </View>
      </PagerView>

      <TouchableOpacity style={styles.acceptView} onPress={handleNextPress}>
        <Text style={styles.acceptText}>{i18n.t('walkthrough.accept')}</Text>
        {/* <View style={styles.line} /> */}
      </TouchableOpacity>

      <Image style={styles.logoImg} source={imagePath.logo} />

      <TouchableOpacity
        style={styles.skip}
        onPress={() => props.navigation.navigate('ContinueAs')}>
        <Text style={styles.skipText}>{i18n.t('walkthrough.skip')}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  blankView: {
    height: 24,
    width: 24,
  },
  logoImg: {
    position: 'absolute',
    top: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logoImg2: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
  },
  skip: {
    position: 'absolute',
    top: 97,
    alignSelf: 'flex-end',
    right: 20,
  },
  skipText: {
    fontSize: FONT_SIZES.eighteen,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  splashImg: {
    alignSelf: 'center',
    marginTop: 90,
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
  acceptView: {
    backgroundColor: COLORS.black,
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 50,
  },
  acceptText: {
    fontSize: FONT_SIZES.eighteen,
    color: COLORS.white,
    fontFamily: FONT_FAMILIES.bold,
    lineHeight: 22,

    textAlign: 'center',
  },
  line: {
    borderTopWidth: 3,
    borderTopColor: COLORS.white,
    width: 150,
    borderRadius: 20,
  },
});

export default WalkThrough;
