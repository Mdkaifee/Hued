// import { View, Text } from 'react-native'
// import React from 'react'

// const ExploreComponent = () => {
//   return (
//     <View>
//       <Text>ExploreComponent</Text>
//     </View>
//   )
// }

// export default ExploreComponent

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
// import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
import {useNavigation} from '@react-navigation/native';
import Loader from './Loader';
import {GetViewsApi, WardrobeApi} from '../services/AppApi';
import {ToastMessage} from './ToastMessage';
const {height, width} = Dimensions.get('window');
export default function ExploreComponent({data, openSheet}) {
  const navigation = useNavigation();
  const [isFav, setIsFav] = useState();
  useEffect(() => {
    setIsFav(data?.favourite || false);
  }, [data]);

  const [loading, setLoading] = useState(false);
  // console.log('data of explore', data);
  const image = data?.image;
  // console.log('image', data?.image);

  const handleWardrobe = async () => {
    const response = await WardrobeApi(data?._id);
    const updatedFav = !isFav;
    setIsFav(updatedFav);
    ToastMessage(response?.responseMessage);
  };
  const handleSend = async () => {
    setLoading(true);
    try {
      const downloadedUris = [];

      for (const imageUrl of image) {
        const fileName = generateFileName(imageUrl?.file);
        const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        try {
          const exists = await RNFS.exists(filePath);

          if (exists) {
            // File already exists, add it to the downloadedUris array
            downloadedUris.push(`file://${filePath}`);
          } else {
            // File doesn't exist, download it
            const response = await RNFS.downloadFile({
              fromUrl: imageUrl?.file,
              toFile: filePath,
            }).promise;

            if (response.statusCode === 200) {
              downloadedUris.push(`file://${filePath}`);
            } else {
              console.error('Failed to download image:', response);
            }
          }
        } catch (error) {
          console.error('Error checking or downloading image:', error);
        }
      }

      setLoading(false);

      console.log('downloadedarrayofimages', downloadedUris);
      handleViews();
      setTimeout(() => {
        navigation.navigate('ExploreDetails', {
          exploreDetail: data,
          downloadedImages: downloadedUris,
        });
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Error downloading images:', error);
    }
  };

  const handleViews = async () => {
    const response = await GetViewsApi(data?._id);
    console.log('response from VIEWSS', response);
  };
  const generateFileName = url => {
    const fileName = url.split('/').pop();
    return fileName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imgView} onPress={handleSend}>
        <Image
          style={styles.img}
          source={data?.image ? {uri: data.image[0]?.file} : imagePath.favGirl}
        />
        {/* <TouchableOpacity style={styles.likeView}>
          <Image source={imagePath.like} />
        </TouchableOpacity> */}
        <View style={styles.curveView} />
        <TouchableOpacity
          style={styles.menuView}
          onPress={() => openSheet(data?._id)}>
          {isFav ? (
            <Image source={imagePath.liked} />
          ) : (
            <Image tintColor={COLORS.white} source={imagePath.like} />
          )}
        </TouchableOpacity>
        {/* <Image style={styles.img1} source={imagePath.curve} /> */}
      </TouchableOpacity>
      <Text style={styles.nameText}>{data?.name}</Text>
      <Text style={styles.leoText}>{data?.userId?.name}</Text>

      {loading && <Loader />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    width: width / 2 - 28,

    // flex: 1 / 2,
  },
  likeView: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 10,
    padding: 7,
    top: 8,
    backgroundColor: '#FFFFFFCC',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    textAlign: 'center',
    marginTop: 8,
    flex: 1,
    fontSize: FONT_SIZES.twelve,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 18,
  },
  leoText: {
    textAlign: 'center',
    marginTop: 2,
    flex: 1,
    fontSize: FONT_SIZES.twelve,
    color: COLORS.primary,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 18,
  },

  img: {
    width: width / 2 - 28,
    height: 190,
    borderRadius: 20,
    backgroundColor: '#ededed',
    // backgroundColor: '#b5aba7',
  },
  img1: {
    marginBottom: 20,
    marginTop: -65,
    width: '100%',
    alignSelf: 'center',
  },
  menuView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: 'white',
    marginTop: -20,
  },
  //   curveView: {
  //     width: 52,
  //     position: 'absolute',
  //     height: 50,
  //     backgroundColor: 'green',
  //     bottom: 0,
  //     alignSelf: 'center',
  //     borderTopLeftRadius: 40,
  //     borderTopRightRadius: 40,
  //   },
});
