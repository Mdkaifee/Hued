import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';

import AsyncStorage from './AsyncStorage.js';

const FALLBACK_DEVICE_TOKEN = 'local-device-token';

const hasMessagingSupport = typeof messaging === 'function';

const isAuthorizationEnabled = authStatus => {
  if (!hasMessagingSupport) {
    return true;
  }

  const { AuthorizationStatus } = messaging;
  return (
    authStatus === AuthorizationStatus?.AUTHORIZED ||
    authStatus === AuthorizationStatus?.PROVISIONAL
  );
};

export default async function requestUserPermission() {
  if (!hasMessagingSupport) {
    return FALLBACK_DEVICE_TOKEN;
  }

  const authStatus = await messaging().requestPermission();
  if (isAuthorizationEnabled(authStatus)) {
    console.log('Authorization status:', authStatus);
    return getFcmToken();
  }

  return FALLBACK_DEVICE_TOKEN;
}

// async function requestAndroidNotificationPermission() {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.RECEIVE_BOOT_COMPLETED,
//       {
//         title: 'Notification Permission',
//         message: 'Allow this app to receive notifications.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('Notification permission granted');
//     } else {
//       console.log('Notification permission denied');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// }

export const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (fcmToken) {
    console.log(fcmToken, 'the old token (fcm)');
  }

  try {
    if (hasMessagingSupport) {
      await messaging().registerDeviceForRemoteMessages();
      const apnsToken = Platform.OS === 'ios' ? await messaging().getAPNSToken() : null;
      const newFcmToken = await messaging().getToken();
      if (Platform.OS === 'ios' && apnsToken) {
        await messaging().setAPNSToken(apnsToken);
      }
      if (newFcmToken) {
        console.log(newFcmToken, 'New generated fcmtoken');
        console.log(apnsToken, 'apnssss');
        await AsyncStorage.setItem('fcmToken', newFcmToken);
        return newFcmToken;
      }
    }
  } catch (error) {
    console.log('error in push notification', error);
  }

  if (!fcmToken) {
    fcmToken = `${FALLBACK_DEVICE_TOKEN}-${Platform.OS}`;
    await AsyncStorage.setItem('fcmToken', fcmToken);
  }

  return fcmToken;
};

export const notificationListener = async () => {
  if (!hasMessagingSupport) {
    return;
  }

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification remote caused app to open from background state:',
      remoteMessage,
    );
  });
  messaging().onMessage(async remoteMessage => {
    console.log(
      'Notification caused app to open in foreground state:',
      remoteMessage,
    );
    onDisplayNotification(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // const articleId = remoteMessage.data.articleId;
        // getArticleQuitState(articleId);
      }
    });
}; 

async function onDisplayNotification(remoteMessage) {
  // Request permissions (required for iOS)
  if (Platform.OS === 'ios') {
    await notifee.requestPermission();
  }
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: remoteMessage?.messageId,
    name: 'hued',
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });
  console.log('remoteeeeee', remoteMessage);
  // Display a notification
  await notifee.displayNotification({
    title: remoteMessage?.notification?.title,
    body: remoteMessage?.notification?.body,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    },
  });
}
