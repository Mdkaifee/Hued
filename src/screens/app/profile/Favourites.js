import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React from 'react';
import BaseView from '../../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
import CommonHeader from '../../../components/CommonHeader';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
// import TextInputWithLabel from '../../../components/TextInputWLabel';
// import CustomButton from '../../../components/CustomButton';
const {height, width} = Dimensions.get('window');
export default function Favourites() {
  const data = [{}, {}, {}, {}, {}, {}, {}];
  const renderItem = ({item}) => (
    <View style={styles.container}>
      <View style={styles.imgView}>
        <Image style={styles.img} source={imagePath.favGirl} />
        <TouchableOpacity style={styles.likeView}>
          <Image source={imagePath.liked} />
        </TouchableOpacity>
      </View>
      <Text style={styles.nameText}>{i18n.t('fav.reversible')}</Text>
    </View>
  );
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
      }}>
      <CommonHeader title={i18n.t('fav.fav')} imageLeft={imagePath.Back} />
      <View style={styles.mainView}>
        <FlatList
          data={data}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 14,
  },

  container: {
    marginBottom: 26,
    // flex: 1 / 2,
  },
  likeView: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 10,
    padding: 7,
    top: 8,
    backgroundColor: COLORS.white,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    textAlign: 'center',
    marginTop: 16,
    flex: 1,
    fontSize: FONT_SIZES.twelve,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 16,
  },

  img: {
    width: width / 2 - 26,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
