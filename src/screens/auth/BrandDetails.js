import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  TouchableOpacity
} from 'react-native';
import React, {useState} from 'react';
import BaseView from '../../../BaseView';
import CommonHeader from '../../components/CommonHeader';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../utils/constants';
import imagePath from '../../utils/imagePath';
import i18n from '../../translation/i18n';
import TextInputWithLabel from '../../components/TextInputWLabel';
import CustomButton from '../../components/CustomButtton';
import {SignUpApi} from '../../services/AuthApi';
import {ToastMessage} from '../../components/ToastMessage';
import TextInputWImage from '../../components/TextInputWImage';
import Loader from '../../components/Loader';
import {VARIABLES} from '../../utils/globalVariables';
import {getFcmToken} from '../../utils/notificationServices';
// import MonthPicker from 'react-native-month-year-picker';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import YearModal from '../../modals/YearModal';

export default function BrandDetails(props) {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const checkRequiredFields = () => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (name.trim() == '') {
      ToastMessage(i18n.t('toastMessage.Brandname'));
      return false;
    } else if (year.trim() == '') {
      ToastMessage(i18n.t('toastMessage.year'));
      return false;
    } else if (city.trim() == '') {
      ToastMessage(i18n.t('toastMessage.city'));
      return false;
    } else if (!emailPattern.test(email.trim())) {
      ToastMessage(i18n.t('toastMessage.emailPattern'));
      return false;
    } else if (password.trim() == '') {
      ToastMessage(i18n.t('toastMessage.password'));
      return false;
    } else if (password.trim().length < 6) {
      ToastMessage(i18n.t('toastMessage.passwordLength'));
      return false;
    } else if (confirmPassword.trim() == '') {
      ToastMessage(i18n.t('toastMessage.confirmPassword'));
      return false;
    } else if (confirmPassword !== password) {
      ToastMessage(i18n.t('toastMessage.passwordMismatch'));
      return false;
    } else {
      return true;
    }
  };

  const handleYearPress = year => {
    setYear(year);
  };

  const handleSignUp = async () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      setLoading(true);
      const deviceToken = await getFcmToken();
      const data = {
        name: name.trim(),
        yearFounded: year,
        email: email.trim(),
        city: city,
        password: password,
        userType: VARIABLES?.userType,
        lat: VARIABLES?.lat === null ? 0 : VARIABLES?.lat,
        long: VARIABLES?.long === null ? 0 : VARIABLES?.long,
        deviceToken: deviceToken,
      };
      const response = await SignUpApi(data);
      if (response?.responseCode === 200) {
        setLoading(false);
        props.navigation.replace('AppStackNavigator');
        ToastMessage(response?.responseMessage);
      } else {
        setLoading(false);
        ToastMessage(response?.data?.responseMessage);
      }
    }
  };

  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{backgroundColor: COLORS.white, paddingHorizontal: 20}}>
      <CommonHeader imageLeft={imagePath.Back} />

      <View style={styles.mainView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 60}
          style={styles.contentContainer}>
          <Text style={styles.detailText}>{i18n.t('details.enter')}</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollviewstyle}>
            <Text style={styles.pleaseText}>{i18n.t('details.please')}</Text>

            <TextInputWithLabel
              label={i18n.t('details.brand')}
              value={name}
              onChangeText={setName}
            />

            <View
              style={[
                Platform.OS === 'android'
                  ? styles.androidtextInputViewButton
                  : styles.iostextInputViewButton,
              ]}>
              <Text
                style={[
                  Platform.OS === 'android'
                    ? styles.androidLabelButton
                    : styles.iosLabelButton,
                ]}>
                {i18n.t('details.year')}
              </Text>
              <TouchableOpacity onPress={openModal}>
                <Text
                  style={[
                    Platform.OS === 'android'
                      ? styles.androidText
                      : styles.inputText,
                  ]}>
                  {year}
                </Text>
              </TouchableOpacity>
            </View>

            <TextInputWithLabel
              label={i18n.t('details.city')}
              value={city}
              onChangeText={setCity}
            />
            <TextInputWithLabel
              label={i18n.t('details.email')}
              value={email}
              onChangeText={setEmail}
            />

            <TextInputWImage
              label={i18n.t('details.password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={passwordVisible ? true : false}
              rightImageVisible
              onPressEye={() => setPasswordVisible(!passwordVisible)}
              image={passwordVisible ? imagePath.closeEye : imagePath.eye}
            />
            <TextInputWImage
              label={i18n.t('details.confirm')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={confirmPasswordVisible ? true : false}
              rightImageVisible
              onPressEye={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }
              image={
                confirmPasswordVisible ? imagePath.closeEye : imagePath.eye
              }
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <YearModal
        visible={modalVisible}
        closeModal={closeModal}
        onSelectedYear={handleYearPress}
      />

      <CustomButton
        style={styles.button}
        title={i18n.t('details.continue')}
        imageRight={imagePath.Forward}
        onPress={handleSignUp}
      />
      {loading && <Loader />}
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
    lineHeight: 24,
    marginTop: 34,
    marginBottom: 36,
  },
  contentContainer: {
    flex: 1,
  },

  button: {
    marginTop: 20,
  },
  androidtextInputViewButton: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLine,
    marginBottom: 20,
    justifyContent: 'center',
  },
  iostextInputViewButton: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLine,
    marginBottom: 20,
    justifyContent: 'center',
  },
  inputText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
  },
  androidLabelButton: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.tenor,
    color: COLORS.lightText,
    lineHeight: 16,
    marginBottom: 4,
  },
  iosLabelButton: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.tenor,
    color: COLORS.lightText,
    lineHeight: 16,
    marginBottom: 7,
  },
  androidText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
    marginTop: 4,
  },
});
