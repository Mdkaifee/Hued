import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import BaseView from '../../../../BaseView';
import CommonHeader from '../../../components/CommonHeader';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
import TextInputWithLabel from '../../../components/TextInputWLabel';
import TextInputWImage from '../../../components/TextInputWImage';
import CustomButton from '../../../components/CustomButtton';
import {createOutfitApi, updateOutfitApi} from '../../../services/AppApi';
import {VARIABLES} from '../../../utils/globalVariables';
import {ToastMessage} from '../../../components/ToastMessage';
import Image360Viewer from '@hauvo/react-native-360-image-viewer/lib';
import Loader from '../../../components/Loader';
const {height, width} = Dimensions.get('window');
export default function UpdateOutfit(props) {
  const [loading, setLoading] = useState(false);
  const selectedImages = props?.route?.params?.selectedImages;
  const category = props?.route?.params?.category;
  const colors = props?.route?.params?.colors;
  const images = props?.route?.params?.images;
  const ageStart = props?.route?.params?.ageStart;
  const ageEnd = props?.route?.params?.ageEnd;
  const style = props?.route?.params?.style;
  const weather = props?.route?.params?.weather;
  const occasion = props?.route?.params?.occasion;
  const priceStart = props?.route?.params?.priceStart;
  const priceEnd = props?.route?.params?.priceEnd;
  const gender = props?.route?.params?.gender;
  const mainData = props?.route?.params?.mainData;
  // const url = JSON.parse(VARIABLES.url);
  const categoryName = props?.route?.params?.categoryName;
  // console.log('url', url);
  console.log('category:', category);
  console.log('mainData:', mainData);

  console.log('colors:', colors);
  console.log('ageStart:', ageStart);
  console.log('ageEnd:', ageEnd);
  console.log('priceStart:', priceStart);
  console.log('priceEnd:', priceEnd);
  console.log('style:', style);
  console.log('weather:', weather);
  console.log('occasion:', occasion);
  console.log('images:', images);

  const [name, setName] = useState(mainData?.name);
  const checkRequiredFields = () => {
    if (name.trim() == '') {
      ToastMessage(i18n.t('toastMessage.name'));
      return false;
    } else return true;
  };
  const maxCharacters = 20;
  const handleTextChange = text => {
    if (text.length <= maxCharacters) {
      setName(text);
    }
  };
  const handleCreateOutfit = async () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      //   setLoading(true);
      const data = {
        name: name.trim(),
        colors: colors,
        category: category,
        ageStart: ageStart,
        ageEnd: ageEnd,
        style: style,
        weather: weather,
        occasion: occasion,
        priceStart: priceStart,
        priceEnd: priceEnd,
        image: images,
        gender: gender,
        isPrivate: mainData?.isPrivate,
        _id: mainData?._id,
      };
      console.log('data', data);
      const response = await updateOutfitApi(data);
      console.log('response', response);

      if (response?.responseCode === 200) {
        setLoading(false);
        setTimeout(() => {
          props.navigation.reset({
            index: 0,
            routes: [{name: 'BottomTabNavigator'}],
          });
          ToastMessage('Outfit Updated Successfully');
        }, 100);
      } else {
        setLoading(false);
        ToastMessage(response?.data?.responseMessage);
      }
    }
  };
  function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{
        backgroundColor: COLORS.white,
      }}>
      <CommonHeader
        title={i18n.t('create.update')}
        imageLeft={imagePath.Back}
        headerStyle={{paddingHorizontal: 20}}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 30}
        style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 30}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.mainView}>
            {Array.isArray(selectedImages) ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                <Image360Viewer
                  srcset={selectedImages?.map(image => {
                    return {uri: image?.file};
                  })}
                  width={width * 0.9}
                  height={height * 0.4}
                  style={{resizeMode: 'contain'}}
                />
              </View>
            ) : (
              <Image
                source={{uri: selectedImages?.file}}
                style={{
                  width: '100%',
                  height: height * 0.4,
                  resizeMode: 'cover',
                  marginBottom: 20,
                }}
              />
            )}
            <View
              style={[
                {paddingHorizontal: 20},
                Platform.OS === 'android' ? {marginTop: 20} : {marginTop: 0},
              ]}>
              <TextInputWithLabel
                label={i18n.t('create.give')}
                inputStyle={styles.inputStyle}
                inputContainerStyle={styles.inputContainerStyle}
                value={name}
                onChangeText={setName}
              />
              <Text
                style={
                  styles.maximum
                }>{`${name.length}/${maxCharacters}`}</Text>
              <TextInputWithLabel
                label={i18n.t('create.category')}
                inputStyle={styles.inputStyle}
                inputContainerStyle={styles.inputContainerStyle}
                value={capitalizeFirstLetter(categoryName)}
                editable={false}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {loading && <Loader />}
      <CustomButton
        title={i18n.t('create.save')}
        style={{marginHorizontal: 20}}
        onPress={handleCreateOutfit}
      />
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  bigImg: {
    marginTop: -16,
    height: 375,
    width: '100%',
    resizeMode: 'contain',
  },
  inputContainerStyle: {
    borderBottomColor: COLORS.lightBorderLine,
    marginBottom: 2,
  },
  inputStyle: {
    fontSize: FONT_SIZES.fourteen,
    marginTop: -2,
  },
  contentContainer: {
    flex: 1,
  },
  maximum: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.lightText,
    fontFamily: FONT_FAMILIES.medium,
    textAlign: 'right',
  },
});
