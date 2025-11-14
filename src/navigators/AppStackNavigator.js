import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/app/home/Home';
import Profile from '../screens/app/profile/Profile';
import EditProfile from '../screens/app/profile/EditProfile';
import BrandEditProfile from '../screens/app/profile/BrandEditProfile';
import Favourites from '../screens/app/profile/Favourites';
import ContactUs from '../screens/app/profile/ContactUs';
import ChangePass from '../screens/app/profile/ChangePass';
import CameraPicker from '../screens/app/camera/CameraPicker';
import TempScreen from '../screens/TempScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SingleImage from '../screens/app/camera/SingleImage';
import TermsAndConditions from '../screens/app/profile/TermsAndConditions';
import OutfitDetail from '../screens/app/home/OutfitDetails';
import Camera from '../screens/app/camera/Camera';
import Categories from '../screens/app/home/Categories';
import RotationScreen from '../screens/app/home/RotationalScreen';
import Notifications from '../screens/app/home/Notification';
import ExploreDetails from '../screens/app/explore/ExploreDetails';
import Categories2 from '../screens/app/home/Categories2';
import Wardrobe2 from '../screens/app/wardrobe/Wardrobe2';
import WardrobeDetails from '../screens/app/wardrobe/WardrobeDetails';
import EditCategories from '../screens/app/home/EditCategories';
import EditCategories2 from '../screens/app/home/EditCategories2';
import UpdateOutfit from '../screens/app/home/UpdateOutfit';
import SimilarDetails from '../screens/app/home/SimilarDetails';

const AppStack = createNativeStackNavigator();

const AppStackNavigator = () => (
  <AppStack.Navigator
    initialRouteName="BottomTabNavigator"
    screenOptions={{headerShown: false}}>
    <AppStack.Screen name="Home" component={Home} />

    <AppStack.Screen name="Profile" component={Profile} />
    <AppStack.Screen name="EditProfile" component={EditProfile} />
    <AppStack.Screen name="BrandEditProfile" component={BrandEditProfile} />
    <AppStack.Screen name="Favourites" component={Favourites} />
    <AppStack.Screen name="ContactUs" component={ContactUs} />
    <AppStack.Screen name="ChangePass" component={ChangePass} />
    <AppStack.Screen name="CameraPicker" component={CameraPicker} />
    <AppStack.Screen name="TempScreen" component={TempScreen} />
    <AppStack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
    <AppStack.Screen name="SingleImage" component={SingleImage} />
    <AppStack.Screen name="TermsAndConditions" component={TermsAndConditions} />
    <AppStack.Screen name="OutfitDetail" component={OutfitDetail} />
    <AppStack.Screen name="Camera" component={Camera} />
    <AppStack.Screen name="Categories" component={Categories} />
    <AppStack.Screen name="RotationScreen" component={RotationScreen} />
    <AppStack.Screen name="Notifications" component={Notifications} />
    <AppStack.Screen name="ExploreDetails" component={ExploreDetails} />
    <AppStack.Screen name="Categories2" component={Categories2} />
    <AppStack.Screen name="Wardrobe2" component={Wardrobe2} />
    <AppStack.Screen name="WardrobeDetails" component={WardrobeDetails} />
    <AppStack.Screen name="EditCategories" component={EditCategories} />
    <AppStack.Screen name="SimilarDetails" component={SimilarDetails} />

    <AppStack.Screen name="UpdateOutfit" component={UpdateOutfit} />

    <AppStack.Screen name="EditCategories2" component={EditCategories2} />
  </AppStack.Navigator>
);

export default AppStackNavigator;
