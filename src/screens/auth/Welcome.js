import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseView from '../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../utils/constants';
import imagePath from '../../utils/imagePath';
import i18n from '../../translation/i18n';
import ContinueWithComponent from '../../components/ContinuewithComponent';
import {VARIABLES} from '../../utils/globalVariables';
import { SafeAreaView } from 'react-native-safe-area-context';
import {AppleButton} from '@invertase/react-native-apple-authentication';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
  getData,
  registeredEvents,
  saveData,
  saveToken,
} from '../../utils/UserPrefs';
import {SocialLoginApi, SocialLoginBrandApi} from '../../services/AuthApi';
import {ToastMessage} from '../../components/ToastMessage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {getFcmToken} from '../../utils/notificationServices';

export default function Welcome(props) {
  const [loading, setLoading] = useState(false);
  const userType = VARIABLES.userType;
  console.log(userType);
  const handleContinueWithBrand = () => {
    if (userType === 'brand') {
      props.navigation.navigate('BrandDetails');
      console.log('making account as:', userType);
    } else {
      props.navigation.navigate('Details');
      console.log('making account as:', userType);
    }
  };
  const handleContinueWithEmail = () => {
    if (userType === 'brand') {
      props.navigation.navigate('EmailScreen');
      console.log('making account as:', userType);
    } else {
      props.navigation.navigate('EmailScreen');
      console.log('making account as:', userType);
    }
  };

  const handleAppleLogin = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,

      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    console.log('apple signin', appleAuthRequestResponse);
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      if (appleAuthRequestResponse.email !== null) {
        saveData(registeredEvents.APPLE_EMAIL, appleAuthRequestResponse.email);
      }
      const email = await getData(registeredEvents.APPLE_EMAIL);
      console.log('emailfromApple', email);
      const deviceToken = await getFcmToken();
      const data = {
        email: email != null ? JSON.parse(email) : '',
        socialId: appleAuthRequestResponse.user,
        type: 'apple',
        deviceType: 'ios',
        userType: userType,
        lat: VARIABLES?.lat === null ? 0 : VARIABLES?.lat,
        long: VARIABLES?.long === null ? 0 : VARIABLES?.long,
        deviceToken: deviceToken,
      };
      console.log('datasendingfromApple', data);

      console.log('usertypoe', userType);
      if (userType === 'user') {
        const response = await SocialLoginApi(data);
        console.log('responsefromAppleSociallogin', response);
        if (response?.responseCode === 200) {
          setLoading(false);
          if (response?.result?.profileComplete === false) {
            props.navigation.navigate('SocialBasicDetails');
          } else {
            props?.navigation?.replace('AppStackNavigator');
          }
        } else {
          setLoading(false);
          ToastMessage(response?.data?.responseMessage);
        }
      } else {
        const response = await SocialLoginBrandApi(data);
        console.log('responsefromAppleSocialloginBRAND', response);
        if (response?.responseCode === 200) {
          setLoading(false);
          if (response?.result?.profileComplete === false) {
            props.navigation.navigate('SocialBrandDetails');
          } else {
            props?.navigation?.replace('AppStackNavigator');
          }
        } else {
          setLoading(false);
          ToastMessage(response?.data?.responseMessage);
        }
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '315893915016-hp71ctp2m4egs3agc362e99kli8vjmqd.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
      iosClientId:
        '315893915016-1mh1kmjf1nn4e2j9jvdmp1923e3930br.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });
  }, []);

  // Somewhere in your code
  const handleGoogleSignIn = async () => {
    await GoogleSignin.signOut();
    setTimeout(async () => {
      try {
        setLoading(true);
        await GoogleSignin.hasPlayServices();

        const userInfo = await GoogleSignin.signIn();
        console.log('userInfogoogle', userInfo);

        const googleProfile = userInfo?.user ?? userInfo?.data?.user;
        if (!googleProfile?.email || !googleProfile?.id) {
          setLoading(false);
          ToastMessage('Unable to read Google account details. Please try again.');
          return;
        }
        const deviceToken = await getFcmToken();

        const data = {
          email: googleProfile.email,
          socialId: googleProfile.id,
          type: 'google',
          deviceType: Platform.OS === 'ios' ? 'ios' : 'android',
          userType: userType,
          lat: VARIABLES?.lat === null ? 0 : VARIABLES?.lat,
          long: VARIABLES?.long === null ? 0 : VARIABLES?.long,
          deviceToken: deviceToken,
        };
        console.log('datafromgoogle', data);
        console.log('usertypoe', userType);
        if (userType === 'user') {
          const response = await SocialLoginApi(data);
          console.log('responsefromgoogleSociallogin', response);
          if (response?.responseCode === 200) {
            setLoading(false);
            if (response?.result?.profileComplete === false) {
              props.navigation.navigate('SocialBasicDetails');
            } else {
              props?.navigation?.replace('AppStackNavigator');
            }
          } else {
            await GoogleSignin.signOut();
            setLoading(false);
            ToastMessage(response?.data?.responseMessage);
          }
        } else {
          const response = await SocialLoginBrandApi(data);
          console.log('responsefromgoogleSocialloginBRAND', response);
          if (response?.responseCode === 200) {
            setLoading(false);
            if (response?.result?.profileComplete === false) {
              props.navigation.navigate('SocialBrandDetails');
            } else {
              props?.navigation?.replace('AppStackNavigator');
            }
          } else {
            await GoogleSignin.signOut();
            setLoading(false);

            ToastMessage(response?.data?.responseMessage);
          }
        }
      } catch (error) {
        setLoading(false);

        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          console.log('errorgoogle', error);
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
          console.log('errorgoogle', error);
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          console.log('errorgoogle', error);
        } else {
          console.log('errorgoogle', error);

          // some other error happened
        }
      }
    }, 500);
  };

  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{backgroundColor: COLORS.white, paddingHorizontal: 20}}>
      <View style={styles.mainView}>
        <Text style={styles.welcomeText}>{i18n.t('welcome.welcome')}</Text>

        {Platform.OS === 'ios' && (
          <ContinueWithComponent
            image={imagePath.Apple}
            title={i18n.t('welcome.apple')}
            onPress={() => handleAppleLogin()}
          />
        )}

        <ContinueWithComponent
          image={imagePath.Google}
          title={i18n.t('welcome.google')}
          onPress={handleGoogleSignIn}
        />
        <ContinueWithComponent
          image={imagePath.Facebook}
          title={i18n.t('welcome.facebook')}
        />
        <ContinueWithComponent
          image={imagePath.TikTok}
          title={i18n.t('welcome.tiktok')}
        />

        <View style={styles.orView}>
          <View style={styles.lineView} />
          <Text style={styles.orText}>{i18n.t('welcome.or')}</Text>
          <View style={styles.lineView} />
        </View>
        <ContinueWithComponent
          image={imagePath.Mail}
          title={i18n.t('welcome.email')}
          onPress={handleContinueWithEmail}
        />
      </View>
      {/* <View style={styles.dontView}>
        <Text style={styles.dontText}>{i18n.t('welcome.dont')}</Text>
        <TouchableOpacity
          style={styles.signView}
          onPress={handleContinueWithBrand}>
          <Text style={styles.signText}>{i18n.t('welcome.signup')}</Text>
        </TouchableOpacity>
      </View> */}
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.white }}>
  <View style={styles.dontView}>
    <Text style={styles.dontText}>{i18n.t('welcome.dont')}</Text>
    <TouchableOpacity
      style={styles.signView}
      onPress={handleContinueWithBrand}>
      <Text style={styles.signText}>{i18n.t('welcome.signup')}</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  welcomeText: {
    fontSize: FONT_SIZES.thirtyFour,
    fontFamily: FONT_FAMILIES.prata,
    color: COLORS.black,
    lineHeight: 48,
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
    marginBottom: 50,
  },
  orView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 22,
    marginTop: 2,
  },
  lineView: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flex: 1,
  },
  orText: {
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.lightBlack,
  },
  dontView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginBottom: 20,
  },
  dontText: {
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.black,
    lineHeight: 20,
  },
  signText: {
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS.primary,
    lineHeight: 20,
  },
});
