import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from '../screens/auth/Splashscreen';
import Welcome from '../screens/auth/Welcome';
import ConfirmPassScreen from '../screens/auth/ConfirmPassScreen';
import EmailScreen from '../screens/auth/EmailScreen';
import PasswordScreen from '../screens/auth/PasswordScreen';
import Onboarding from '../screens/auth/Onboarding';
import WalkThrough from '../screens/auth/WalkThrough';
import Details from '../screens/auth/Details';
// import Home from '../screens/app/home/Home';
// import Profile from '../screens/app/profile/Profile';
// import EditProfile from '../screens/app/profile/EditProfile';
// import TermsAndConditions from '../screens/app/profile/TermsAndConditions';
// import Favourites from '../screens/app/profile/Favourites';
// import ContactUs from '../screens/app/profile/ContactUs';
// import ChangePass from '../screens/app/profile/ChangePass';
// import BottomTabNavigator from './BottomTabNavigator';
// import OutfitDetail from '../screens/app/home/OutfitDetail';
// import Camera from '../screens/app/camera/Camera';
// import Categories from '../screens/app/home/Categories';
// import RotationScreen from '../screens/app/home/RotationScreen';
// import ConitinueAs from '../screens/auth/ContinueAs';
import ContinueAs from '../screens/auth/ContinueAs';
import BrandDetails from '../screens/auth/BrandDetails';
// import BrandDetails from '../screens/auth/SocialBrandDetails';
// import BrandEditProfile from '../screens/app/profile/BrandEditProfile';
// import TempScreen from '../screens/TempScreen';
// import CameraPicker from '../screens/app/camera/CameraPicker';
// import SingleImage from '../screens/app/camera/SingleImage';
import SocialBasicDetails from '../screens/auth/SocialBasicDetails';
import SocialBrandDetails from '../screens/auth/SocialBrandDetails';
const AuthStack = createNativeStackNavigator();

const AuthStackNavigator = () => (
  <AuthStack.Navigator
    initialRouteName="Onboarding"
    screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="SplashScreen" component={SplashScreen} />
    <AuthStack.Screen name="Details" component={Details} />
    <AuthStack.Screen name="Welcome" component={Welcome} />
    <AuthStack.Screen name="ConfirmPassScreen" component={ConfirmPassScreen} />
    <AuthStack.Screen name="PasswordScreen" component={PasswordScreen} />
    <AuthStack.Screen name="EmailScreen" component={EmailScreen} />
    <AuthStack.Screen name="BrandDetails" component={BrandDetails} />
    <AuthStack.Screen name="Onboarding" component={Onboarding} />
    <AuthStack.Screen name="WalkThrough" component={WalkThrough} />
    <AuthStack.Screen name="ContinueAs" component={ContinueAs} />
    <AuthStack.Screen
      name="SocialBasicDetails"
      component={SocialBasicDetails}
    />
    <AuthStack.Screen
      name="SocialBrandDetails"
      component={SocialBrandDetails}
    />

    {/* // apppppppstack hai  */}
  </AuthStack.Navigator>
);

export default AuthStackNavigator;
