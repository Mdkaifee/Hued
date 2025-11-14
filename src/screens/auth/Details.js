import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Dimensions,
  Image,
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
// import SelectDropdown from 'react-native-select-dropdown';
import GenderModal from '../../modals/GenderModal';
import {useNavigation} from '@react-navigation/native';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {getFcmToken} from '../../utils/notificationServices';
import { SafeAreaView } from 'react-native-safe-area-context';


const {height, width} = Dimensions.get('window');
export default function Details(props) {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [onSelect, setOnSelect] = useState(false);
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
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
      ToastMessage(i18n.t('toastMessage.name'));
      return false;
    } else if (username.trim() == '') {
      ToastMessage(i18n.t('toastMessage.userName'));
      return false;
    } else if (!emailPattern.test(email.trim())) {
      ToastMessage(i18n.t('toastMessage.emailPattern'));
      return false;
    } else if (gender.trim() == '') {
      ToastMessage(i18n.t('toastMessage.gender'));
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

  const handleGender = gender => {
    setGender(gender);
  };

  const handleSignUp = async () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      setLoading(true);
      const deviceToken = await getFcmToken();

      const data = {
        name: name.trim(),
        userName: username.trim(),
        email: email.trim(),
        gender: gender.toLowerCase(),
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
  console.log('genderrr', gender);
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{backgroundColor: COLORS.white, paddingHorizontal: 20}}>
      <CommonHeader imageLeft={imagePath.Back} />

      <View style={styles.mainView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 10}
          style={styles.contentContainer}>
          <Text style={styles.detailText}>{i18n.t('details.enter')}</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollviewstyle}>
            <Text style={styles.pleaseText}>{i18n.t('details.please')}</Text>

            <TextInputWithLabel
              label={i18n.t('details.name')}
              value={name}
              onChangeText={setName}
            />
            <TextInputWithLabel
              label={i18n.t('details.username')}
              value={username}
              onChangeText={setUsername}
            />
            <TextInputWithLabel
              label={i18n.t('details.email')}
              value={email}
              onChangeText={setEmail}
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
                {i18n.t('gender.genders')}
              </Text>
              <TouchableOpacity onPress={openModal}>
                <Text
                  style={[
                    Platform.OS === 'android'
                      ? styles.androidText
                      : styles.inputText,
                  ]}>
                  {gender}
                </Text>
              </TouchableOpacity>
            </View>

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
      <GenderModal
        visible={modalVisible}
        closeModal={closeModal}
        navigation={navigation}
        onSelectedGender={handleGender}
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
  scrollviewstyle: {
    paddingBottom: 30,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  labelText: {
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.lightBlack,
    marginBottom: 8,
  },
  dropdownStyle: {
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 5,
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
  androidtextInputViewButton: {
    height: 55,
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
  androidText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
    marginTop: 4,
  },
});
