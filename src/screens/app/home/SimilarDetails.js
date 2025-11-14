import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import React from 'react';
import BaseView from '../../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
import CommonHeader from '../../../components/CommonHeader';
import imagePath from '../../../utils/imagePath';
import Image360Viewer from '@hauvo/react-native-360-image-viewer/lib';
import TextComponent from '../../../components/TextComponent';
const {height, width} = Dimensions.get('window');

export default function SimilarDetails(props) {
  const data = props?.route?.params?.exploreDetail;
  const downloadedImages = props?.route?.params?.downloadedImages;
  console.log('datain detailll', data);
  const image = data?.image;
  const colorsArray = data?.colors || [];
  const formatViewCounts = count => {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      const roundedCount = Math.round(count / 1000);
      return `${roundedCount}k`;
    } else {
      const roundedCount = Math.round(count / 1000000);
      return `${roundedCount}M`;
    }
  };

  const formattedViewCounts = formatViewCounts(data?.viewCounts);
  console.log('imagefrom wradrobe', image);
  function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{backgroundColor: COLORS.white, paddingHorizontal: 20}}>
      <CommonHeader imageLeft={imagePath.Back} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.mainView}>
          {image?.length > 1 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image360Viewer
                srcset={downloadedImages?.map(image => {
                  return {uri: image};
                })}
                width={width * 0.9}
                height={height * 0.5}
                style={{resizeMode: 'contain'}}
              />
              <View style={styles.dd}>
                <Image style={{height: 24, width: 24}} source={imagePath.dd} />
              </View>
            </View>
          ) : (
            <Image
              style={styles.img}
              source={
                data?.image ? {uri: data?.image[0]?.file} : imagePath.girl
              }
            />
          )}
          {/* <TouchableOpacity style={styles.likeView}>
              <Image source={imagePath.likeE} />
            </TouchableOpacity> */}
          <View style={styles.viewsView}>
            <Image style={{width: 9, height: 6}} source={imagePath.whiteEye} />
            <Text style={styles.viewText}>{formattedViewCounts}</Text>
            {/* <Text style={styles.viewText}>{data?.viewCounts}</Text> */}
          </View>

          <View style={styles.texthangerView}>
            <Text style={styles.blackText}>{data?.name}</Text>
          </View>
          <Text style={styles.matchinText}>Matching Colors</Text>
          <View>
            <ScrollView
              style={styles.colorView}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {colorsArray.map((color, index) => (
                <View
                  key={index}
                  style={{
                    ...styles.colorItem,
                    backgroundColor: color,
                  }}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.container}>
            <View style={styles.columnView}>
              <TextComponent label={'Posted by'} value={data?.userId?.name} />
              <TextComponent
                label={'Age'}
                value={data?.ageStart + '-' + data?.ageEnd}
              />
              <TextComponent
                label={'Weather'}
                value={data?.weather ? data.weather.join(', ') : ''}
              />
              <TextComponent
                label={'Gender'}
                value={data?.gender ? data?.gender : ''}
              />
            </View>
            <View style={styles.columnView}>
              <TextComponent
                label={'Category'}
                value={capitalizeFirstLetter(data?.category?.name)}
              />
              <TextComponent
                label={'Style'}
                value={data?.style ? data.style.join(', ') : ''}
              />
              <TextComponent
                label={'Occasion'}
                value={data?.occasion ? data.occasion.join(', ') : ''}
              />
              <TextComponent
                label={'Price'}
                value={'$' + data?.priceStart + '- ' + '$' + data?.priceEnd}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 16,
  },
  img: {
    resizeMode: 'cover',
    width: '100%',
    alignSelf: 'center',
    height: 450,
    backgroundColor: 'green',
  },
  likeView: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 12,
    top: 12,
    paddingRight: 1,
    backgroundColor: '#FFFFFFCC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  viewsView: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000033',
    borderRadius: 18,
    gap: 4,
    paddingHorizontal: 4,
    height: 18,
    width: 44,
  },
  viewText: {
    fontSize: FONT_SIZES.ten,
    color: COLORS.white,
    fontFamily: FONT_FAMILIES.medium,
  },
  blackText: {
    fontSize: FONT_SIZES.eighteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
  },
  texthangerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  hangerView: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4,
    width: 24,
    height: 24,
  },
  orangeText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.primary,
    fontFamily: FONT_FAMILIES.medium,
    marginTop: 6,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center',
    gap: 16,
    // paddingHorizontal: 20,
    marginTop: 20,
  },
  columnView: {
    // flexDirection: 'row',
    flex: 1,
  },
  colorView: {
    backgroundColor: 'transparent',

    marginTop: 8,
    flexDirection: 'row',
  },
  colorItemFirst: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },

  colorItemLast: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  matchinText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.lightText,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 20,
    marginTop: 12,
  },
  colorItem: {
    width: width * 0.2,
    marginEnd: 6,
    borderRadius: 6,
    height: 36,
  },
  dd: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: COLORS.outer,
    height: 36,
    width: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
  },
});
