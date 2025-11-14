import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import BaseView from '../../../../BaseView';
import ImagePicker from 'react-native-image-crop-picker';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
import CommonHeader from '../../../components/CommonHeader';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
import TextInputWithLabel from '../../../components/TextInputWLabel';
import CustomButton from '../../../components/CustomButtton';

import {EditProfileApi} from '../../../services/AuthApi';
import {VARIABLES} from '../../../utils/globalVariables';
import {ToastMessage} from '../../../components/ToastMessage';
import {EventRegister} from 'react-native-event-listeners';
import {registeredEvents} from '../../../utils/UserPrefs';
import Loader from '../../../components/Loader';
import FastImage from '@d11/react-native-fast-image';
// import FastImage from 'react-native-fast-image';
// import SelectDropdown from 'react-native-select-dropdown';
import addPhoto from '../../../utils/imageUpload';
import GenderModal from '../../../modals/GenderModal';
const {height, width} = Dimensions.get('window');

export default function EditProfile(props) {
  const userData = JSON.parse(VARIABLES.details);
  // console.log('detailsss', userData.userName);
  const [image, setImage] = useState(null);
  const genders = ['Male', 'Female', 'Non-binary'];

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const [name, setName] = useState(userData?.name);
  const [username, setUsername] = useState(userData?.userName);
  const [email, setEmail] = useState(userData?.email);
  const [gender, setGender] = useState(userData?.gender);
  // const [gender, setGender] = useState('Female');

  const [loading, setLoading] = useState(false);
  const checkUsername = userData?.userName;
  console.log('checkusername', checkUsername);
  const handleGender = gender => {
    setGender(gender);
  };

  const openImagePicker = async () => {
    try {
      const imageResult = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false,
      });

      const ensuredPath = imageResult?.path || '';
      const fileName =
        imageResult?.filename ||
        ensuredPath?.split('/')?.pop() ||
        `profile_${Date.now()}`;
      const ensuredUri = ensuredPath.startsWith('file://')
        ? ensuredPath
        : `file://${ensuredPath}`;

      setImage({
        uri: ensuredUri,
        type: imageResult?.mime || 'image/jpeg',
        name: fileName,
      });
      console.log('image1', imageResult);
    } catch (pickerError) {
      if (pickerError?.code !== 'E_PICKER_CANCELLED') {
        console.log('[EditProfile] image picker error:', pickerError);
        ToastMessage('Unable to select image. Please try again.');
      }
    }
  };
  console.log('image', image);

  // for validations
  const checkRequiredFields = () => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (name == '') {
      ToastMessage(i18n.t('toastMessage.name'));
      return false;
    } else if (username == '' || username == null) {
      ToastMessage(i18n.t('toastMessage.userName'));
      return false;
    } else if (gender == '') {
      ToastMessage(i18n.t('toastMessage.gender'));
      return false;
    } else if (!emailPattern.test(email.trim())) {
      ToastMessage(i18n.t('toastMessage.emailPattern'));
      return false;
    } else {
      return true;
    }
  };

  function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  // for editprofile api
  const handleSave = async () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      setLoading(true);
      try {
        let profilePicUrl = userData?.profilePic;

        if (image) {
          const file = image?.uri || '';
          const fileName = image?.name || `profile_${Date.now()}`;
          const bucket = 'uploads/hued';
          const uploadResult = await addPhoto(file, fileName, bucket, image?.type);
          console.log(';imggg', uploadResult);
          profilePicUrl = uploadResult?.Location || profilePicUrl;
        }
        console.log('coverdetttt', profilePicUrl);

        const data = {
          name: name,
          profilePic: profilePicUrl,
          gender: (gender || '').toLowerCase(),
          userName: checkUsername === username ? undefined : username,
        };
        console.log('data', data);

        const response = await EditProfileApi(data);
        console.log('response', response);
        if (response?.responseCode === 200) {
          EventRegister.emit(registeredEvents.EDIT_PROFILE);
          setTimeout(() => {
            props.navigation.goBack();
            ToastMessage(response?.responseMessage);
          }, 500);
        } else {
          ToastMessage(response?.data?.responseMessage || 'Unable to update profile.');
        }
      } catch (error) {
        console.log('[EditProfile] handleSave error:', error);
        ToastMessage('Unable to update profile. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  function capitalizeFirstLetter(text) {
    return text?.charAt(0).toUpperCase() + text?.slice(1);
  }
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
      }}>
      <CommonHeader title={i18n.t('edit.edit')} imageLeft={imagePath.Back} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 30}
        style={styles.contentContainer}>
        <View style={styles.mainView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30}}>
            <FastImage
              style={styles.img}
              source={
                !image && !userData.profilePic
                  ? imagePath.profile
                  : image && image?.uri
                  ? {uri: image?.uri, priority: FastImage.priority.high}
                  : userData.profilePic
                  ? {
                      uri: userData?.profilePic,
                      priority: FastImage.priority.high,
                    }
                  : imagePath.profile
              }
            />

            <TouchableOpacity onPress={openImagePicker}>
              <Text style={styles.nameText}>{i18n.t('edit.picture')}</Text>
            </TouchableOpacity>
            <TextInputWithLabel
              label={i18n.t('edit.name')}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.label}
              value={name}
              onChangeText={text => setName(text)}
            />
            <TextInputWithLabel
              label={i18n.t('edit.username')}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.label}
              value={username}
              onChangeText={text => setUsername(text)}
            />
            <TextInputWithLabel
              label={i18n.t('edit.email')}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle1}
              labelStyle={styles.label}
              value={email}
              onChangeText={text => setEmail(text)}
              editable={false}
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
                  {capitalizeFirstLetter(gender)}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <GenderModal
        visible={modalVisible}
        closeModal={closeModal}
        onSelectedGender={handleGender}
      />
      <CustomButton title={i18n.t('edit.save')} onPress={handleSave} />
      {loading && <Loader />}
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 10,
  },
  img: {
    height: 136,
    width: 136,
    alignSelf: 'center',
    borderRadius: 68,
    backgroundColor: COLORS.lightest,
  },
  nameText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.semiBold,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 46,
  },
  inputContainerStyle: {
    height: 40,
    borderBottomColor: COLORS.lightBorderLine,
  },
  inputStyle: {
    fontSize: FONT_SIZES.fourteen,
  },
  label: {
    marginTop: -4,
  },
  inputStyle1: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.lightBlack,
  },
  contentContainer: {
    flex: 1,
  },
  androidLabelButton: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.tenor,
    color: COLORS.lightText,
    lineHeight: 16,
    marginBottom: 2,
    marginTop: -4,
  },
  iosLabelButton: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.tenor,
    color: COLORS.lightText,
    lineHeight: 16,
    marginBottom: 7,
    marginTop: -4,
  },
  androidtextInputViewButton: {
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLine,
    marginBottom: 20,
    justifyContent: 'center',
    height: 40,
    borderBottomColor: COLORS.lightBorderLine,
  },
  iostextInputViewButton: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLine,
    marginBottom: 20,
    justifyContent: 'center',
    height: 40,
    borderBottomColor: COLORS.lightBorderLine,
  },
  inputText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.regular,
  },
  androidText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.regular,
    marginTop: 4,
  },
});
