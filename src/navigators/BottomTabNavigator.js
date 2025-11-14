import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import Home from '../screens/app/home/Home';
import Profile from '../screens/app/profile/Profile';
import Explore from '../screens/app/explore/Explore';
import Wardrobe from '../screens/app/wardrobe/Wardrobe';
import imagePath from '../utils/imagePath';
// import Camera from '../screens/app/camera/Camera';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import {
  COLORS,
  FONT_FAMILIES,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../utils/constants';
import {useNavigation} from '@react-navigation/native';
import UploadeFile from '../modals/UploadFile';
import ImagePicker from 'react-native-image-crop-picker';
// import CameraPicker from '../screens/app/camera/CameraPicker';
import {ToastMessage} from '../components/ToastMessage';
import ImageModal from '../modals/ImageModal';
import Loader from '../components/Loader';
const {height, width} = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const BottomTabNavigator = props => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const openPickerModal = () => {
    setPickerModalVisible(true);
  };
  const closePickerModal = () => {
    setPickerModalVisible(false);
  };

  const handle3d = () => {
    setValue('360');
    closeModal();
    setTimeout(() => {
      openPickerModal();
    }, 1000);
  };

  const handleImage = () => {
    setValue('image');
    closeModal();
    setTimeout(() => {
      openPickerModal();
    }, 1000);
  };
  console.log('valuee', value);
  const openCameraPicker = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        closePickerModal();
        if (value === 'image') {
          setTimeout(() => {
            openCamera();
          }, 1000);
        } else if (value === '360')
          setTimeout(() => {
            navigation.navigate('CameraPicker');
          }, 300);
      } else {
        closePickerModal();
        ToastMessage('Camera permission denied');
      }
    } else if (Platform.OS === 'ios') {
      const permission = PERMISSIONS.IOS.CAMERA;

      const result = await request(permission);
      console.log('resultt', result);
      if (result === RESULTS.GRANTED) {
        closePickerModal();
        if (value === 'image') {
          setTimeout(() => {
            openCamera();
          }, 1000);
        } else if (value === '360') {
          setTimeout(() => {
            navigation.navigate('CameraPicker');
          }, 300);
        }
      } else {
        closePickerModal();
        ToastMessage(
          'Camera permission denied. Please enable camera permissions in settings ',
        );
      }
    }
  };
  const openCamera = () => {
    ImagePicker.openCamera({
      // width: SCREEN_WIDTH,
      // height: SCREEN_HEIGHT * 0.4,
      includeBase64: true,
      // compressImageQuality: false,
      // cropping: true,
    }).then(image => {
      console.log(image);
      setTimeout(() => {
        navigation.navigate('SingleImage', {selectedImages: image});
      }, 300);
    });
  };

  // for gallery picker
  // const openImagePicker = async () => {
  //   if (value === 'image') {
  //     ImagePicker.openPicker({
  //       width: SCREEN_WIDTH,
  //       height: SCREEN_HEIGHT * 0.4,
  //       cropping: true,
  //       includeBase64: true,
  //     }).then(image => {
  //       console.log(image);
  //       closePickerModal();

  //       setTimeout(() => {
  //         navigation.navigate('SingleImage', {selectedImages: image});
  //       }, 300);
  //     });
  //   } else if (value === '360') {
  //     const images = await ImagePicker.openPicker({
  //       multiple: true,
  //       // includeBase64: true,
  //       mediaType: 'photo',
  //       maxFiles: 100,
  //       minFiles: 4,
  //     });

  //     // return cropped;
  //     const crop = async img => {
  //       return await ImagePicker.openCropper({
  //         path: img.path,
  //         includeBase64: true,
  //         width: SCREEN_WIDTH,
  //         height: SCREEN_HEIGHT * 0.4,
  //       });
  //     };
  //     const cropCurrent = async (props, images) => {
  //       if (props.current) {
  //         const cImg = await crop(images[props.length - props.current]);
  //         props.cropped.push(cImg);
  //         props.current = props.current - 1;
  //       }
  //     };

  //     const cropMulti = async images => {
  //       const props = {
  //         cropped: [],
  //         length: images.length,
  //         current: images.length,
  //       };

  //       // max number of times to crrop
  //       // await cropCurrent(props, images);
  //       // await cropCurrent(props, images);
  //       // await cropCurrent(props, images);
  //       // await cropCurrent(props, images);
  //       // await cropCurrent(props, images);
  //       // await cropCurrent(props, images);
  //       // Determine the maximum number of times to crop based on the length of the images array
  //       const maxCrops = images.length * 6;

  //       for (let i = 0; i < maxCrops; i++) {
  //         await cropCurrent(props, images);

  //         // Break the loop if the desired number of crops is reached
  //         if (props.cropped.length >= maxCrops) {
  //           break;
  //         }
  //       }
  //       return props.cropped;
  //     };

  //     const cropped = await cropMulti(images);
  //     closePickerModal();
  //     // return console.log('croppedd', cropped);
  //     setTimeout(() => {
  //       // setLoading(false);
  //       navigation.navigate('Camera', {selectedImages: cropped});
  //     }, 300);
  //   }
  // };

  const openImagePicker = async () => {
    if (value === 'image') {
      ImagePicker.openPicker({
        // width: SCREEN_WIDTH,
        // height: SCREEN_HEIGHT * 0.4,
        // cropping: true,
        includeBase64: true,
      }).then(image => {
        console.log('imageeeeeeeeeee', image);
        closePickerModal();

        setTimeout(() => {
          navigation.navigate('SingleImage', {selectedImages: image});
        }, 300);
      });
    } else if (value === '360') {
      const images = await ImagePicker.openPicker({
        multiple: true,
        includeBase64: true,
        mediaType: 'photo',
        maxFiles: 100,
        minFiles: 4,
        width: SCREEN_WIDTH,
        height: 300,
      });

      // return cropped;

      // const crop = async img => {
      //   return await ImagePicker.openCropper({
      //     path: img.path,
      //     // includeBase64: true,
      //     width: SCREEN_WIDTH,
      //     height: SCREEN_HEIGHT * 0.4,
      //   });
      // };
      // const cropCurrent = async (props, images) => {
      //   if (props.current) {
      //     const cImg = await crop(images[props.length - props.current]);
      //     props.cropped.push(cImg);
      //     props.current = props.current - 1;
      //   }
      // };

      // let cropperActive = true; // State variable to track the cropper state

      // const cropMulti = async images => {
      //   const props = {
      //     cropped: [],
      //     length: images.length,
      //     current: images.length,
      //   };

      //   const maxCrops = images.length * 6;

      //   for (let i = 0; i < maxCrops; i++) {
      //     if (cropperActive) {
      //       await cropCurrent(props, images);
      //     } else {
      //       break; // Break the loop if cropper is no longer active
      //     }
      //   }
      //   return props.cropped;
      // };

      // const cropped = await cropMulti(images);
      closePickerModal();

      // // Set cropperActive to false once all images are cropped
      // cropperActive = false;
      // console.log('cropppedd', cropped);
      if (images?.length >= 4) {
        setTimeout(() => {
          navigation.navigate('Camera', {selectedImages: images});
        }, 300);
      } else {
        ToastMessage('Please select four or more images.');
      }
    }
  };

  const renderTabBar = ({routeName, selectedTab, navigate}) => {
    const getTabImage = route => {
      switch (route) {
        case 'Home':
          return imagePath.home;
        case 'Explore':
          return imagePath.explore;
        case 'Camera':
          return imagePath.camera;
        case 'Wardrobe':
          return imagePath.wardrobe;
        case 'Profile':
          return imagePath.profileIcon;
        default:
          return null;
      }
    };

    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}>
        <Image
          source={getTabImage(routeName)}
          style={{
            tintColor:
              routeName === selectedTab ? COLORS.primary : COLORS.black,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <CurvedBottomBar.Navigator
        type="UP"
        style={styles.bottomBar}
        shadowStyle={styles.shawdow}
        height={60}
        circleWidth={50}
        bgColor="white"
        initialRouteName="Home"
        initialLayout={{height: SCREEN_HEIGHT}}
        screenOptions={{
          headerShown: false,
        }}
        renderCircle={({selectedTab, navigate}) => (
          <TouchableOpacity style={styles.button} onPress={openModal}>
            <Image source={imagePath.plus} />
          </TouchableOpacity>
        )}
        tabBar={renderTabBar}>
        <CurvedBottomBar.Screen position="LEFT" name="Home" component={Home} />
        <CurvedBottomBar.Screen
          position="LEFT"
          name="Explore"
          component={Explore}
        />

        <CurvedBottomBar.Screen
          position="RIGHT"
          name="Wardrobe"
          component={Wardrobe}
        />
        <CurvedBottomBar.Screen
          position="RIGHT"
          name="Profile"
          component={Profile}
        />
      </CurvedBottomBar.Navigator>

      {openModal && (
        <ImageModal
          visible={modalVisible}
          closeModal={closeModal}
          navigation={navigation}
          onPress3D={handle3d}
          onPressImage={handleImage}
        />
      )}

      <UploadeFile
        visible={pickerModalVisible}
        closeModal={closePickerModal}
        navigation={navigation}
        onPressCamera={openCameraPicker}
        onPressGallery={openImagePicker}
      />
      {loading && <Loader />}
    </>
  );
};

const DummyComponent = () => {
  return null;
};
const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    bottom: 18,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {},
  camera: {},
});
export default BottomTabNavigator;
