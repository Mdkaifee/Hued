import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import imagePath from '../../../utils/imagePath';
import {COLORS, SCREEN_WIDTH} from '../../../utils/constants';
import addPhoto from '../../../utils/imageUpload';
import {GetColorsApi, uploadImages} from '../../../services/AppApi';
import {ToastMessage} from '../../../components/ToastMessage';
import Loader from '../../../components/Loader';
import RNFS from 'react-native-fs';
import ImageColors from 'react-native-image-colors';
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
export default function SingleImage(props) {
  const selectedImages = props?.route?.params?.selectedImages;
  const [loading, setLoading] = useState(false);
  console.log(selectedImages, 'selehhj');



  const handleSend = async () => {
    if (loading) {
      return;
    }

    if (!selectedImages?.path && !selectedImages?.uri) {
      ToastMessage('No image selected');
      return;
    }

    setLoading(true);

    try {
      const previewUri = ensureFileUri(selectedImages?.path || selectedImages?.uri);
      console.log('previewUri', previewUri);
      const resizeSourcePath = selectedImages?.path || toFsPath(previewUri);
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

      let palette = {};
      try {
        const paletteSource = base64Image
          ? `data:${selectedImages?.mime || 'image/jpeg'};base64,${base64Image}`
          : previewUri || '';
        palette = (await ImageColors.getColors(paletteSource, {})) || {};
        console.log('run2',palette)
      } catch (colorErr) {
        console.log('[SingleImage] colors error:', colorErr);
      }
      delete palette?.platform;
      const uniqueColorsArray = Array.from(
        new Set(Object.values(palette || {}).filter(Boolean)),
      );

      const resizedPayload = {
        file: resizedImage?.uri,
        name: resizedImage?.name,
        height: resizedImage?.height,
        width: resizedImage?.width,
        data: base64Image,
      };

      console.log('[SingleImage] sending upload payload');
      const uploadResponse = await uploadImages({
        fileArr: [
          {
            file: selectedImages?.data || base64Image,
            type: selectedImages?.mime || 'image/jpeg',
            name:
              selectedImages?.filename ||
              selectedImages?.name ||
              resizedImage?.name ||
              'image.jpeg',
            height: selectedImages?.height || resizedImage?.height,
            width: selectedImages?.width || resizedImage?.width,
          },
        ],
      });

      console.log('[SingleImage] upload response:', JSON.stringify(uploadResponse));

      if (uploadResponse?.responseCode === 200 && uploadResponse?.result?.length) {
        console.log('[SingleImage] navigating to Categories2 with images:', JSON.stringify(uploadResponse?.result));
        props.navigation.navigate('Categories2', {
          images: uploadResponse?.result,
          colors: uniqueColorsArray,
          selectedImages: resizedPayload,
          fineImages: selectedImages,
        });
      } else {
        console.log('[SingleImage] upload failed, response:', JSON.stringify(uploadResponse));
        ToastMessage(
          uploadResponse?.data?.responseMessage || 'Upload failed. Please try again.',
        );
      }
    } catch (err) {
      console.log('[SingleImage] handleSend error:', err);
      ToastMessage(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <View style={styles.imageContainer}>
        <Image style={styles.imbg} source={{uri: ensureFileUri(selectedImages?.path || selectedImages?.uri)}} />

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
  imbg: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    backgroundColor: COLORS.black,
    height: '60%',
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
    // backgroundColor: 'red',
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
    paddingTop: width * 0.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '50%', // Adjust the width based on the desired layout
    height: 200, // Set a fixed height or adjust as needed
    resizeMode: 'cover',
  },
});

// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import React, {useState} from 'react';
// import imagePath from '../../../utils/imagePath';
// import {COLORS, SCREEN_WIDTH} from '../../../utils/constants';
// import {uploadImages} from '../../../services/AppApi';
// import {ToastMessage} from '../../../components/ToastMessage';
// import Loader from '../../../components/Loader';
// import RNFS from 'react-native-fs';
// import Palette from '@somesoap/react-native-image-palette';
// import ImageResizer from '@bam.tech/react-native-image-resizer';

// const {width} = Dimensions.get('window');

// export default function SingleImage(props) {
//   const selectedImages = props?.route?.params?.selectedImages;
//   const [loading, setLoading] = useState(false);

//   const handleSend = async () => {
//     setLoading(true);
//     console.log('selectedImages in single image', selectedImages);

//     // --- Get colors with Palette ---
//     let uniqueColorsArray = [];
//     try {
//       const imagePathToUse =
//         Platform.OS === 'ios'
//           ? 'file://' + selectedImages?.path
//           : selectedImages?.path;

//       const swatches = await Palette.getAllSwatches(imagePathToUse);
//       console.log('Palette swatches:', swatches);

//       const colorsArray = Object.values(swatches)
//         .filter(swatch => swatch) // remove null
//         .map(swatch => swatch.color);

//       uniqueColorsArray = [...new Set(colorsArray)];
//       console.log('uniqueColorsArray', uniqueColorsArray);
//     } catch (err) {
//       console.log('Palette error:', err);
//     }

//     // --- Resize Image ---
//     const resizedImage = await ImageResizer.createResizedImage(
//       selectedImages.path,
//       SCREEN_WIDTH,
//       300,
//       'JPEG',
//       100,
//       0,
//       null,
//       false,
//       {mode: 'contain'},
//     );

//     console.log('resized', resizedImage);

//     const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');

//     const result = {
//       file: resizedImage?.uri,
//       name: resizedImage?.name,
//       height: resizedImage?.height,
//       width: resizedImage?.width,
//       data: base64Image,
//     };
//     console.log('resized single', result);

//     // --- Upload Image ---
//     const response = await uploadImages({
//       fileArr: [
//         {
//           file: selectedImages?.data,
//           type: selectedImages?.mime,
//           name: 'Img/JPEG',
//         },
//       ],
//     });
//     console.log('response from single upload', response);

//     if (response?.responseCode === 200) {
//       setLoading(false);
//       props.navigation.navigate('Categories2', {
//         images: response?.result,
//         colors: uniqueColorsArray, // ✅ now from Palette
//         selectedImages: result,
//         fineImages: selectedImages,
//       });
//     } else {
//       setLoading(false);
//       ToastMessage(response?.data?.responseMessage);
//     }
//   };

//   return (
//     <>
//       <View style={styles.imageContainer}>
//         <Image style={styles.imbg} source={{uri: ensureFileUri(selectedImages?.path || selectedImages?.uri)}} />

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
//   imbg: {
//     flex: 1,
//     width: '100%',
//     resizeMode: 'cover',
//     backgroundColor: COLORS.black,
//     height: '60%',
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
//     paddingTop: width * 0.5,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     backgroundColor: COLORS.black,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// import React, {useState} from 'react';
// import {
//   StyleSheet,
//   View,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
//   NativeModules,
//   Text,
// } from 'react-native';
// import imagePath from '../../../utils/imagePath';
// import {COLORS, SCREEN_WIDTH} from '../../../utils/constants';
// import {uploadImages} from '../../../services/AppApi';
// import {ToastMessage} from '../../../components/ToastMessage';
// import Loader from '../../../components/Loader';
// import RNFS from 'react-native-fs';
// import ImageResizer from '@bam.tech/react-native-image-resizer';

// const {width} = Dimensions.get('window');

// /* ------------------------------ helpers ------------------------------ */

// const ensureFileUri = (p) => {
//   if (!p) return '';
//   if (/^(file|content):\/\//i.test(p)) return p; // already a URI
//   return `file://${p}`; // make it a URI
// };

// /**
//  * Robust wrapper around @somesoap/react-native-image-palette:
//  * - Finds the native module under several names
//  * - Tries multiple method names & calling conventions
//  * - Returns an array of hex color strings
//  */
// const getPaletteColors = async (inputPath) => {
//   const ImagePalette =
//     NativeModules.ImagePalette ||
//     NativeModules.ImagePaletteModule ||
//     NativeModules.RNImagePalette ||
//     null;

//   if (!ImagePalette) {
//     console.warn('ImagePalette native module not found');
//     return [];
//   }

//   const uri = ensureFileUri(inputPath);
//   const candidates = [
//     'getAllSwatches',
//     'getAllSwatchesFromImage',
//     'getSwatches',
//     'getPalette',
//   ];

//   let swatches;

//   for (const name of candidates) {
//     const fn = ImagePalette[name];
//     if (typeof fn !== 'function') continue;

//     // Some forks accept (uri), some (path), some ({uri})
//     const attempts = [
//       () => fn(uri),
//       () =>
//         Platform.OS === 'android'
//           ? fn(uri.replace(/^file:\/\//, '')) // try raw path on Android
//           : Promise.reject(),
//       () => fn({uri}),
//     ];

//     for (const attempt of attempts) {
//       try {
//         const out = await attempt();
//         if (out) {
//           swatches = out;
//           break;
//         }
//       } catch (e) {
//         // try next signature
//       }
//     }
//     if (swatches) break;
//   }

//   if (!swatches) {
//     console.warn('ImagePalette: no compatible method or call failed.');
//     return [];
//   }

//   // Normalize to string[] of HEX colors
//   let colors = [];
//   if (Array.isArray(swatches)) {
//     colors = swatches
//       .map((x) => (typeof x === 'string' ? x : x && x.color))
//       .filter(Boolean);
//   } else if (swatches && typeof swatches === 'object') {
//     colors = Object.values(swatches)
//       .map((v) => (typeof v === 'string' ? v : v && v.color))
//       .filter(Boolean);
//   }

//   // Dedupe + normalize case
//   return Array.from(new Set(colors.map((c) => c.trim().toUpperCase())));
// };

// /* ---------------------------- main component ---------------------------- */

// export default function SingleImage(props) {
//   // Expecting a single image object like: { path, data, mime, ... }
//   const selectedImages = props?.route?.params?.selectedImages;
//   const [loading, setLoading] = useState(false);
//   const [extracted, setExtracted] = useState([]);

//   const handleSend = async () => {
//     setLoading(true);
//     try {
//       if (!selectedImages?.path) {
//         throw new Error('No image path provided');
//       }

//       // ---- 1) Extract colors ----
//       const inputPath =
//         Platform.OS === 'ios'
//           ? `file://${selectedImages.path}`
//           : selectedImages.path;

//       const uniqueColorsArray = await getPaletteColors(inputPath);
//       console.log('[Palette] final colors count:', uniqueColorsArray.length);
//       setExtracted(uniqueColorsArray);

//       // ---- 2) Resize the image ----
//       const resizedImage = await ImageResizer.createResizedImage(
//         selectedImages.path,
//         SCREEN_WIDTH,
//         300,
//         'JPEG',
//         100,
//         0,
//         undefined,
//         false,
//         {mode: 'contain'},
//       );

//       const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');
//       const resizedPayload = {
//         file: resizedImage?.uri,
//         name: resizedImage?.name,
//         height: resizedImage?.height,
//         width: resizedImage?.width,
//         data: base64Image,
//       };

//       // ---- 3) Upload original (your API expects base64 in fileArr[0].file) ----
//       const response = await uploadImages({
//         fileArr: [
//           {
//             file: selectedImages?.data, // base64 from your picker
//             type: selectedImages?.mime || 'image/jpeg',
//             name: 'Img/JPEG',
//           },
//         ],
//       });

//       // ---- 4) Handle server response & navigate ----
//       if (response?.responseCode === 200) {
//         setLoading(false);
//         props.navigation.navigate('Categories2', {
//           images: response?.result,
//           colors: uniqueColorsArray,
//           selectedImages: resizedPayload,
//           fineImages: selectedImages,
//         });
//       } else {
//         setLoading(false);
//         ToastMessage(response?.data?.responseMessage || 'Upload failed');
//       }
//     } catch (err) {
//       console.log('SingleImage error:', err);
//       setLoading(false);
//       ToastMessage(err?.message || 'Something went wrong');
//     }
//   };

//   const previewUri = ensureFileUri(selectedImages?.path || selectedImages?.uri);

//   return (
//     <>
//       <View style={styles.imageContainer}>
//         {!!previewUri && <Image style={styles.imbg} source={{uri: previewUri}} />}

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

//         {/* Optional: quick visual of extracted colors */}
//         {extracted.length > 0 && (
//           <View style={{position: 'absolute', bottom: 130, alignSelf: 'center'}}>
//             <View style={{flexDirection: 'row', gap: 8}}>
//               {extracted.slice(0, 6).map((c) => (
//                 <View key={c} style={{alignItems: 'center'}}>
//                   <View style={{width: 24, height: 24, borderRadius: 4, backgroundColor: c}} />
//                   <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>{c}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}

//         {loading && <Loader />}
//       </View>
//     </>
//   );
// }

// /* -------------------------------- styles ------------------------------- */

// const styles = StyleSheet.create({
//   imbg: {
//     flex: 1,
//     width: '100%',
//     resizeMode: 'cover',
//     backgroundColor: COLORS.black,
//     height: '60%',
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
//     paddingTop: width * 0.5,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     backgroundColor: COLORS.black,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
// SingleImage.js

// import React, {useState} from 'react';
// import {
//   StyleSheet,
//   View,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
//   NativeModules,
//   Text,
// } from 'react-native';
// import imagePath from '../../../utils/imagePath';
// import {COLORS, SCREEN_WIDTH} from '../../../utils/constants';
// import {uploadImages} from '../../../services/AppApi';
// import {ToastMessage} from '../../../components/ToastMessage';
// import Loader from '../../../components/Loader';
// import RNFS from 'react-native-fs';
// import ImageResizer from '@bam.tech/react-native-image-resizer';

// const {width} = Dimensions.get('window');

// /* ------------------------------ helpers ------------------------------ */

// const ensureFileUri = (p) => {
//   if (!p) return '';
//   if (/^(file|content):\/\//i.test(p)) return p; // already URI
//   return `file://${p}`; // make it a URI
// };

// /**
//  * Wrapper for @somesoap/react-native-image-palette with verbose logging:
//  * - Finds the native module
//  * - Tries multiple method names & calling conventions
//  * - Logs raw swatches and normalized colors
//  * - Returns a deduped array of HEX strings
//  */
// const getPaletteColors = async (inputPath) => {
//   const ImagePalette =
//     NativeModules.ImagePalette ||
//     NativeModules.ImagePaletteModule ||
//     NativeModules.RNImagePalette ||
//     null;

//   console.log('[Palette] 🔎 NativeModules keys:', Object.keys(NativeModules || {}));
//   console.log('[Palette] 🔌 ImagePalette native module:', ImagePalette || {});

//   if (!ImagePalette) {
//     console.warn('[Palette] ❌ Native module not found');
//     return [];
//   }

//   const uri = ensureFileUri(inputPath);
//   console.log('[Palette] 📷 inputPath:', inputPath);
//   console.log('[Palette] 📄 uri used for calls:', uri);

//   const candidates = [
//     'getAllSwatches',
//     'getAllSwatchesFromImage',
//     'getSwatches',
//     'getPalette',
//   ];

//   let swatches = null;
//   let pickedMethod = null;

//   for (const name of candidates) {
//     const fn = ImagePalette[name];
//     if (typeof fn !== 'function') continue;

//     // Some forks accept (uri), some (path), some ({uri})
//     const attempts = [
//       {desc: `${name}(uri)`, call: () => fn(uri)},
//       {
//         desc: `${name}(rawPath-android)`,
//         call: () =>
//           Platform.OS === 'android'
//             ? fn(uri.replace(/^file:\/\//, ''))
//             : Promise.reject(new Error('skip-android-rawPath')),
//       },
//       {desc: `${name}({uri})`, call: () => fn({uri})},
//     ];

//     for (const attempt of attempts) {
//       try {
//         console.log('[Palette] ▶️ trying:', attempt.desc);
//         const out = await attempt.call();
//         if (out) {
//           swatches = out;
//           pickedMethod = attempt.desc;
//           break;
//         }
//       } catch (e) {
//         console.log('[Palette] ⚠️ attempt failed:', attempt.desc);
//       }
//     }
//     if (swatches) break;
//   }

//   if (!swatches) {
//     console.warn('[Palette] ❌ No compatible method or all calls failed.');
//     return [];
//   }

//   console.log('[Palette] ✅ picked method:', pickedMethod);
//   console.log('[Palette] 🧪 raw swatches from native:', swatches);

//   // Normalize to string[] of HEX colors
//   let colors = [];
//   if (Array.isArray(swatches)) {
//     colors = swatches
//       .map((x) => (typeof x === 'string' ? x : x && x.color))
//       .filter(Boolean);
//   } else if (swatches && typeof swatches === 'object') {
//     colors = Object.values(swatches)
//       .map((v) => (typeof v === 'string' ? v : v && v.color))
//       .filter(Boolean);
//   }

//   // Dedupe + normalize case
//   const uniqueColors = Array.from(
//     new Set(colors.map((c) => String(c).trim().toUpperCase())),
//   );

//   // 🔊 EXTRA LOGS: clearly show what came back
//   if (!uniqueColors.length) {
//     console.log('[Palette] ⚪ No colors extracted.');
//   } else {
//     console.log('[Palette] 🎨 COLORS EXTRACTED (count):', uniqueColors.length);
//     uniqueColors.forEach((c, i) => console.log(`[Palette] 🎯 color #${i + 1}:`, c));
//   }

//   return uniqueColors;
// };

// /* ---------------------------- main component ---------------------------- */

// export default function SingleImage(props) {
//   // Expecting a single image object like: { path, data, mime, ... }
//   const selectedImages = props?.route?.params?.selectedImages;
//   const [loading, setLoading] = useState(false);
//   const [extracted, setExtracted] = useState([]);

//   const handleSend = async () => {
//     setLoading(true);
//     try {
//       if (!selectedImages?.path) {
//         throw new Error('No image path provided');
//       }

//       // ---- 1) Extract colors ----
//       const inputPath =
//         Platform.OS === 'ios'
//           ? `file://${selectedImages.path}`
//           : selectedImages.path;

//       console.log('[SingleImage] 🚀 extracting colors for:', inputPath);
//       const uniqueColorsArray = await getPaletteColors(inputPath);

//       // EXTRA LOGS: mark the moment colors arrive to the screen state
//       console.log('[SingleImage] ✅ colors received (len):', uniqueColorsArray.length);
//       console.log('[SingleImage] ✅ colors array:', uniqueColorsArray);
//       uniqueColorsArray.forEach((c, idx) =>
//         console.log(`[SingleImage] ✅ color[${idx}]`, c),
//       );

//       setExtracted(uniqueColorsArray);

//       // ---- 2) Resize the image ----
//       const resizedImage = await ImageResizer.createResizedImage(
//         selectedImages.path,
//         SCREEN_WIDTH,
//         300,
//         'JPEG',
//         100,
//         0,
//         undefined,
//         false,
//         {mode: 'contain'},
//       );

//       const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');
//       const resizedPayload = {
//         file: resizedImage?.uri,
//         name: resizedImage?.name,
//         height: resizedImage?.height,
//         width: resizedImage?.width,
//         data: base64Image,
//       };
//       console.log('[Resize] 📦 resized payload:', resizedPayload);

//       // ---- 3) Upload original (your API expects base64 in fileArr[0].file) ----
//       const response = await uploadImages({
//         fileArr: [
//           {
//             file: selectedImages?.data, // base64 from your picker
//             type: selectedImages?.mime || 'image/jpeg',
//             name: 'Img/JPEG',
//           },
//         ],
//       });

//       console.log('[Upload] 🌐 response:', response);

//       // ---- 4) Handle server response & navigate ----
//       if (response?.responseCode === 200) {
//         console.log(
//           '[SingleImage] 📦 navigating with colors (len):',
//           uniqueColorsArray.length,
//           '->',
//           uniqueColorsArray,
//         );
//         setLoading(false);
//         props.navigation.navigate('Categories2', {
//           images: response?.result,
//           colors: uniqueColorsArray,
//           selectedImages: resizedPayload,
//           fineImages: selectedImages,
//         });
//       } else {
//         setLoading(false);
//         ToastMessage(response?.data?.responseMessage || 'Upload failed');
//       }
//     } catch (err) {
//       console.log('[SingleImage] ❌ error:', err);
//       setLoading(false);
//       ToastMessage(err?.message || 'Something went wrong');
//     }
//   };

//   const previewUri = ensureFileUri(selectedImages?.path || selectedImages?.uri);

//   return (
//     <>
//       <View style={styles.imageContainer}>
//         {!!previewUri && <Image style={styles.imbg} source={{uri: previewUri}} />}

//         <TouchableOpacity
//           style={[
//             Platform.OS === 'android' ? styles.androidbackImg : styles.iosbackImg,
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

//         {/* Small preview of extracted colors */}
//         {extracted.length > 0 && (
//           <View style={{position: 'absolute', bottom: 130, alignSelf: 'center'}}>
//             <View style={{flexDirection: 'row', gap: 8}}>
//               {extracted.slice(0, 6).map((c) => (
//                 <View key={c} style={{alignItems: 'center', marginHorizontal: 4}}>
//                   <View
//                     style={{
//                       width: 24,
//                       height: 24,
//                       borderRadius: 4,
//                       backgroundColor: c,
//                       borderWidth: 1,
//                       borderColor: '#000',
//                     }}
//                   />
//                   <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>{c}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}

//         {loading && <Loader />}
//       </View>
//     </>
//   );
// }

// /* -------------------------------- styles ------------------------------- */

// const styles = StyleSheet.create({
//   imbg: {
//     flex: 1,
//     width: '100%',
//     resizeMode: 'cover',
//     backgroundColor: COLORS.black,
//     height: '60%',
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
//     paddingTop: width * 0.5,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     backgroundColor: COLORS.black,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
