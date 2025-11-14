import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
// import BaseView from '../BaseView';
import imagePath from '../../utils/imagePath';
import i18n from '../../translation/i18n';
import {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  SCREEN_HEIGHT,
} from '../../utils/constants';
import CustomButton from '../../components/CustomButtton';
import BaseView2 from '../../../BaseView2';
import {VARIABLES} from '../../utils/globalVariables';
export default function ContinueAs(props) {
  const setUserType = type => {
    VARIABLES.userType = type;
  };

  const handleContinue = type => {
    setUserType(type);
    if (type === 'brand') {
      props.navigation.navigate('Welcome');
      console.log('userType selected: ', VARIABLES.userType);
    } else if (type === 'user') {
      props.navigation.navigate('Welcome');
      console.log('userType selected: ', VARIABLES.userType);
    }
  };

  return (
    <BaseView2
      safeView={{backgroundColor: 'transparent'}}
      topView={{flex: 0, backgroundColor: 'transparent'}}
      baseViewStyle={{backgroundColor: 'transparent'}}>
      <View style={styles.mainView}>
        <Image style={styles.img} source={imagePath.brownImg} />
        <Text style={styles.findText}>{i18n.t('continue.continue')}</Text>
      </View>
      <View style={styles.button}>
        <CustomButton
          title={i18n.t('continue.User')}
          imageRight={imagePath.Forward}
          onPress={() => handleContinue('user')}
        />
        <CustomButton
          style={styles.user}
          textStyle={{color: COLORS.black}}
          imageRight={imagePath.Forward}
          imageStyleRight={{tintColor: COLORS.black}}
          onPress={() => handleContinue('brand')}
          title={i18n.t('continue.brand')}
        />
      </View>
    </BaseView2>
  );
}

const styles = StyleSheet.create({
  imgbg: {
    flex: 1,
  },
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  img: {
    marginBottom: 30,
  },
  findText: {
    fontSize: FONT_SIZES.twentyEight,
    fontFamily: FONT_FAMILIES.prata,
    color: COLORS.black,
    lineHeight: 38,
    textAlign: 'center',
    paddingHorizontal: 45,
  },

  button: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  user: {
    borderWidth: 1,
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
  },
});
