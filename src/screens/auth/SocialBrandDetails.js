import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import React, {useState} from 'react';
import BaseView from '../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../utils/constants';
import imagePath from '../../utils/imagePath';
import i18n from '../../translation/i18n';
// import {ScrollView} from 'react-native-gesture-handler';
import TextInputWithLabel from '../../components/TextInputWLabel';
// import TextInputWImage from '../../components/TextInputWImage';
import CustomButton from '../../components/CustomButtton';
import CommonHeader from '../../components/CommonHeader';
import Loader from '../../components/Loader';
import {VARIABLES} from '../../utils/globalVariables';
import {ToastMessage} from '../../components/ToastMessage';
import {EditProfileApi} from '../../services/AuthApi';
import YearModal from '../../modals/YearModal';
// import {TouchableOpacity} from '@gorhom/bottom-sheet';

export default function SocialBrandDetails(props) {
  const userDetails = JSON.parse(VARIABLES.details);
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  // console.log('userdeeets', userDetails);
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState(userDetails?.email);
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const checkRequiredFields = () => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (name.trim() == '') {
      ToastMessage(i18n.t('toastMessage.Brandname'));
      return false;
    } else if (year == '') {
      ToastMessage(i18n.t('toastMessage.year'));
      return false;
    } else if (city.trim() == '') {
      ToastMessage(i18n.t('toastMessage.city'));
      return false;
    } else if (!emailPattern.test(email.trim())) {
      ToastMessage(i18n.t('toastMessage.emailPattern'));
      return false;
    } else {
      return true;
    }
  };

  const handleYearPress = year => {
    setYear(year);
  };
  const handleBrandDetails = async () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      // setLoading(true);
      const data = {
        name: name,
        yearFounded: year,
        city: city,
        profileComplete: true,
        email: userDetails?.type === 'apple' ? email : undefined,
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
            <TextInputWithLabel
              label={i18n.t('details.brand')}
              value={name}
              onChangeText={setName}
              labelStyle={{marginTop: 10}}
              inputContainerStyle={{height: 50, marginBottom: 14}}
              inputStyle={{marginTop: -4}}
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
              editable={userDetails?.type === 'apple' ? true : false}
              inputStyle={{
                color:
                  userDetails?.type === 'apple'
                    ? COLORS.black
                    : COLORS.lightBlack,
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <CustomButton
        style={styles.button}
        title={i18n.t('details.continue')}
        imageRight={imagePath.Forward}
        onPress={handleBrandDetails}
      />
      {loading && <Loader />}
      <YearModal
        visible={modalVisible}
        closeModal={closeModal}
        onSelectedYear={handleYearPress}
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
    marginBottom: 40,
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
    height: 52,
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
    marginBottom: -2,
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
    marginTop: 8,
  },
});
