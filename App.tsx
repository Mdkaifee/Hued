// import React from 'react';
// import SplashScreen from './src/screens/auth/Splashscreen';

// type NavigationStub = {
//   replace: (...args: unknown[]) => void;
//   reset: (...args: unknown[]) => void;
// };

// const navigationStub: NavigationStub = {
//   replace: () => { },
//   reset: () => { },
// };

// function App() {
//   return <SplashScreen navigation={navigationStub} />;
// }

// export default App;
import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
// import SplashScreen from './src/screens/auth/SplashScreen';
// import Onboarding from './src/screens/auth/Onboarding';
// import WalkThrough from './src/screens/auth/WalkThrough';
// import Welcome from './src/screens/auth/Welcome';
// import Details from './src/screens/auth/Details';
// import EmailScreen from './src/screens/auth/EmailScreen';
// import ConfirmPassScreen from './src/screens/auth/ConfirmPassScreen';
// import PasswordScreen from './src/screens/auth/PasswordScreen';
// import {NavigationContainer} from '@react-navigation/native';
// import AuthStackNavigator from './src/navigators/AuthStackNavigator';
// import Home from './src/screens/app/home/Home';
// import Profile from './src/screens/app/profile/Profile';
import Routes from './src/navigators/Routes';
import { MenuProvider } from 'react-native-popup-menu';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import requestUserPermission, {
  notificationListener,
} from './src/utils/notificationServices';

export default function App() {
  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <MenuProvider>

      <Routes />
    </MenuProvider>
     </GestureHandlerRootView>
    
  );
}

const styles = StyleSheet.create({});
