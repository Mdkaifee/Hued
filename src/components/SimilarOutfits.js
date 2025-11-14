import {StyleSheet, Text, View, Image, Dimensions,TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import imagePath from '../utils/imagePath';
// import {TouchableOpacity} from 'react-native-gesture-handler';
const {height, width} = Dimensions.get('window');
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import Loader from './Loader';
export default function SimilarOutfits({data}) {
  const [loading, setLoading] = useState(false);
  console.log('data of similar outfit', data);

  const navigation = useNavigation();
  const image = data?.image;
  console.log('image', image);
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
        navigation.navigate('SimilarDetails', {
          exploreDetail: data,
          downloadedImages: downloadedUris,
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
    <TouchableOpacity style={styles.container} onPress={handleSend}>
      <Image
        style={styles.img}
        source={data?.image ? {uri: data?.image[0]?.file} : imagePath.bigMan}
      />

      {loading && <Loader />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  img: {
    width: width / 2 - 26,
    height: 150,
    borderRadius: 4,
  },
});
