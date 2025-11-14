// import React, { useCallback, useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Linking, Pressable } from 'react-native';
// import InAppBrowser from 'react-native-inappbrowser-reborn';

// import BaseView from '../../../../BaseView';
// import CommonHeader from '../../../components/CommonHeader';
// import imagePath from '../../../utils/imagePath';
// import { COLORS } from '../../../utils/constants';
// import i18n from '../../../translation/i18n';

// const TERMS_URL = 'https://api.hued.info/termsAndCondition';

// export default function TermsAndConditions() {
//   const [opened, setOpened] = useState(false);

//   const openTerms = useCallback(async () => {
//     try {
//       const available = await InAppBrowser.isAvailable();
//       if (available) {
//         setOpened(true);
//         await InAppBrowser.open(TERMS_URL, {
//           // iOS
//           dismissButtonStyle: 'done',
//           preferredBarTintColor: COLORS.white,
//           preferredControlTintColor: COLORS.black,
//           // Android
//           showTitle: true,
//           toolbarColor: COLORS.white,
//           secondaryToolbarColor: COLORS.white,
//           enableUrlBarHiding: true,
//           enableDefaultShare: true,
//           forceCloseOnRedirection: false,
//         });
//       } else {
//         // Fallback: open with system browser
//         await Linking.openURL(TERMS_URL);
//       }
//     } catch (e) {
//       // Final fallback
//       try {
//         await Linking.openURL(TERMS_URL);
//       } catch {}
//     }
//   }, []);

//   useEffect(() => {
//     // Open automatically like your embedded WebView did
//     openTerms();
//   }, [openTerms]);

//   return (
//     <BaseView
//       safeView={{ backgroundColor: COLORS.white }}
//       topView={{ flex: 0, backgroundColor: COLORS.white }}
//       baseViewStyle={{ backgroundColor: COLORS.white, paddingHorizontal: 20 }}
//     >
//       <CommonHeader imageLeft={imagePath.Back} title={i18n.t('profile.terms')} />

//       {/* Simple fallback UI in case the in-app browser was dismissed or failed */}
//       <View style={styles.content}>
//         <Text style={styles.description}>
//           {opened
//             ? i18n.t('common.browserDismissed') || 'You closed the in-app browser.'
//             : i18n.t('common.opening') || 'Opening Terms & Conditions…'}
//         </Text>

//         <Pressable onPress={openTerms} style={styles.button}>
//           <Text style={styles.buttonText}>
//             {i18n.t('common.openAgain') || 'Open Terms Again'}
//           </Text>
//         </Pressable>
//       </View>
//     </BaseView>
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     flex: 1,
//     paddingTop: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12,
//   },
//   description: {
//     color: COLORS.black,
//     opacity: 0.7,
//     textAlign: 'center',
//   },
//   button: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//     backgroundColor: COLORS.black,
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontWeight: '600',
//   },
// });


import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BaseView from '../../../../BaseView';
import CommonHeader from '../../../components/CommonHeader';
import imagePath from '../../../utils/imagePath';
import {COLORS} from '../../../utils/constants';
import i18n from '../../../translation/i18n';
import WebView from 'react-native-webview';
export default function TermsAndConditions() {
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
      }}>
      <CommonHeader
        imageLeft={imagePath.Back}
        title={i18n.t('profile.terms')}
      />
      {/* <View style={{marginTop: 24}}> */}
      <WebView
        source={{uri: 'https://api.hued.info/termsAndCondition'}}
        style={{flex: 1}}
      />

      {/* <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum is simply dummy text of the printing
          and typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of
          the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, Lorem Ipsum is
          simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the industry's standard dummy text ever since the
          1500s, Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum is simply dummy text of the printing
          and typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s Lorem Ipsum is simply dummy text of
          the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s. Lorem Ipsum is
          simply dummy text of the printing and typesetting industry. Lorem
          Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum is simply dummy text of the printing
          and typesetting industry. Lorem Ipsum is simply dummy text of the
          printing and typesetting industry. Lorem Ipsum is simply dummy text of
          the printing and typesetting industry. Lorem Ipsum is simply dummy
          text of the printing and typesetting industry. Lorem Ipsum is simply
          dummy text of the printing and typesetting industry. Lorem Ipsum is
          simply dummy text of the printing and typesetting industry. Lorem
          Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </Text> */}
      {/* </View> */}
    </BaseView>
  );
}

const styles = StyleSheet.create({});
