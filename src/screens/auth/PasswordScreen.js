import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import BaseView from '../../../BaseView';
import CommonHeader from '../../components/CommonHeader';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../utils/constants';
import imagePath from '../../utils/imagePath';
import i18n from '../../translation/i18n';
// import TextInputWithLabel from '../../components/TextInputWLabel';
import CustomButton from '../../components/CustomButtton';
import TextInputWImage from '../../components/TextInputWImage';
// import {getData, KEYS} from '../../utils/UserPrefs';
import {ForgotPasswordApi, LoginApi} from '../../services/AuthApi';
import {ToastMessage} from '../../components/ToastMessage';
import ForgotPassword from '../../modals/ForgotPassword';
import Loader from '../../components/Loader';
import {VARIABLES} from '../../utils/globalVariables';
import {getFcmToken} from '../../utils/notificationServices';

export default function PasswordScreen(props) {
  const {navigation} = props;
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const email = props?.route?.params?.email;
  console.log('email', email);

  const checkRequiredFields = () => {
    if (password.trim() === '') {
      ToastMessage(i18n.t('toastMessage.password'));
      return false;
    } else if (password.length < 6) {
      ToastMessage(i18n.t('toastMessage.passwordLength'));
      return false;
    } else {
      return true;
    }
  };
  const handleLogin = async () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      setLoading(true);
      const deviceToken = await getFcmToken();

      const data = {
        password: password,
        email: email,
        userType: VARIABLES?.userType,
        deviceToken: deviceToken,
      };
      const response = await LoginApi(data);
      console.log('response', response);
      if (response?.responseCode === 200) {
        setLoading(false);
        ToastMessage(response?.responseMessage);
        props.navigation.replace('AppStackNavigator');
      } else {
        setLoading(false);
        ToastMessage(response?.data?.responseMessage);
      }
    }
  };

  /// for forgot password
  const handleForgotPassword = async email => {
    const checkRequiredEmail = () => {
      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailPattern.test(email.trim(email))) {
        ToastMessage(i18n.t('toastMessage.emailPattern'));
        return false;
      } else return true;
    };
    const isValid = checkRequiredEmail();
    if (isValid) {
      const data = {
        email: email.toLowerCase(),
        userType: VARIABLES?.userType,
      };
      console.log('data', data);
      const response = await ForgotPasswordApi(data);
      console.log('responsee', response);
      if (response?.responseCode === 200) {
        closeModal();
        ToastMessage('Password reset link has been sent to your email');
      } else {
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
        <ScrollView scrollEnabled={false}>
          <Text style={styles.detailText}>{i18n.t('details.enter3')}</Text>
          <Text style={styles.pleaseText}>{i18n.t('details.please2')}</Text>
          <TextInputWImage
            label={i18n.t('details.password')}
            secureTextEntry={passwordVisible ? true : false}
            rightImageVisible
            onPressEye={() => setPasswordVisible(!passwordVisible)}
            image={passwordVisible ? imagePath.closeEye : imagePath.eye}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={openModal}>
            <Text style={styles.forgotText}>{i18n.t('details.forgot')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <CustomButton
        title={i18n.t('details.continue')}
        imageRight={imagePath.Forward}
        // onPress={() => props.navigation.navigate('Home')}
        onPress={handleLogin}
      />
      <ForgotPassword
        visible={modalVisible}
        closeModal={closeModal}
        navigation={navigation}
        handleVerify={handleForgotPassword}
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
    lineHeight: 20,
    marginTop: 34,
    marginBottom: 42,
  },

  forgotText: {
    alignSelf: 'flex-end',
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS.black,
    lineHeight: 18,
  },
});
