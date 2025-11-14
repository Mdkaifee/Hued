import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import Loader from '../../../components/Loader';
import addPhoto from '../../../utils/imageUpload';
import YearModal from '../../../modals/YearModal';

export default function BrandEditProfile(props) {
  const userData = JSON.parse(VARIABLES.details);
  console.log('detailsss', userData.userName);
  const [image, setImage] = useState(null);
  const [name, setName] = useState(userData.name);
  const [year, setYear] = useState(userData.yearFounded);
  const [email, setEmail] = useState(userData.email);
  const [city, setCity] = useState(userData.city);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const handleYearPress = year => {
    setYear(year);
  };
  const checkUsername = userData.userName;
  console.log('checkusername', checkUsername);
  const openImagePicker = async () => {
    try {
      const imageResult = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
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
        console.log('[BrandEditProfile] image picker error:', pickerError);
        ToastMessage('Unable to select image. Please try again.');
      }
    }
  };
  console.log('image', image);

  // for validations
  const checkRequiredFields = () => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (name == '') {
      ToastMessage(i18n.t('toastMessage.bname'));
      return false;
    } else if (year == '') {
      ToastMessage(i18n.t('toastMessage.userName'));
      return false;
    } else if (city == '') {
      ToastMessage(i18n.t('toastMessage.city'));
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
          console.log('file,filename,bucket,imagetype',file, fileName, bucket, image?.type)
          const imageDetails = await addPhoto(file, fileName, bucket, image?.type);
          console.log(';imggg', imageDetails);
          profilePicUrl = imageDetails?.Location || profilePicUrl;
        }
        const data = {
          name: name,
          profilePic: profilePicUrl,
          city: (city || '').toLowerCase(),
          yearFounded: year,
        };
        console.log('data', data);
        const response = await EditProfileApi(data);
        console.log('response', response);
        if (response?.responseCode === 200) {
          setTimeout(() => {
            props.navigation.goBack();
            ToastMessage(response?.responseMessage);
          }, 500);
        } else {
          ToastMessage(response?.data?.responseMessage || 'Unable to update profile.');
        }
      } catch (error) {
        console.log('[BrandEditProfile] handleSave error:', error);
        ToastMessage('Unable to update profile. Please try again.');
      } finally {
        setLoading(false);
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
      <CommonHeader title={i18n.t('edit.edit')} imageLeft={imagePath.Back} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 30}
        style={styles.contentContainer}>
        <View style={styles.mainView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30}}>
            <Image
              style={styles.img}
              source={
                !image && !userData.profilePic
                  ? imagePath.profile
                  : image && image?.uri
                  ? {uri: image?.uri}
                  : userData.profilePic
                  ? {uri: userData?.profilePic}
                  : imagePath.profile
              }
            />
            <TouchableOpacity onPress={openImagePicker}>
              <Text style={styles.nameText}>{i18n.t('edit.picture')}</Text>
            </TouchableOpacity>
            <TextInputWithLabel
              label={i18n.t('details.brand')}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.label}
              value={name}
              onChangeText={text => setName(text)}
            />
            {/* <TextInputWithLabel
              label={i18n.t('details.year')}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.label}
              value={year}
              onChangeText={text => setYear(text)}
            /> */}

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
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.label}
              value={capitalizeFirstLetter(city)}
              onChangeText={text => setCity(text)}
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
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <YearModal
        visible={modalVisible}
        closeModal={closeModal}
        onSelectedYear={handleYearPress}
      />
      <CustomButton title={i18n.t('edit.save')} onPress={handleSave} />
      {loading && <Loader />}
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 40,
  },
  img: {
    height: 136,
    width: 136,
    alignSelf: 'center',
    borderRadius: 68,
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
  androidtextInputViewButton: {
    height: 47,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorderLine,
    marginBottom: 20,
    justifyContent: 'center',
    marginTop: -8,
  },
  iostextInputViewButton: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorderLine,
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
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.regular,
    marginTop: 4,
  },
});
