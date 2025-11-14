import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import BaseView from '../../../BaseView';
import CommonHeader from '../../components/CommonHeader';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../utils/constants';
import imagePath from '../../utils/imagePath';
import i18n from '../../translation/i18n';
import TextInputWithLabel from '../../components/TextInputWLabel';
import CustomButton from '../../components/CustomButtton';
// import {getData, KEYS, saveData} from '../../utils/UserPrefs';
import {ToastMessage} from '../../components/ToastMessage';

export default function EmailScreen(props) {
  const [email, setEmail] = useState('');

  const checkRequiredFields = () => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailPattern.test(email.trim())) {
      ToastMessage(i18n.t('toastMessage.emailPattern'));
      return false;
    } else {
      return true;
    }
  };
  const handleContinue = async () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      props.navigation.navigate('PasswordScreen', {
        email: email.trim(),
      });
    }
  };
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{backgroundColor: COLORS.white, paddingHorizontal: 20}}>
      <CommonHeader imageLeft={imagePath.Back} />
      <View style={styles.mainView}>
        <ScrollView scrollEnabled={false}>
          <Text style={styles.detailText}>{i18n.t('details.enter4')}</Text>
          <Text style={styles.pleaseText}>{i18n.t('details.please1')}</Text>
          <TextInputWithLabel
            label={i18n.t('details.email')}
            value={email}
            onChangeText={setEmail}
          />
        </ScrollView>
      </View>
      <CustomButton
        title={i18n.t('details.continue')}
        imageRight={imagePath.Forward}
        onPress={handleContinue}
        // onPress={() => props.navigation.navigate('PasswordScreen')}
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
  },
  pleaseText: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.lightBlack,
    lineHeight: 20,
    marginTop: 34,
    marginBottom: 42,
  },
});
