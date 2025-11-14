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
// import RNFS from 'react-native-fs';
// import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
// import {WardrobeApi} from '../services/AppApi';
import Loader from './Loader';
import {useNavigation} from '@react-navigation/native';
// import {ToastMessage} from './ToastMessage';
const {height, width} = Dimensions.get('window');
export default function WardrobeCollectionComponent({
  data,
  handleWardrobeRefresh,
}) {
  const [loading, setLoading] = useState(false);
  console.log('datafromwardrobeCollection', data);
  const navigation = useNavigation();
  const image = data?.image;
  console.log('image', image);
  const outfits = data?.outfits;
  console.log('poutfitimageee', JSON.stringify(outfits));
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imgView}
        onPress={() =>
          navigation.navigate('Wardrobe2', {
            data: data?.outfits,
            name: data?.name,
            id: data?._id,
          })
        }>
        {outfits?.length === 0 ? (
          <View
            style={{
              height: 168,
              width: width / 2 - 32,

              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.bgColor,
              borderRadius: 6,
            }}>
            <Image style={{height: 54, width: 54}} source={imagePath.shirt2} />
          </View>
        ) : outfits.length >= 3 ? (
          <>
            <View style={{gap: 0.6, flex: 1}}>
              <Image
                style={styles.img0}
                source={{uri: outfits[0]?.outfitId?.image[0]?.file}}
              />
              <Image
                style={styles.img2}
                source={{uri: outfits[1]?.outfitId?.image[0]?.file}}
              />
            </View>
            <View style={{gap: 0.6, flex: 1}}>
              <Image
                style={styles.img3}
                source={{uri: outfits[2]?.outfitId?.image[0]?.file}}
              />
              <Image
                style={styles.img4}
                source={{uri: outfits[3]?.outfitId?.image[0]?.file}}
              />
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                height: 168,
                width: width / 2 - 32,

                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.bgColor,
                borderRadius: 6,
              }}>
              <Image
                style={{
                  height: 168,
                  width: width / 2 - 32,

                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.bgColor,
                  borderRadius: 6,
                }}
                source={{uri: outfits[0]?.outfitId?.image[0]?.file}}
              />
            </View>
          </>
        )}
      </TouchableOpacity>
      <Text style={styles.nameText}>
        {data?.name ? data?.name : 'Collection'}
      </Text>
      {/* <Text style={styles.leoText}>{data?.userId?.name}</Text> */}
      {loading && <Loader />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: width / 2 - 32,

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
    // textAlign: 'center',
    marginTop: 8,
    flex: 1,
    fontSize: FONT_SIZES.twelve,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
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
    width: 54,
    height: 54,
    borderRadius: 4,
    backgroundColor: COLORS.lightest,
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
  imgView: {
    flexDirection: 'row',
    width: width / 2 - 32,
    gap: 0.6,
    backgroundColor: COLORS.bgColor,
    borderRadius: 6,
    overflow: 'hidden',
    height: 168,
  },
  img0: {
    borderTopLeftRadius: 6,
    resizeMode: 'cover',
    height: 84,

    backgroundColor: COLORS.bgColor,
  },
  img2: {
    // width: 84,
    height: 84,
    resizeMode: 'cover',
    // borderRadius: 4,
    backgroundColor: COLORS.bgColor,

    borderBottomLeftRadius: 6,
  },
  img3: {
    // width: 84,
    height: 84,
    resizeMode: 'cover',
    borderTopRightRadius: 6,
    backgroundColor: COLORS.bgColor,
  },
  img4: {
    // width: 84,
    height: 84,
    resizeMode: 'cover',
    backgroundColor: COLORS.bgColor,
    borderBottomRightRadius: 6,
  },
});
