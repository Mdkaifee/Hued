import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import RNFS from 'react-native-fs';
// import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
import {WardrobeApi} from '../services/AppApi';
import Loader from './Loader';
import {useNavigation} from '@react-navigation/native';
import {ToastMessage} from './ToastMessage';
const {height, width} = Dimensions.get('window');
export default function WardrobeComponent({data, handleWardrobeRefresh, id}) {
  const [loading, setLoading] = useState(false);
  console.log('data of wardrobe', data);
  console.log(id);
  const navigation = useNavigation();
  const image = data?.outfitId?.image;
  console.log('image', image);

  const handleWardrobe = async () => {
    console.log('dataforwardrobe', data?._id);
    const response = await WardrobeApi(data?._id);
    console.log('responsetosendInwardrobe', response);
    ToastMessage('Outfit removed successfully');
    handleWardrobeRefresh();
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
      setTimeout(() => {
        navigation.navigate('WardrobeDetails', {
          wardrobeDetail: data?.outfitId,
          downloadedImages: downloadedUris,
          id: id,
        });
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Error downloading images:', error);
    }
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
          source={image ? {uri: image[0]?.file} : imagePath.favGirl}
        />
      </TouchableOpacity>

      {loading && <Loader />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginBottom: 15,
    // flex: 1 / 2,
  },

  nameText: {
    // textAlign: 'center',
    // marginTop: 8,
    flex: 1,
    fontSize: FONT_SIZES.twelve,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 18,
  },

  img: {
    width: '100%',
    // height: 54,
    // borderRadius: 4,
    backgroundColor: '#ededed',
    resizeMode: 'cover',
  },

  imgView: {
    flexDirection: 'row',
    width: width / 3 - 1,
    gap: 0.6,
    backgroundColor: COLORS.bgColor,
    // borderRadius: 4,
    overflow: 'hidden',
    height: 120,
    marginBottom: 1,
    marginEnd: 1,
  },
});
