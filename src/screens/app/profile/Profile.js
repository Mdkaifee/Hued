import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseView from '../../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
import CommonHeader from '../../../components/CommonHeader';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
import Logout from '../../../modals/Logout';

import {VARIABLES} from '../../../utils/globalVariables';
import {
  clearAllPreferences,
  registeredEvents,
  removeToken,
} from '../../../utils/UserPrefs';
import {ToastMessage} from '../../../components/ToastMessage';
import {EventRegister} from 'react-native-event-listeners';
// import FastImage from 'react-native-fast-image';
import FastImage from '@d11/react-native-fast-image';
import DeleteModalCollection from '../../../modals/DeleteModalCollection';
import {deleteAccountApi} from '../../../services/AppApi';
import Loader from '../../../components/Loader';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LogoutApi} from '../../../services/AuthApi';

export default function Profile(props) {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  const [userData, setUserData] = useState(
    VARIABLES.details && JSON.parse(VARIABLES.details),
  );

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '315893915016-hp71ctp2m4egs3agc362e99kli8vjmqd.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
      iosClientId:
        '315893915016-1mh1kmjf1nn4e2j9jvdmp1923e3930br.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });
  }, []);
  console.log('userData', userData);
  useEffect(() => {
    EventRegister.addEventListener(registeredEvents.EDIT_PROFILE, () => {
      setUserData(JSON.parse(VARIABLES.details));
    });
    return () => {
      EventRegister.removeEventListener(registeredEvents.EDIT_PROFILE);
    };
  }, []);

  const {navigation} = props;
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const openDeleteModal = () => {
    setModalDeleteVisible(true);
  };
  const closeDeleteModal = () => {
    setModalDeleteVisible(false);
  };

  const userType = VARIABLES.userType;

  const handleEditProfile = () => {
    if (userType === 'brand') {
      props.navigation.navigate('BrandEditProfile');
      console.log('editing account as:', userType);
    } else {
      props.navigation.navigate('EditProfile');
      console.log('editing account as:', userType);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const response = await deleteAccountApi();
    console.log('deleteaccount', response);
    if (response?.responseCode === 200) {
      setLoading(false);
      removeToken();
      clearAllPreferences();
      VARIABLES.details = '';

      setTimeout(() => {
        props.navigation.reset({
          index: 0,
          routes: [
            {name: 'AuthStackNavigator', params: {screen: 'ContinueAs'}},
          ],
        });
        ToastMessage(response?.responseMessage);
      }, 1000);
    } else {
      setLoading(false);

      ToastMessage('Something went wrong. Please try again later');
    }
  };
  const handleLogout = async () => {
    try {
      if (userData?.type === 'google' && Platform.OS === 'android') {
        console.log('dhjhcjddjjdj');
        closeModal();
        setTimeout(async () => {
          await GoogleSignin.signOut();
          const response = await LogoutApi();
          console.log('responseeefromlogout', response);
          if (response?.responseCode === 200) {
            removeToken();
            clearAllPreferences();
            VARIABLES.details = '';

            props.navigation.reset({
              index: 0,
              routes: [
                {name: 'AuthStackNavigator', params: {screen: 'ContinueAs'}},
              ],
            });
            ToastMessage('Logged out Successfully');
          } else {
            ToastMessage(response?.data?.responseMessage);
          }
        }, 700);
      } else {
        closeModal();
        const response = await LogoutApi();
        console.log('responseeefromlogout', response);
        if (response?.responseCode === 200) {
          removeToken();
          clearAllPreferences();
          VARIABLES.details = '';
          setTimeout(() => {
            props.navigation.reset({
              index: 0,
              routes: [
                {name: 'AuthStackNavigator', params: {screen: 'ContinueAs'}},
              ],
            });
            ToastMessage('Logged out Successfully');
          }, 1000);
        } else {
          ToastMessage(response?.data?.responseMessage);
        }
      }
    } catch (error) {
      closeModal();
      ToastMessage('Something went wrong. Please try again later');
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
      <CommonHeader title={i18n.t('profile.profile')} />
      <View style={styles.mainView}>
        <FastImage
          style={styles.img}
          source={
            !userData?.profilePic
              ? imagePath.profile
              : {uri: userData?.profilePic, priority: FastImage.priority.high}
          }
        />

        <Text style={styles.nameText}>{userData.name}</Text>
        <Text style={styles.userNameText}>
          {VARIABLES.userType === 'user' ? userData.userName : ''}
        </Text>
        <View style={styles.cardView}>
          <TouchableOpacity
            style={styles.commonContainer}
            onPress={handleEditProfile}>
            <View style={styles.imgTextview}>
              <Image source={imagePath.edit} />
              <Text style={styles.text}>{i18n.t('profile.edit')}</Text>
            </View>
            <Image source={imagePath.smallArrow} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.commonContainer}
            onPress={() => props.navigation.navigate('Favourites')}>
            <View style={styles.imgTextview}>
              <Image source={imagePath.fav} />
              <Text style={styles.text}>{i18n.t('profile.fav')}</Text>
            </View>
            <Image source={imagePath.smallArrow} />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.commonContainer}
            onPress={() => props.navigation.navigate('TermsAndConditions')}>
            <View style={styles.imgTextview}>
              <Image source={imagePath.term} />
              <Text style={styles.text}>{i18n.t('profile.terms')}</Text>
            </View>
            <Image source={imagePath.smallArrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.commonContainer}
            onPress={() => props.navigation.navigate('ContactUs')}>
            <View style={styles.imgTextview}>
              <Image source={imagePath.call} />
              <Text style={styles.text}>{i18n.t('profile.contact')}</Text>
            </View>
            <Image source={imagePath.smallArrow} />
          </TouchableOpacity>
          {!(userData?.type === 'google' || userData?.type === 'apple') && (
            <TouchableOpacity
              style={styles.commonContainer}
              onPress={() => props.navigation.navigate('ChangePass')}>
              <View style={styles.imgTextview}>
                <Image source={imagePath.lock} />
                <Text style={styles.text}>{i18n.t('profile.change')}</Text>
              </View>
              <Image source={imagePath.smallArrow} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.commonContainer}
            onPress={openDeleteModal}>
            <View style={styles.imgTextview}>
              <Image source={imagePath.bin} />
              <Text style={styles.text}>{i18n.t('profile.dele')}</Text>
            </View>
            <Image source={imagePath.smallArrow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.commonContainer2} onPress={openModal}>
            <View style={styles.imgTextview}>
              <Image source={imagePath.logout} />
              <Text style={styles.text}>{i18n.t('profile.logout')}</Text>
            </View>
            <Image source={imagePath.smallArrow} />
          </TouchableOpacity>
        </View>
      </View>
      <Logout
        visible={modalVisible}
        closeModal={closeModal}
        navigation={navigation}
        handleVerify={handleLogout}
      />
      <DeleteModalCollection
        visible={modalDeleteVisible}
        closeModal={closeDeleteModal}
        navigation={navigation}
        text1={i18n.t('profile.dele')}
        text={i18n.t('profile.are')}
        handleVerify={handleDeleteAccount}
      />
      {loading && <Loader />}
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 20,
  },
  img: {
    height: 136,
    width: 136,
    borderRadius: 68,
    alignSelf: 'center',
    backgroundColor: '#ededed',
  },
  nameText: {
    fontSize: FONT_SIZES.twentyTwo,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.bold,
    lineHeight: 28,
    textAlign: 'center',
    marginTop: 22,
  },
  userNameText: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 18,
    textAlign: 'center',
  },
  cardView: {
    backgroundColor: COLORS.transparent,
    marginTop: 28,
    // shadowColor: '#8b8c8f',
    // shadowOffset: {width: 2, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: 6,
    // elevation: 10,
    padding: 12,
    borderRadius: 14,
    // height: 284,
  },
  commonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  commonContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imgTextview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 18,
  },
});
