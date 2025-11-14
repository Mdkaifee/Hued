import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import BaseView from '../../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
import CommonHeader from '../../../components/CommonHeader';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
import TextInputWithLabel from '../../../components/TextInputWLabel';
import CustomButton from '../../../components/CustomButtton';
import {ChangePasswordApi} from '../../../services/AuthApi';
import {ToastMessage} from '../../../components/ToastMessage';
import TextInputWImage from '../../../components/TextInputWImage';
import Loader from '../../../components/Loader';

export default function ChangePass(props) {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [newPasswordVisible, setNewPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const checkRequiredFields = () => {
    if (oldPassword.trim() == '') {
      ToastMessage(i18n.t('toastMessage.oldPassword'));
      return false;
    } else if (oldPassword.length < 6) {
      ToastMessage(i18n.t('toastMessage.oldpasswordLength'));
      return false;
    }
    if (newPassword.trim() == '') {
      ToastMessage(i18n.t('toastMessage.newPassword'));
      return false;
    } else if (newPassword.length < 6) {
      ToastMessage(i18n.t('toastMessage.passwordLength'));
      return false;
    } else if (confirmPassword !== newPassword) {
      ToastMessage(i18n.t('toastMessage.passwordMismatch'));
      return false;
    } else {
      return true;
    }
  };

  const handleChangePass = async () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      setLoading(true);
      const data = {
        oldPassword: oldPassword,
        password: newPassword,
      };
      console.log('data', data);
      const response = await ChangePasswordApi(data);
      console.log('response', response);
      if (response?.responseCode === 200) {
        setLoading(false);
        setTimeout(() => {
          props.navigation.goBack();
          ToastMessage(response?.responseMessage);
        }, 1000);
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
      baseViewStyle={{
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
      }}>
      <CommonHeader
        title={i18n.t('change.change')}
        imageLeft={imagePath.Back}
      />
      <View style={styles.mainView}>
        <ScrollView scrollEnabled={false}>
          <TextInputWImage
            label={i18n.t('change.old')}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputText}
            value={oldPassword}
            onChangeText={text => setOldPassword(text)}
            secureTextEntry={passwordVisible ? true : false}
            rightImageVisible
            onPressEye={() => setPasswordVisible(!passwordVisible)}
            image={passwordVisible ? imagePath.closeEye : imagePath.eye}
          />
          <TextInputWImage
            label={i18n.t('change.new')}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputText}
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
            secureTextEntry={newPasswordVisible ? true : false}
            rightImageVisible
            onPressEye={() => setNewPasswordVisible(!newPasswordVisible)}
            image={newPasswordVisible ? imagePath.closeEye : imagePath.eye}
          />
          <TextInputWImage
            label={i18n.t('change.confirm')}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputText}
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            secureTextEntry={confirmPasswordVisible ? true : false}
            rightImageVisible
            onPressEye={() =>
              setConfirmPasswordVisible(!confirmPasswordVisible)
            }
            image={confirmPasswordVisible ? imagePath.closeEye : imagePath.eye}
          />
        </ScrollView>
      </View>
      <CustomButton
        title={i18n.t('change.change')}
        onPress={handleChangePass}
      />
      {loading && <Loader />}
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    marginTop: 24,
    flex: 1,
  },
  leaveText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 21,
    marginBottom: 30,
  },
  inputContainerStyle: {
    borderBottomColor: '#D4D4D4',
  },
  inputText: {
    fontSize: FONT_SIZES.fourteen,
    marginTop: 2,
  },
});
