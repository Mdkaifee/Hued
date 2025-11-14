import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, View, Animated } from 'react-native';
import BaseView from '../../../BaseView.js';
import { COLORS } from '../../utils/constants.js';
import imagePath from '../../utils/imagePath.js';
import { KEYS, getData, getToken, getUserPrefs } from '../../utils/UserPrefs.js';
import { VARIABLES } from '../../utils/globalVariables.js';

export default function SplashScreen(props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Splash();
  }, []);

  const Splash = async () => {
    const token = await getToken();
    VARIABLES.details = await getUserPrefs();
    const userData = JSON.parse(VARIABLES.details);

    VARIABLES.lat = userData?.location?.coordinates[1];
    VARIABLES.long = userData?.location?.coordinates[0];

    console.log('token', token);
    console.log('globaldeets', VARIABLES.details);
    console.log('LAT , LONG', VARIABLES.lat, VARIABLES.long);

    // console.log(GlobalVariable.details.role, 'GlobalVariable.details');

    if (token) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500, // Adjust the duration as needed
        useNativeDriver: true,
      }).start(() => {
        if (userData?.type === null) {
          setTimeout(() => {
            // props.navigation.replace('AppStackNavigator');
            console.log('app stack')
          }, 1000);
        } else {
          if (userData?.profileComplete === false) {
            if (userData?.userType === 'user') {
              setTimeout(() => {
                props.navigation.reset({
                  index: 2,
                  routes: [
                    {
                      name: 'AuthStackNavigator',
                      params: { screen: 'Welcome' },
                    },
                    {
                      name: 'AuthStackNavigator',
                      params: { screen: 'ContinueAs' },
                    },
                    {
                      name: 'AuthStackNavigator',
                      params: { screen: 'SocialBasicDetails' },
                    },
                  ],
                });
              }, 1000);
            } else {
              setTimeout(() => {
                props.navigation.reset({
                  index: 2,
                  routes: [
                    {
                      name: 'AuthStackNavigator',
                      params: { screen: 'Welcome' },
                    },
                    {
                      name: 'AuthStackNavigator',
                      params: { screen: 'ContinueAs' },
                    },
                    {
                      name: 'AuthStackNavigator',
                      params: { screen: 'SocialBrandDetails' },
                    },
                  ],
                });
              }, 1000);
            }
          } else {
            // setTimeout(() => {
            //   props.navigation.replace('AppStackNavigator');
            // }, 1000);
               console.log('app stack add')
          }
        }
      });
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Adjust the duration as needed
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          props.navigation.replace('AuthStackNavigator');
        }, 1000); // Adjust the timeout as needed
      });
    }
  };

  return (
    <BaseView
      safeView={{ backgroundColor: COLORS.white }}
      topView={{ flex: 0, backgroundColor: COLORS.white }}
      baseViewStyle={{ backgroundColor: COLORS.white }}>
      <View style={styles.mainView}>
        <Animated.Image source={imagePath.splash} style={{ opacity: fadeAnim }} />
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
