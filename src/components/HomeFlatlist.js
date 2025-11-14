import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import RNFS from 'react-native-fs';
import React, {useState} from 'react';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
import i18n from '../translation/i18n';
import {useNavigation} from '@react-navigation/native';
import imagePath from '../utils/imagePath';
// import Image360Viewer from '@hauvo/react-native-360-image-viewer/lib';
import Loader from './Loader';
import MenuBar from '../modals/MenuBar';
import DeleteModal from '../modals/DeleteModal';
import {deleteOutfitFromHomeApi, publicPrivateApi} from '../services/AppApi';
import {ToastMessage} from './ToastMessage';
import PublicModal from '../modals/PublicModal';
const {height, width} = Dimensions.get('window');
export default function HomeFlatlist({item, handleRefreshHome, openSheet}) {
  // const [imageUris, setImageUris] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  console.log('outfitfrom home', item);
  const image = item?.image;
  // console.log('image', item.image);
  const [menuVisible, setMenuVisible] = useState(false);
  const closeMenu = () => {
    setMenuVisible(false);
  };

  const openMenu = () => {
    setMenuVisible(true);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    closeMenu();
    setTimeout(() => {
      setModalVisible(true);
    }, 500);
  };
  const [modalPublicVisible, setModalPublicVisible] = useState(false);
  const closePublicModal = () => {
    setModalPublicVisible(false);
  };

  const openPublicModal = () => {
    closeMenu();
    setTimeout(() => {
      setModalPublicVisible(true);
    }, 500);
  };
  const handleEdit = () => {
    setLoading(true);

    if (image.length > 1) {
      handleSend2();
    } else {
      setLoading(false);
      navigation?.navigate('EditCategories2', {outfitDetail: item});
    }
  };
  const handleDeleteOutfit = async () => {
    setLoading(true);
    const response = await deleteOutfitFromHomeApi(item?._id);
    console.log('responsefromdeleteHome', response);
    if (response?.responseCode === 200) {
      setLoading(false);
      ToastMessage('Outfit deleted successfully');
      handleRefreshHome();
    } else {
      setLoading(false);
      ToastMessage(response?.data?.responseMessage);
    }
  };

  const handlePublicPrivate = async () => {
    setLoading(true);
    const response = await publicPrivateApi(item?._id);
    console.log('publiccc', response);
    if (response?.responseCode === 200) {
      setLoading(false);
      ToastMessage(response?.responseMessage);
      handleRefreshHome();
    } else {
      setLoading(false);
      ToastMessage(response?.data?.responseMessage);
    }
  };

  const handleCollection = () => {
    closeMenu();
    setTimeout(() => {
      openSheet(item?._id);
    }, 500);
  };
  const handleSend = async () => {
    setLoading(true);
    try {
      const downloadedUris = [];

      for (const imageUrl of image) {
        console.log('imageurlll', imageUrl);
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
        navigation.navigate('OutfitDetail', {
          outfitDetail: item,
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
  const handleSend2 = async () => {
    try {
      const downloadedUris = [];

      for (const imageUrl of image) {
        const fileName = generateFileName2(imageUrl?.file);
        const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        try {
          const exists = await RNFS.exists(filePath);

          if (exists) {
            const imageInfo = {
              file: `file://${filePath}`,
              width: imageUrl?.width,
              height: imageUrl?.width,
            };
            // File already exists, add it to the downloadedUris array
            downloadedUris.push(imageInfo);
          } else {
            // File doesn't exist, download it
            const response = await RNFS.downloadFile({
              fromUrl: imageUrl?.file,
              toFile: filePath,
            }).promise;

            if (response.statusCode === 200) {
              const imageInfo = {
                file: `file://${filePath}`,
                width: imageUrl?.width,
                height: imageUrl?.width,
              };
              downloadedUris.push(imageInfo);
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
        navigation.navigate('EditCategories', {
          outfitDetail: item,
          downloadedImages: downloadedUris,
        });
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Error downloading images:', error);
    }
  };

  const generateFileName2 = url => {
    const fileName = url.split('/').pop();
    return fileName;
  };

  return (
    <TouchableOpacity style={styles.sectionView} onPress={handleSend}>
      <Image
        style={styles.imgStyle}
        source={item?.image ? {uri: item?.image[0]?.file} : imagePath.bigMan}
      />

      {item?.isPrivate === false && (
        <View style={styles.viewsView}>
          <Image source={imagePath.eye1} />
          <Text style={styles.ViewsText}>0</Text>
        </View>
      )}

      <TouchableOpacity style={styles.dots} onPress={openMenu}>
        <Image style={{height: 17, width: 17}} source={imagePath.dots} />
      </TouchableOpacity>

      <Text style={styles.clothText}>{item.name}</Text>
      <MenuBar
        closeMenu={closeMenu}
        visible={menuVisible}
        deleteButton={openModal}
        publicButton={openPublicModal}
        editButton={handleEdit}
        collectionButton={handleCollection}
        text={
          item?.isPrivate ? i18n.t('public.makeit') : i18n.t('public.makeitp')
        }
      />
      <DeleteModal
        visible={modalVisible}
        closeModal={closeModal}
        navigation={navigation}
        handleVerify={handleDeleteOutfit}
      />
      <PublicModal
        visible={modalPublicVisible}
        closeModal={closePublicModal}
        navigation={navigation}
        handleVerify={handlePublicPrivate}
        text={item?.isPrivate ? i18n.t('public.pub') : i18n.t('public.pp')}
        text1={item?.isPrivate ? 'Public' : 'Private'}
      />
      {loading && <Loader />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sectionView: {
    // marginBottom: 20,
    marginRight: 14,
    width: width / 2 - 28,
  },
  imgStyle: {
    width: width / 2 - 28,
    height: 200,
    backgroundColor: '#ededed',
  },
  viewsView: {
    position: 'absolute',
    top: 6,
    flexDirection: 'row',
    backgroundColor: COLORS.outer,
    alignItems: 'center',
    justifyContent: 'center',
    height: 18,
    width: 40,
    borderRadius: 18,
    left: 6,
    gap: 2,
  },
  ViewsText: {
    fontSize: FONT_SIZES.ten,
    color: COLORS.white,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 13,
  },
  clothText: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 16,
    marginTop: 6,
  },
  dots: {
    position: 'absolute',
    top: 6,
    flexDirection: 'row',
    backgroundColor: COLORS.outer,
    alignItems: 'center',
    justifyContent: 'center',
    height: 16,
    width: 26,
    borderRadius: 6,
    right: 6,
  },
});
