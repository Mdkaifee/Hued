import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseView from '../../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
import TextComponent from '../../../components/TextComponent';
import Image360Viewer from '@hauvo/react-native-360-image-viewer/lib';
import SimilarOutfits from '../../../components/SimilarOutfits';
import {postRecommendationsApi} from '../../../services/AppApi';
const {height, width} = Dimensions.get('window');
export default function OutfitDetail(props) {
  const outfit = props?.route?.params?.outfitDetail;
  const downloadedImages = props?.route?.params?.downloadedImages;
  console.log('downloadImages', downloadedImages);
  console.log('outfitdeets', outfit);
  const colorsArray = outfit?.colors || [];
  const image = outfit?.image;
  console.log('image', image);
  const data = [{}, {}, {}];
  const [similarData, setSimilarData] = useState([]);
  function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  useEffect(() => {
    handleSimilar();
  }, []);

  const handleSimilar = async () => {
    const data = {
      category: outfit?.category?._id,
      colors: colorsArray,
    };
    console.log('datasendingfromsimilkar', data);
    const response = await postRecommendationsApi(data);
    console.log('responsefromsimilar', JSON.stringify(response));
    setSimilarData(response?.result);
  };
  const renderItem = ({item}) => (
    <View>
      <SimilarOutfits data={item} />
    </View>
  );
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{
        backgroundColor: COLORS.white,
      }}>
      <View style={styles.mainView}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
              style={styles.bigImg}
              source={
                outfit?.image ? {uri: outfit?.image[0]?.file} : imagePath.bigMan
              }
            />
          )}

          <TouchableOpacity
            style={styles.backImg}
            onPress={() => props.navigation.goBack()}>
            <Image source={imagePath.Back} tintColor={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.matchinText}>{i18n.t('outfit.matching')}</Text>
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
              <TextComponent
                label={i18n.t('outfit.name')}
                value={outfit?.name}
              />
              <TextComponent
                label={i18n.t('outfit.age')}
                value={outfit?.ageStart + '-' + outfit?.ageEnd}
              />
              <TextComponent
                label={i18n.t('outfit.weather')}
                value={outfit?.weather ? outfit.weather.join(', ') : ''}
              />
            </View>
            <View style={styles.columnView}>
              <TextComponent
                label={i18n.t('outfit.category')}
                value={capitalizeFirstLetter(outfit?.category?.name)}
              />
              <TextComponent
                label={i18n.t('outfit.style')}
                value={outfit?.style ? outfit.style.join(', ') : ''}
              />
              <TextComponent
                label={i18n.t('outfit.occasion')}
                value={outfit?.occasion ? outfit.occasion.join(', ') : ''}
              />
            </View>
          </View>
          {similarData?.length > 0 && (
            <View style={styles.recommendationView}>
              <Text style={styles.similarText}>{i18n.t('outfit.similar')}</Text>

              <View style={{flex: 1, paddingHorizontal: 20}}>
                <FlatList
                  data={similarData}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  contentContainerStyle={styles.flatlistStyle}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  bigImg: {
    width: '100%',
    height: height * 0.5,
  },
  backImg: {
    position: 'absolute',
    top: 20,
    left: 30,
    backgroundColor: COLORS.outer,
    height: 34,
    width: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flexDirection: 'row',

    alignSelf: 'center',
    gap: 16,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  columnView: {
    // flexDirection: 'row',
    flex: 1,
  },
  colorItem: {
    width: width * 0.2,
    marginEnd: 6,
    borderRadius: 6,
    height: 36,
  },
  matchinText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.lightBlack,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 20,
    marginTop: 12,
    paddingHorizontal: 20,
  },

  colorView: {
    backgroundColor: 'transparent',
    marginHorizontal: 20,
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
  similarText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 12,
  },
  flatlistStyle: {
    paddingTop: 16,
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  noDataText: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 22,
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
    right: 30,
  },
});
