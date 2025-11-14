import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
// import {COLORS} from '../utils/constants';
// import imagePath from '../utils/imagePath';
import {COLORS} from './src/utils/constants';
import imagePath from './src/utils/imagePath';

export default function BaseView2(props) {
  return (
    <>
      <ImageBackground
        source={imagePath.Onboarding}
        style={{flex: 1, resizeMode: 'cover'}} // Set 'resizeMode' to 'cover' to stretch the image
      >
        <SafeAreaView style={{...styles.topSafeArea, ...props.topView}} />
        <SafeAreaView
          style={[{flex: 1, backgroundColor: 'transparent'}, props.safeView]} // Set the background color to 'transparent'
        >
          <StatusBar
            translucent={false}
            backgroundColor={
              props.statusBarColor ? props.statusBarColor : COLORS.white
            }
            barStyle="dark-content"
          />

          <View style={{...styles.parentView, ...props.baseViewStyle}}>
            {props.children}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  topSafeArea: {
    flex: 0,
    backgroundColor: '#fff',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  parentView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboard: {
    flexGrow: 1,
  },
});
