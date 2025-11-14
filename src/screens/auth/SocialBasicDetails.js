import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import BaseView from '../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../utils/constants';
import imagePath from '../../utils/imagePath';
import i18n from '../../translation/i18n';
import {ScrollView} from 'react-native-gesture-handler';
import TextInputWithLabel from '../../components/TextInputWLabel';
import TextInputWImage from '../../components/TextInputWImage';
import CustomButton from '../../components/CustomButtton';
import CommonHeader from '../../components/CommonHeader';
import Loader from '../../components/Loader';
import {VARIABLES} from '../../utils/globalVariables';
import {ToastMessage} from '../../components/ToastMessage';
import {EditProfileApi} from '../../services/AuthApi';
const {height, width} = Dimensions.get('window');
// import SelectDropdown from 'react-native-select-dropdown';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import GenderModal from '../../modals/GenderModal';

export default function SocialBasicDetails(props) {
  const userDetails = JSON.parse(VARIABLES.details);
  //   console.log('userdeeets', userDetails);
  const genders = ['Male', 'Female', 'Non-binary'];
  const userType = VARIABLES?.userType;
  const [onSelect, setOnSelect] = useState(false);
  console.log('USERTYPEAFTERSOCIALLOGIN', userType);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(userDetails?.email);
  const [gender, setGender] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const [loading, setLoading] = useState(false);
  const checkUsername = userDetails?.userName;
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
    } else {
      return true;
    }
  };

  const handleBasicDetails = async () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      setLoading(true);
      const data = {
        name: name.trim(),
        userName: checkUsername === username ? undefined : username.trim(),
        profileComplete: true,
        gender: gender.toLowerCase(),
        email: userDetails?.type === 'apple' ? email.trim() : undefined,
      };

      const response = await EditProfileApi(data);
      console.log('responsefromsocialbasic', response);
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

  const handleGender = gender => {
    setGender(gender);
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 60}
          style={styles.contentContainer}>
          <Text style={styles.detailText}>{i18n.t('details.enter')}</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20, paddingTop: 20}}>
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
              editable={userDetails?.type === 'apple' ? true : false}
              inputStyle={{
                color:
                  userDetails?.type === 'apple'
                    ? COLORS.black
                    : COLORS.lightBlack,
              }}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <GenderModal
        visible={modalVisible}
        closeModal={closeModal}
        onSelectedGender={handleGender}
      />
      <CustomButton
        style={styles.button}
        title={i18n.t('details.continue')}
        imageRight={imagePath.Forward}
        onPress={handleBasicDetails}
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
    marginBottom: 40,
  },
  // pleaseText: {
  //   fontSize: FONT_SIZES.fourteen,
  //   fontFamily: FONT_FAMILIES.regular,
  //   color: COLORS.lightBlack,
  //   lineHeight: 24,
  //   marginTop: 34,
  //   marginBottom: 36,
  // },
  contentContainer: {
    flex: 1,
  },

  button: {
    marginTop: 20,
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
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.regular,
  },
  androidLabelButton: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.tenor,
    color: COLORS.lightText,
    lineHeight: 16,
    marginBottom: 2,
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
    marginTop: 6,
  },
});
