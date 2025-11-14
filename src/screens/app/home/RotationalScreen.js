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
// import TextInputWImage from '../../../components/TextInputWImage';
import CustomButton from '../../../components/CustomButtton';
import {createOutfitApi} from '../../../services/AppApi';
import {VARIABLES} from '../../../utils/globalVariables';
import {ToastMessage} from '../../../components/ToastMessage';
import Image360Viewer from '@hauvo/react-native-360-image-viewer/lib';
import Loader from '../../../components/Loader';
import AskPublic from '../../../modals/AskPublic';
import {useNavigation} from '@react-navigation/native';
const {height, width} = Dimensions.get('window');
export default function RotationScreen(props) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
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
  // const url = JSON.parse(VARIABLES.url);
  const fineImages = props?.route?.params?.fineImages;

  const categoryName = props?.route?.params?.categoryName;
  // console.log('url', url);
  console.log('category:', category);
  console.log('colors:', colors);
  console.log('ageStart:', ageStart);
  console.log('ageEnd:', ageEnd);
  console.log('priceStart:', priceStart);
  console.log('priceEnd:', priceEnd);
  console.log('style:', style);
  console.log('weather:', weather);
  console.log('occasion:', occasion);
  console.log('images:', images);
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      setModalVisible(true);
    }
  };
  const [name, setName] = useState('');

  const maxCharacters = 20;
  const handleTextChange = text => {
    if (text.length <= maxCharacters) {
      setName(text);
    }
  };
  const checkRequiredFields = () => {
    if (name.trim() == '') {
      ToastMessage(i18n.t('toastMessage.name'));
      return false;
    } else return true;
  };

  const handleCreateOutfit = async value => {
    const isPrivate = value;
    console.log('ispublicccc', isPrivate);

    setLoading(true);
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
      isPrivate: isPrivate === 'no' ? true : false,
    };
    console.log('data', data);
    const response = await createOutfitApi(data);
    console.log('response', response);

    if (response?.responseCode === 200) {
      setLoading(false);
      setTimeout(() => {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'BottomTabNavigator'}],
        });
        ToastMessage('Outfit Created Successfully');
      }, 100);
    } else {
      setLoading(false);
      ToastMessage(response?.data?.responseMessage);
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
        title={i18n.t('create.create')}
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
            {Array.isArray(fineImages) ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                <Image360Viewer
                  srcset={fineImages?.map(image => {
                    return {uri: 'file://' + image.path};
                  })}
                  width={width * 0.9}
                  height={height * 0.4}
                  style={{resizeMode: 'contain'}}
                />
              </View>
            ) : (
              <Image
                source={{uri: 'file://' + fineImages?.path}}
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
                maxLength={maxCharacters}
                value={name}
                onChangeText={handleTextChange}
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
        // onPress={handleCreateOutfit}
        onPress={openModal}
      />
      <AskPublic
        visible={modalVisible}
        closeModal={closeModal}
        navigation={navigation}
        handleVerify={handleCreateOutfit}
        text={i18n.t('public.pub')}
        text1={i18n.t('public.make')}
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
