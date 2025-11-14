import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import BaseView from '../../../BaseView';
import CommonHeader from '../../components/CommonHeader';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../utils/constants';
import imagePath from '../../utils/imagePath';
import i18n from '../../translation/i18n';
// import TextInputWithLabel from '../../components/TextInputWLabel';
import CustomButton from '../../components/CustomButtton';
import TextInputWImage from '../../components/TextInputWImage';

export default function ConfirmPassScreen(props) {
  const [passwordVisible, setPasswordVisible] = useState(true);
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{backgroundColor: COLORS.white, paddingHorizontal: 20}}>
      <CommonHeader imageLeft={imagePath.Back} />
      <View style={styles.mainView}>
        <Text style={styles.detailText}>{i18n.t('details.enter2')}</Text>

        <TextInputWImage
          label={i18n.t('details.password')}
          secureTextEntry={passwordVisible ? true : false}
          rightImageVisible
          onPressEye={() => setPasswordVisible(!passwordVisible)}
          image={passwordVisible ? imagePath.Check : imagePath.Forward}
        />
      </View>
      <CustomButton
        title={i18n.t('details.continue')}
        imageRight={imagePath.Forward}
        onPress={() => props.navigation.navigate('Home')}
      />
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  detailText: {
    fontSize: FONT_SIZES.forty,
    fontFamily: FONT_FAMILIES.prata,
    color: COLORS.black,
    lineHeight: 54,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 60,
  },
  pleaseText: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.lightBlack,
    lineHeight: 20,
    marginTop: 34,
    marginBottom: 60,
  },
});
