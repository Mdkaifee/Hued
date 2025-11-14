import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Button,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';

import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
// import {ToastMessage} from '../../../components/ToastMessage';

import {COLORS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../utils/constants';
import imagePath from '../../../utils/imagePath';
// import ImagePicker from 'react-native-image-crop-picker';
export default function CameraPicker(props) {
  const camera = useRef(null);
  const device = useCameraDevice('back');
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  // if (device == null) {
  //   return ToastMessage('Connect a device');
  // }

  // const format = useCameraFormat(device, [{photoResolution: 'max'}]);
  const handleTakePhoto = async () => {
    try {
      if (camera.current) {
        const photo = await camera.current.takePhoto();
        setCapturedPhotos(prevPhotos => [...prevPhotos, photo]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  // const handleSendImages = async () => {
  // Check if there are captured photos
  // const crop = async img => {
  //   return await ImagePicker.openCropper({
  //     path: img.path,
  //     includeBase64: true,
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

  // const cropMulti = async images => {
  //   const props = {
  //     cropped: [],
  //     length: images.length,
  //     current: images.length,
  //   };

  //   const maxCrops = images.length * 6;

  //   for (let i = 0; i < maxCrops; i++) {
  //     await cropCurrent(props, images);

  //     // Break the loop if the desired number of crops is reached
  //     if (props.cropped.length >= maxCrops) {
  //       break;
  //     }
  //   }
  //   return props.cropped;
  // };

  // const cropped = await cropMulti(capturedPhotos);
  // console.log('croppedddcameraa', cropped);

  //   setTimeout(() => {
  //     props.navigation.navigate('Camera', {
  //       selectedImages: capturedPhotos,
  //     });
  //   }, 300);
  // };
  console.log('capturedphotos', capturedPhotos);

  const handleSendImages = async () => {
    try {
      const base64Images = await Promise.all(
        capturedPhotos.map(async photo => {
          const imageBase64 = await RNFS.readFile(photo.path, 'base64');
          return {...photo, data: imageBase64};
        }),
      );

      // Now, base64Images array contains objects with the original photo data and their base64 representations

      console.log('baseee644444', base64Images);
      setTimeout(() => {
        props.navigation.navigate('Camera', {
          selectedImages: base64Images,
          fineImages: capturedPhotos,
          navigateFrom: 'AndroidCamera',
        });
      }, 300);
    } catch (error) {
      console.error('Error converting photos to Base64:', error);
    }
  };
  console.log('capturedd', capturedPhotos);
  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo

        // format={format}
      />

      <TouchableOpacity
        style={[
          Platform.OS === 'android' ? styles.androidbackImg : styles.iosbackImg,
        ]}
        onPress={() => props.navigation.navigate('BottomTabNavigator')}>
        <Image source={imagePath.Back} tintColor={COLORS.white} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tapButton} onPress={handleTakePhoto}>
        <Image source={imagePath.button} />
      </TouchableOpacity>
      {capturedPhotos.length >= 4 && (
        <TouchableOpacity style={styles.tickButton} onPress={handleSendImages}>
          <Image style={{height: 24, width: 24}} source={imagePath.tickk} />
        </TouchableOpacity>
      )}
      {/* Display captured photos in the bottom left corner */}
      <View style={styles.bottomLeftContainer}>
        <FlatList
          data={capturedPhotos}
          horizontal
          contentContainerStyle={{paddingEnd: 10}}
          keyExtractor={item => item.uri}
          renderItem={({item, index}) => (
            <View style={{position: 'relative'}}>
              <Image
                source={{uri: 'file://' + item.path}}
                style={styles.thumbnail}
              />
              <TouchableOpacity
                style={styles.cross}
                onPress={() => {
                  const updatedPhotos = [...capturedPhotos];
                  updatedPhotos.splice(index, 1);
                  setCapturedPhotos(updatedPhotos);
                }}>
                <Image
                  source={imagePath.cross}
                  style={{
                    width: 10,
                    height: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  camera: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  photoList: {
    // marginTop: 10,
  },
  thumbnail: {
    width: 100,
    height: 80,
    marginStart: 10,
    marginBottom: 20,
    marginTop: 10,

    backgroundColor: COLORS.black,
  },
  tapButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
  },
  tickButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 170,
    alignSelf: 'flex-end',
    right: 20,
  },
  bottomLeftContainer: {
    // position: 'absolute',
    // bottom: 10,

    backgroundColor: COLORS.black,
    // backgroundColor:"red"
  },
  cross: {
    position: 'absolute',
    top: 0,
    right: -6,
    width: 15,
    height: 15,
    backgroundColor: COLORS.lightBorderLine,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  androidbackImg: {
    position: 'absolute',
    top: 26,
    left: 20,
  },
  iosbackImg: {
    position: 'absolute',
    top: 56,
    left: 20,
  },
});
