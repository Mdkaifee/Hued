import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import RNFS from 'react-native-fs';
import imagePath from '../../../utils/imagePath';
import {COLORS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../utils/constants';
// import addPhoto from '../../../utils/imageUpload';
import {GetColorsApi, uploadImages} from '../../../services/AppApi';
import {ToastMessage} from '../../../components/ToastMessage';
import Loader from '../../../components/Loader';
import ImageColors from 'react-native-image-colors';
// import ImageResizer from 'react-native-image-resizer';
import ImageResizer from '@bam.tech/react-native-image-resizer';
const ensureFileUri = (input) => {
  if (!input) {
    return '';
  }
  const normalized = `${input}`.trim();
  if (normalized.startsWith('file://') || normalized.startsWith('content://') || normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }
  return `file://${normalized}`;
};

const toFsPath = uri => {
  if (!uri) {
    return '';
  }
  return uri.startsWith('file://') ? uri.replace('file://', '') : uri;
};

const {height, width} = Dimensions.get('window');
export default function Camera(props) {
  const selectedImages = props?.route?.params?.selectedImages;
  const navigateFrom = props?.route?.params?.navigateFrom;
  const [loading, setLoading] = useState(false);
  console.log('selectedimage selectedImages', selectedImages);
  console.log('naviogatefrommm', navigateFrom);
  const handleSend = async () => {
    if (loading) {
      return;
    }

    if (!Array.isArray(selectedImages) || selectedImages.length === 0) {
      ToastMessage('No images selected');
      return;
    }

    setLoading(true);

    try {
      const resizedImages = await Promise.all(
        selectedImages.map(async (selectedImage, index) => {
          const resizeSourcePath = selectedImage?.path || toFsPath(selectedImage?.uri);
          const resizedImage = await ImageResizer.createResizedImage(
            resizeSourcePath,
            SCREEN_WIDTH,
            300,
            'JPEG',
            100,
            0,
            null,
            false,
            {mode: 'contain'},
          );

          const resizedFsPath = toFsPath(resizedImage.uri);
          const base64Image = await RNFS.readFile(resizedFsPath, 'base64');

          return {
            file: resizedImage?.uri,
            name: resizedImage?.name || `image_${index + 1}.jpeg`,
            height: resizedImage?.height,
            width: resizedImage?.width,
            data: base64Image,
            original: selectedImage,
          };
        }),
      );

      let palette = {};
      try {
        const paletteSource = resizedImages[0]?.data
          ? `data:${selectedImages[0]?.mime || 'image/jpeg'};base64,${resizedImages[0].data}`
          : ensureFileUri(selectedImages[0]?.path || selectedImages[0]?.uri) || '';
        palette = (await ImageColors.getColors(paletteSource, {})) || {};
      } catch (colorErr) {
        console.log('[Camera] colors error:', colorErr);
      }
      console.log('[Camera] palette result:', palette);
      delete palette?.platform;
      const uniqueColorsArray = Array.from(
        new Set(Object.values(palette || {}).filter(Boolean)),
      );

      const filePayload = resizedImages.map((resizedImage, index) => {
        const original = resizedImage?.original || selectedImages[index] || {};
        return {
          file: original?.data || resizedImage.data,
          type: original?.mime || 'image/jpeg',
          name:
            original?.filename ||
            original?.name ||
            resizedImage?.name ||
            `image_${index + 1}.jpeg`,
          height: original?.height || resizedImage?.height,
          width: original?.width || resizedImage?.width,
        };
      });

      console.log('[Camera] sending upload payload for', filePayload.length, 'images');
      const uploadResponse = await uploadImages({
        fileArr: filePayload,
      });

      console.log('[Camera] upload response:', JSON.stringify(uploadResponse));

      if (uploadResponse?.responseCode === 200 && uploadResponse?.result?.length) {
        console.log('[Camera] navigating to Categories with images:', JSON.stringify(uploadResponse?.result));
        props.navigation.navigate('Categories', {
          images: uploadResponse?.result,
          colors: uniqueColorsArray,
          selectedImages: resizedImages,
          fineImages: selectedImages,
        });
      } else {
        console.log('[Camera] upload failed, response:', JSON.stringify(uploadResponse));
        ToastMessage(
          uploadResponse?.data?.responseMessage || 'Upload failed. Please try again.',
        );
      }
    } catch (err) {
      console.log('[Camera] handleSend error:', err);
      ToastMessage(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <View
        style={selectedImages.length === 4 ? styles.bgView1 : styles.bgView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={
              selectedImages.length === 4
                ? styles.imageContainer1
                : styles.imageContainer
            }>
            {selectedImages.map((item, index) => (
              <Image
                key={index}
                style={styles.image}
                source={{uri: 'file://' + item.path}}
              />
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[
            Platform.OS === 'android'
              ? styles.androidbackImg
              : styles.iosbackImg,
          ]}
          onPress={() => props.navigation.navigate('BottomTabNavigator')}>
          <Image source={imagePath.Back} tintColor={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.crossSendView}>
          <TouchableOpacity
            style={styles.imgView}
            onPress={() => props.navigation.navigate('BottomTabNavigator')}>
            <Image source={imagePath.Close} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imgView1} onPress={handleSend}>
            {/* <TouchableOpacity
            style={styles.imgView1}
            onPress={() =>
              props.navigation.navigate('Categories', {
                selectedImages: selectedImages,
              })
            }> */}
            <Image source={imagePath.Send} />
          </TouchableOpacity>
        </View>

        {loading && <Loader />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bgView: {
    backgroundColor: COLORS.black,
    flex: 1,
  },
  bgView1: {
    backgroundColor: COLORS.black,
    flex: 1,
  },
  imbg: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    backgroundColor: COLORS.black,
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
  crossSendView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    gap: 24,
  },
  imgView: {
    backgroundColor: '#FFFFFF66',
    height: 62,
    width: 62,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgView1: {
    backgroundColor: COLORS.white,
    height: 62,
    width: 62,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  imageContainer1: {
    // flex: 1,
    paddingTop: 180,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: COLORS.black,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingBottom: 40,
  },
  image: {
    width: '50%', // Adjust the width based on the desired layout
    height: 200, // Set a fixed height or adjust as needed
    resizeMode: 'cover',
  },
});

// for sending using sw3
// const handleSend = async () => {
//   const file = selectedimages.sourceURL;
//   const fileName = selectedimages.filename;
//   const bucket = 'uploads';

//   const pathComponents = selectedimages.path.split('/');
//   const fileNameAndroid = pathComponents[pathComponents.length - 1];
//   const fileAndroid = selectedimages.path;
//   if (Platform.OS === 'ios') {
//     const imageDetails = await addPhoto(file, fileName, bucket);
//     const coverImageDetails = imageDetails.body.postResponse.location;
//   } else {
//     const imageDetails = await addPhoto(fileAndroid, fileNameAndroid, bucket);
//     console.log('iMGAEDetails', imageDetails);
//     const coverImageDetails = imageDetails.body.postResponse.location;
//   }
// };

// for sending single image using formdata
// const iosImageDetails = {
//   uri: 'file://' + selectedimages.path,
//   type: selectedimages.mime,
//   name: selectedimages.filename,
// };
// const pathComponents = selectedimages.path.split('/');
// const filename = pathComponents[pathComponents.length - 1];
// const androidImageDetails = {
//   uri: selectedimages.path,
//   type: selectedimages.mime,
//   name: filename,
// };

// if (selectedimages) {
//   if (Platform.OS === 'ios') {
//     formData.append('file', iosImageDetails);
//   } else if (Platform.OS === 'android')
//     formData.append('file', androidImageDetails);
//   else return;
// }

// for sending mltiple     // Assuming you have an array to store paths
// let imagePathArray = [];

// selectedImages.forEach((selectedImage, index) => {
//   const imagePath = {
//     uri:
//       Platform.OS === 'ios'
//         ? 'file://' + selectedImage.path
//         : selectedImage.path,

//     filename:
//       Platform.OS === 'ios'
//         ? selectedImages.filename
//         : `image_${index}.jpeg`,
//     type: `IMG/jpeg`,
//   };
//   imagePathArray.push(imagePath);
//   formData.append(`files`, imagePath);
// });
// import { View, Text } from 'react-native'
// import React from 'react'

// const Camera = () => {
//   return (
//     <View>
//       <Text>Camera</Text>
//     </View>
//   )
// }

// export default Camera

// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import React, {useState} from 'react';
// import RNFS from 'react-native-fs';
// import imagePath from '../../../utils/imagePath';
// import {COLORS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../utils/constants';
// import addPhoto from '../../../utils/imageUpload';
// import {GetColorsApi, uploadImages} from '../../../services/AppApi';
// import {ToastMessage} from '../../../components/ToastMessage';
// import Loader from '../../../components/Loader';
// // import ImageColors from 'react-native-image-colors';

// // import Palette from 'react-native-palette';
// import ImageResizer from '@bam.tech/react-native-image-resizer'; // ✅ UPDATED

// const {height, width} = Dimensions.get('window');
// export default function Camera(props) {
//   const selectedImages = props?.route?.params?.selectedImages;
//   const navigateFrom = props?.route?.params?.navigateFrom;
//   const [loading, setLoading] = useState(false);
//   console.log('selectedimage selectedImages', selectedImages);
//   console.log('naviogatefrommm', navigateFrom);
//   const handleSend = async () => {
//     setLoading(true);

//     // const colors = await ImageColors.getColors(
//     //   Platform.OS === 'ios'
//     //     ? 'file://' + selectedImages[0]?.path
//     //     : Platform.OS === 'android' && navigateFrom === 'AndroidCamera'
//     //     ? 'file://' + selectedImages[0]?.path
//     //     : selectedImages[0]?.path,
//     //   {},
//     // );
//     // delete colors?.platform;
//     // console.log(colors);

//     // const colorsArray = Object.values(colors);

//     // const uniqueColorsArray = colorsArray.filter((color, index, array) => {
//     //   return array.indexOf(color) === index;
//     // });
//     let imagePathToUse =
//   Platform.OS === 'ios'
//     ? 'file://' + selectedImages[0]?.path
//     : Platform.OS === 'android' && navigateFrom === 'AndroidCamera'
//     ? 'file://' + selectedImages[0]?.path
//     : selectedImages[0]?.path;

// let uniqueColorsArray = [];

// try {
//   const swatches = await Palette.getAllSwatches(imagePathToUse);

//   // swatches is an object like { Vibrant, DarkVibrant, LightVibrant, Muted, DarkMuted, LightMuted }
//   console.log('Palette swatches:', swatches);

//   // Collect only the hex values
//   const colorsArray = Object.values(swatches)
//     .filter(swatch => swatch) // filter out null
//     .map(swatch => swatch.color);

//   // Make unique
//   uniqueColorsArray = [...new Set(colorsArray)];

//   console.log('uniqueColorsArray', uniqueColorsArray);
// } catch (err) {
//   console.log('Palette error:', err);
// }


//     console.log(uniqueColorsArray);

//     const resizedImages = await Promise.all(
//       selectedImages.map(async (selectedImage, index) => {
//         // const resizedImage = await ImageResizer.createResizedImage(
//         //   selectedImage.path,
//         //   SCREEN_WIDTH, // Width of the resized image
//         //   300, // Height of the resized image
//         //   'JPEG', // Image format
//         //   100,
//         //   0, // No rotation
//         //   null, // outputPath, set to null for default cache folder
//         //   false, // keepMeta, set to false to lose metadata
//         //   {mode: 'contain'}, // options.mode for stretching
//         // );
//  const resizedImage = await ImageResizer.createResizedImage(
//             selectedImage.path,
//             SCREEN_WIDTH, // width
//             300,          // height
//             'JPEG',
//             100,
//             0,
//             undefined,    // default cache dir
//             false,
//             {mode: 'contain'},
//           );
//         console.log('resized', resizedImage);
//         const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');
//         console.log('base64', base64Image);
//         return {
//           file: resizedImage?.uri,
//           name: resizedImage?.name,
//           height: resizedImage?.height,
//           width: resizedImage?.width,
//           data: base64Image,
//         };

//       }),
//     );

//     // // Now resizedImages contains details for each resized image in selectedImages
//     console.log('resizedddd', resizedImages);

//     const imageDetailsArray = selectedImages.map((selectedImage, index) => {
//       const fileExtension = selectedImage.path.split('.').pop();
//       console.log('one item ', selectedImage);
//       return {
//         // file:
//         //   Platform.OS === 'ios'
//         //     ? 'file://' + selectedImage.path
//         //     : selectedImage.path,
//         file: selectedImage?.data,
//         type: selectedImage.mime || `image/${fileExtension || 'jpeg'}`,
//         name:
//           selectedImage.filename ||
//           `image_${index + 1}.${fileExtension || 'jpeg'}`,
//         height: selectedImage?.height,
//         // ? selectedImage?.cropRect?.height
//         // : '322',
//         width: selectedImage?.width,
//         // selectedImage?.cropRect?.width : '322',
//       };
//     });

//     console.log(imageDetailsArray);
//     // Now imageDetailsArray contains details for each image in selectedImages

//     const response = await uploadImages({
//       fileArr: imageDetailsArray,
//     });
//     console.log('responseeefrom image', response);
//     if (response?.responseCode === 200) {
//       setLoading(false);
//       props.navigation.navigate('Categories', {
//         images: response?.result,
//         colors: uniqueColorsArray,
//         selectedImages: resizedImages,
//         fineImages: selectedImages,
//       });
//     } else {
//       setLoading(false);
//       ToastMessage(response?.data?.responseMessage);
//     }
//   };
//   return (
//     <>
//       <View
//         style={selectedImages.length === 4 ? styles.bgView1 : styles.bgView}>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View
//             style={
//               selectedImages.length === 4
//                 ? styles.imageContainer1
//                 : styles.imageContainer
//             }>
//             {selectedImages.map((item, index) => (
//               <Image
//                 key={index}
//                 style={styles.image}
//                 source={{uri: 'file://' + item.path}}
//               />
//             ))}
//           </View>
//         </ScrollView>
//         <TouchableOpacity
//           style={[
//             Platform.OS === 'android'
//               ? styles.androidbackImg
//               : styles.iosbackImg,
//           ]}
//           onPress={() => props.navigation.navigate('BottomTabNavigator')}>
//           <Image source={imagePath.Back} tintColor={COLORS.white} />
//         </TouchableOpacity>

//         <View style={styles.crossSendView}>
//           <TouchableOpacity
//             style={styles.imgView}
//             onPress={() => props.navigation.navigate('BottomTabNavigator')}>
//             <Image source={imagePath.Close} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.imgView1} onPress={handleSend}>
 
//             <Image source={imagePath.Send} />
//           </TouchableOpacity>
//         </View>

//         {loading && <Loader />}
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   bgView: {
//     backgroundColor: COLORS.black,
//     flex: 1,
//   },
//   bgView1: {
//     backgroundColor: COLORS.black,
//     flex: 1,
//   },
//   imbg: {
//     flex: 1,
//     width: '100%',
//     resizeMode: 'contain',
//     backgroundColor: COLORS.black,
//   },
//   androidbackImg: {
//     position: 'absolute',
//     top: 26,
//     left: 20,
//   },
//   iosbackImg: {
//     position: 'absolute',
//     top: 56,
//     left: 20,
//   },
//   crossSendView: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 50,
//     alignSelf: 'center',
//     gap: 24,
//   },
//   imgView: {
//     backgroundColor: '#FFFFFF66',
//     height: 62,
//     width: 62,
//     borderRadius: 36,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   imgView1: {
//     backgroundColor: COLORS.white,
//     height: 62,
//     width: 62,
//     borderRadius: 36,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   imageContainer: {
//     flex: 1,
//     paddingTop: 100,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     backgroundColor: COLORS.black,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 40,
//   },
//   imageContainer1: {
//     // flex: 1,
//     paddingTop: 180,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
 
//   },
//   image: {
//     width: '50%', // Adjust the width based on the desired layout
//     height: 200, // Set a fixed height or adjust as needed
//     resizeMode: 'cover',
//   },
// });

// import {
//   StyleSheet,
//   View,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import React, {useState} from 'react';
// import RNFS from 'react-native-fs';
// import imagePath from '../../../utils/imagePath';
// import {COLORS, SCREEN_WIDTH} from '../../../utils/constants';
// import {uploadImages} from '../../../services/AppApi';
// import {ToastMessage} from '../../../components/ToastMessage';
// import Loader from '../../../components/Loader';
// import ImageResizer from '@bam.tech/react-native-image-resizer';
// import Palette from '@somesoap/react-native-image-palette';

// const {width} = Dimensions.get('window');

// export default function Camera(props) {
//   const selectedImages = props?.route?.params?.selectedImages || [];
//   const navigateFrom = props?.route?.params?.navigateFrom;
//   const [loading, setLoading] = useState(false);

//   const handleSend = async () => {
//     console.log("Camera screen ")
//     setLoading(true);

//     // Build a usable path for palette extraction
//     const firstPath =
//       Platform.OS === 'ios'
//         ? 'file://' + selectedImages[0]?.path
//         : Platform.OS === 'android' && navigateFrom === 'AndroidCamera'
//         ? 'file://' + selectedImages[0]?.path
//         : selectedImages[0]?.path;

//     let uniqueColorsArray = [];
//   console.log('firstPath is here ', firstPath)

//      if (!Palette?.getAllSwatches) {
//         throw new Error('getAllSwatchesnot available');
//       }
//     try {
//       if (!Palette?.getAllSwatches) {
//         throw new Error('Palette.getAllSwatches is not available');
//       }

//       // Returns something like:
//       // { Vibrant, DarkVibrant, LightVibrant, Muted, DarkMuted, LightMuted }
//       const swatches = await Palette.getAllSwatches(firstPath);
//       console.log('Palette swatches:', swatches);

//       const colorsArray = Object.values(swatches)
//         .filter(swatch => swatch && swatch.color)
//         .map(swatch => swatch.color);

//       uniqueColorsArray = [...new Set(colorsArray)];
//       console.log('uniqueColorsArray', uniqueColorsArray);
//     } catch (err) {
//       console.log('Palette error:', err);
//       // Keep going even if palette fails—colors can be empty
//       uniqueColorsArray = [];
//     }

//     try {
//       // Resize all selected images and convert to base64 for your upload
//       const resizedImages = await Promise.all(
//         selectedImages.map(async (img) => {
//           const resized = await ImageResizer.createResizedImage(
//             img.path,
//             SCREEN_WIDTH,
//             300,
//             'JPEG',
//             100,
//             0,
//             undefined,
//             false,
//             {mode: 'contain'},
//           );

//           const base64 = await RNFS.readFile(resized.uri, 'base64');

//           return {
//             file: resized?.uri,
//             name: resized?.name,
//             height: resized?.height,
//             width: resized?.width,
//             data: base64,
//           };
//         }),
//       );

//       console.log('resizedImages', resizedImages);

//       // Build upload payloads using original selection (as you had)
//       const imageDetailsArray = selectedImages.map((img, index) => {
//         const fileExtension = (img.path?.split('.').pop() || 'jpeg').toLowerCase();
//         return {
//           file: img?.data,
//           type: img.mime || `image/${fileExtension}`,
//           name: img.filename || `image_${index + 1}.${fileExtension}`,
//           height: img?.height,
//           width: img?.width,
//         };
//       });

//       const response = await uploadImages({fileArr: imageDetailsArray});
//       console.log('upload response', response);

//       if (response?.responseCode === 200) {
//         setLoading(false);
//         props.navigation.navigate('Categories', {
//           images: response?.result,
//           colors: uniqueColorsArray,
//           selectedImages: resizedImages,
//           fineImages: selectedImages,
//         });
//       } else {
//         setLoading(false);
//         ToastMessage(response?.data?.responseMessage);
//       }
//     } catch (e) {
//       console.log('HandleSend error:', e);
//       setLoading(false);
//       ToastMessage('Something went wrong while processing the images.');
//     }
//   };

//   return (
//     <>
//       <View style={selectedImages.length === 4 ? styles.bgView1 : styles.bgView}>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View
//             style={
//               selectedImages.length === 4
//                 ? styles.imageContainer1
//                 : styles.imageContainer
//             }>
//             {selectedImages.map((item, index) => (
//               <Image
//                 key={index}
//                 style={styles.image}
//                 source={{uri: 'file://' + item.path}}
//               />
//             ))}
//           </View>
//         </ScrollView>

//         <TouchableOpacity
//           style={[Platform.OS === 'android' ? styles.androidbackImg : styles.iosbackImg]}
//           onPress={() => props.navigation.navigate('BottomTabNavigator')}>
//           <Image source={imagePath.Back} tintColor={COLORS.white} />
//         </TouchableOpacity>

//         <View style={styles.crossSendView}>
//           <TouchableOpacity
//             style={styles.imgView}
//             onPress={() => props.navigation.navigate('BottomTabNavigator')}>
//             <Image source={imagePath.Close} />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.imgView1} onPress={handleSend}>
//             <Image source={imagePath.Send} />
//           </TouchableOpacity>
//         </View>

//         {loading && <Loader />}
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   bgView: {
//     backgroundColor: COLORS.black,
//     flex: 1,
//   },
//   bgView1: {
//     backgroundColor: COLORS.black,
//     flex: 1,
//   },
//   imbg: {
//     flex: 1,
//     width: '100%',
//     resizeMode: 'contain',
//     backgroundColor: COLORS.black,
//   },
//   androidbackImg: {
//     position: 'absolute',
//     top: 26,
//     left: 20,
//   },
//   iosbackImg: {
//     position: 'absolute',
//     top: 56,
//     left: 20,
//   },
//   crossSendView: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 50,
//     alignSelf: 'center',
//     gap: 24,
//   },
//   imgView: {
//     backgroundColor: '#FFFFFF66',
//     height: 62,
//     width: 62,
//     borderRadius: 36,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   imgView1: {
//     backgroundColor: COLORS.white,
//     height: 62,
//     width: 62,
//     borderRadius: 36,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   imageContainer: {
//     flex: 1,
//     paddingTop: 100,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     backgroundColor: COLORS.black,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 40,
//   },
//   imageContainer1: {
//     paddingTop: 180,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   image: {
//     width: '50%',
//     height: 200,
//     resizeMode: 'cover',
//   },
// });
