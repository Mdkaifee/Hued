import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import imagePath from '../../utils/imagePath';
import i18n from '../../translation/i18n';
import {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  SCREEN_HEIGHT,
} from '../../utils/constants';
import CustomButton from '../../components/CustomButtton';
import BaseView2 from '../../../BaseView2';
export default function Onboarding(props) {
  return (
    <BaseView2
      safeView={{backgroundColor: 'transparent'}}
      topView={{flex: 0, backgroundColor: 'transparent'}}
      baseViewStyle={{backgroundColor: 'transparent'}}>
      <View style={styles.mainView}>
        <Image style={{marginBottom: 20}} source={imagePath.brownImg} />
        <Text style={styles.findText}>{i18n.t('onboarding.find')}</Text>
        <Text style={styles.thereText}>{i18n.t('onboarding.there')}</Text>
      </View>
      <View style={styles.button}>
        <CustomButton
          imageRight={imagePath.Forward}
          title={i18n.t('onboarding.get')}
          onPress={() => props.navigation.navigate('WalkThrough')}
        />
      </View>
    </BaseView2>
  );
}

const styles = StyleSheet.create({
  imgbg: {
    flex: 1,
  },
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  findText: {
    fontSize: FONT_SIZES.twentyEight,
    fontFamily: FONT_FAMILIES.prata,
    color: COLORS.black,
    lineHeight: 38,
    textAlign: 'center',
    paddingHorizontal: 45,
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  thereText: {
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.textBlack,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

// import {Image, StyleSheet, Text, View, Alert} from 'react-native';
// import React from 'react';

// import imagePath from '../../utils/imagePath';
// import i18n from '../../translation/i18n';
// import {COLORS, FONT_FAMILIES, FONT_SIZES, SCREEN_HEIGHT} from '../../utils/constants';
// import CustomButton from '../../components/CustomButtton';
// import BaseView2 from '../../../BaseView2';

// import crashlytics from '@react-native-firebase/crashlytics';

// export default function Onboarding(props) {
//   const handleTestCrash = async () => {
//     console.log('[Onboarding] test crash pressed');

//     try {
//       const clx = crashlytics();
//       clx.log('Manual test crash from Onboarding screen');
//       await clx.setAttributes({screen: 'Onboarding', trigger: 'cta'});

//       if (!clx.isCrashlyticsCollectionEnabled) {
//         Alert.alert(
//           'Crashlytics disabled',
//           'Enable crashlytics_debug_enabled in firebase.json or run a release build to test native crashes. Falling back to a JS crash now.'
//         );

//         setTimeout(() => {
//           throw new Error('Forced JS crash from Onboarding (debug fallback)');
//         }, 500);

//         return;
//       }

//       Alert.alert('Test', 'Triggering Crashlytics native crash...');
//       setTimeout(() => {
//         clx.crash();
//       }, 500);
//     } catch (error) {
//       console.log('[Onboarding] Crashlytics module not ready, forcing JS crash fallback', error);
//       setTimeout(() => {
//         throw new Error('Forced JS crash from Onboarding (module fallback)');
//       }, 500);
//     }
//   };

//   return (
//     <BaseView2
//       safeView={{backgroundColor: 'transparent'}}
//       topView={{flex: 0, backgroundColor: 'transparent'}}
//       baseViewStyle={{backgroundColor: 'transparent'}}>
//       <View style={styles.mainView}>
//         <Image style={{marginBottom: 20}} source={imagePath.brownImg} />
//         <Text style={styles.findText}>{i18n.t('onboarding.find')}</Text>
//         <Text style={styles.thereText}>{i18n.t('onboarding.there')}</Text>
//       </View>
//       <View style={styles.button}>
//         <CustomButton
//           imageRight={imagePath.Forward}
//           title={i18n.t('onboarding.get')}
//           onPress={handleTestCrash}
//         />
//       </View>
//     </BaseView2>
//   );
// }

// const styles = StyleSheet.create({
//   imgbg: {flex: 1},
//   mainView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
//   findText: {
//     fontSize: FONT_SIZES.twentyEight,
//     fontFamily: FONT_FAMILIES.prata,
//     color: COLORS.black,
//     lineHeight: 38,
//     textAlign: 'center',
//     paddingHorizontal: 45,
//     marginTop: SCREEN_HEIGHT * 0.01,
//   },
//   thereText: {
//     fontSize: FONT_SIZES.sixteen,
//     fontFamily: FONT_FAMILIES.regular,
//     color: COLORS.textBlack,
//     lineHeight: 20,
//     textAlign: 'center',
//     paddingHorizontal: 40,
//     marginTop: 20,
//   },
//   button: {paddingHorizontal: 20, marginBottom: 20},
// });
