import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Pressable,
  Alert,
  Button,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import BaseView from '../../../../BaseView';
import {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../utils/constants';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
import CategorySelections from '../../../components/CategorySelections';
import StyleSelections from '../../../components/StyleSelection';
import WeatherSelections from '../../../components/WeatherSelection';
import OccasionSelections from '../../../components/OccasionSelections';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomButton from '../../../components/CustomButtton';
import {GetCategoriesApi} from '../../../services/AppApi';
import {ToastMessage} from '../../../components/ToastMessage';
// import Image360Viewer from '@hauvo/react-native-360-image-viewer/lib';
// import {isArray} from 'lodash';
import GenderSelection from '../../../components/GenderSelection';
import GetPixelColor from '@thebeka/react-native-get-pixel-color';

const {height, width} = Dimensions.get('window');
export default function Categories(props) {
  const {navigation} = props;

  const selectedImages = props?.route?.params?.selectedImages;
  console.log('imagesgettingused', selectedImages);
  const [colors, setcolors] = useState(props?.route?.params?.colors);
  const images = props?.route?.params?.images;
  const lightMutedColor = props?.route?.params?.lightMuted;
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const [priceValues, setPriceValues] = useState([0, 10000]);
  const [categoryData, setCategoryData] = useState([]);
  const [isRefreshing, setisRefreshing] = useState(false);
  const [selectedCategory, setselectedCategory] = useState('');
  const [selectedStyle, setselectedStyle] = useState([]);
  const [selectedWeather, setselectedWeather] = useState([]);
  const fineImages = props?.route?.params?.fineImages;

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedOccasion, setselectedOccasion] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedGender, setselectedGender] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex > 0 ? prevIndex - 1 : selectedImages.length - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex < selectedImages.length - 1 ? prevIndex + 1 : 0,
    );
  };
  const [clickCoordinates, setClickCoordinates] = useState({x: 0, y: 0});
  const [bgColor, setbgColor] = useState('');

  // to handle slider
  const handleSliderChangeAge = values => {
    setSliderValues(values);
  };
  const handleSliderChangePrice = values => {
    setPriceValues(values);
  };
  const renderThumb = () => <View style={styles.thumbStyle} />;
  const renderThumb1 = () => <View style={styles.thumbStyle} />;

  // get categori api
  const handleGetCategories = async () => {
    const response = await GetCategoriesApi();

    if (response?.responseCode === 200) {
      setCategoryData(response?.result);
    }
  };

  useEffect(() => {
    handleGetCategories();
  }, []);

  // useEffect(() => {
  //   setupColorFetch();
  // }, [currentIndex]);

  useEffect(() => {
    setupColorFetch();
    setClickCoordinates({x: 0, y: 0});
  }, [currentIndex]);

  // const setupColorFetch = async () => {
  //   await GetPixelColor.init('file://' + selectedImages[currentIndex]?.file);
  // };
  const setupColorFetch = async () => {
    if (Platform.OS === 'ios') {
      await GetPixelColor.init('file://' + selectedImages[currentIndex]?.file);
    } else {
      await GetPixelColor.init(selectedImages[currentIndex]?.data);
    }
  };

  const pullDownRefresh = () => {
    setisRefreshing(true);
    handleGetCategories();
    setisRefreshing(false);
  };

  const handleSelectedCategpry = selectedCategory => {
    setselectedCategory(selectedCategory[0]);
  };

  const handleSelectedStyle = selectedStyle => {
    setselectedStyle(selectedStyle);
  };

  const handleSelectedWeather = selectedWeather => {
    setselectedWeather(selectedWeather);
  };

  const handleSelectedOccasion = selectedOccasion => {
    setselectedOccasion(selectedOccasion);
  };
  const handleSelectedGender = selectedGender => {
    setselectedGender(selectedGender);
  };

  const handlePress = async event => {
    const {locationX, locationY} = event.nativeEvent;
    console.log('Touched at coordinates:', locationX, locationY);
    // console.log('letsscheckk', GetPixelColor.pickColorAt);

    const color = await GetPixelColor.pickColorAt(
      // (locationX * selectedImages[currentIndex]?.width) / SCREEN_WIDTH,
      // (locationY * selectedImages[currentIndex]?.height) /
      //   (SCREEN_HEIGHT * 0.4),

      locationX,
      locationY,
    );
    console.log('coloorssshshj', color);
    setClickCoordinates({x: locationX, y: locationY});
    setbgColor(color);

    const isExisting = colors.indexOf(color);
    console.log(isExisting);

    if (isExisting === -1) {
      setcolors(val => [color, ...val]);
    } else {
      ToastMessage('This color already exists');
    }
  };
  console.log(colors);
  const renderColors = ({item}) => {
    const isSelected = selectedColors.includes(item);

    return (
      <View
        style={{
          paddingRight: 10,
          paddingTop: 6,
        }}>
        <TouchableOpacity
          style={[
            styles.colors,
            {
              backgroundColor: item,
              borderColor: isSelected ? COLORS.primary : 'transparent',
            },
          ]}
          onPress={() => handleColorSelection(item)}
        />
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            right: 6,
            width: 15,
            height: 15,
            backgroundColor: COLORS.lightBorderLine,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
          }}
          onPress={() => {
            // alert();
            setcolors(val => val.filter(i => i !== item));
          }}>
          <Image
            source={imagePath.cross}
            style={{
              width: 10,
              height: 10,
            }}
          />
        </Pressable>
      </View>
    );
  };

  // ...

  // Updated handleColorSelection function
  const handleColorSelection = color => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  useEffect(() => {
    console.log('selecetdCategoryId', selectedCategory);
    console.log('selecetdStyle', selectedStyle);
    console.log('selecetdWeather', selectedWeather);
    console.log('selecetdOccasion', selectedOccasion);
    console.log('ageStart', `${sliderValues[0]}`);
    console.log('ageEnd', `${sliderValues[1]}`);
    console.log('priceStart', `${priceValues[0]}`);
    console.log('priceEnd', `${priceValues[1]}`);
    console.log('category name', categoryName);
    console.log('gender', selectedGender);
  }, [
    selectedCategory,
    selectedStyle,
    selectedWeather,
    selectedOccasion,
    sliderValues,
    priceValues,
    categoryName,
    selectedGender,
  ]);
  // for getting name of category
  const nameOfCategory = () => {
    const selectedCategoryItem = categoryData.find(
      item => item._id === selectedCategory,
    );
    return selectedCategoryItem
      ? selectedCategoryItem.name
      : 'Category not found';
  };
  const categoryName = nameOfCategory();

  const checkRequiredFields = () => {
    if (selectedColors.length === 0) {
      ToastMessage('Please select colors of your outfit');
      return false;
    } else if (!selectedCategory) {
      ToastMessage('Please select a category');
      return false;
    } else if (!selectedGender) {
      ToastMessage('Please select gender ');
      return false;
    } else if (selectedStyle.length === 0) {
      ToastMessage('Please select style of your outfit');
      return false;
    } else if (selectedWeather.length === 0) {
      ToastMessage('Please select weather');
      return false;
    } else if (selectedOccasion.length === 0) {
      ToastMessage('Please select an occasion');
      return false;
    } else return true;
  };

  // for main api creating outfit
  const handleNext = () => {
    const isValid = checkRequiredFields();
    console.log('isValid', isValid);
    if (isValid) {
      props.navigation.navigate('RotationScreen', {
        category: selectedCategory,
        colors: selectedColors,
        ageStart: `${sliderValues[0]}`,
        ageEnd: `${sliderValues[1]}`,
        priceStart: `${priceValues[0]}`,
        priceEnd: `${priceValues[1]}`,
        style: selectedStyle,
        weather: selectedWeather,
        occasion: selectedOccasion,
        selectedImages: selectedImages,
        fineImages: fineImages,
        categoryName: categoryName,
        images: images,
        gender: selectedGender,
      });
    }
  };

  const CircularView = ({coordinates, bg}) => {
    const isNearLeftEdge = coordinates.x <= width / 4;
    const isNearRightEdge = coordinates.x >= (3 * width) / 4;
    const isNearTopEdge = coordinates.y <= height / 4;
    const isNearBottomEdge = coordinates.y >= (3 * height) / 4;

    const adjustedLeft = isNearRightEdge ? coordinates.x - 30 : coordinates.x;
    const adjustedTop = isNearBottomEdge
      ? coordinates.y - 30
      : coordinates.y - 30;
    return (
      <View
        style={[
          styles.dot,
          {
            backgroundColor: bg,
            top: isNearTopEdge ? coordinates.y : adjustedTop,
            left: isNearLeftEdge ? coordinates.x : adjustedLeft,
            // top: coordinates.y,
            // left: coordinates.x,
          },
        ]}
      />
    );
  };
  // const CircularView = ({coordinates, bg}) => {
  //   const isNearLeftEdge = coordinates.x <= width / 4;
  //   const isNearRightEdge = coordinates.x >= (3 * width) / 4;
  //   const isNearTopEdge = coordinates.y <= height / 4;
  //   const isNearBottomEdge = coordinates.y >= (3 * height) / 4;

  //   const adjustedLeft = isNearRightEdge ? coordinates.x : coordinates.x;
  //   const adjustedTop = isNearBottomEdge ? coordinates.y : coordinates.y;
  //   return (
  //     <View style={styles.circularView}>
  //       <View
  //         style={[
  //           styles.dot,
  //           {
  //             backgroundColor: bg,
  //             top: isNearTopEdge ? coordinates.y : adjustedTop,
  //             left: isNearLeftEdge ? coordinates.x : adjustedLeft,
  //           },
  //         ]}
  //       />
  //     </View>
  //   );
  // };

  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{
        backgroundColor: COLORS.white,
      }}>
      <View style={styles.mainView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={pullDownRefresh}
            />
          }>
          <View
            style={{
              alignSelf: 'center',
            }}>
            {clickCoordinates.x > 0 && clickCoordinates.y > 0 && (
              <CircularView bg={bgColor} coordinates={clickCoordinates} />
            )}
            {selectedImages.map((image, index) => (
              <TouchableOpacity onPress={handlePress} activeOpacity={1}>
                <Image
                  key={index}
                  source={{uri: image?.file}}
                  style={{
                    width: image?.width,
                    height: image?.height,
                    resizeMode: 'contain',
                    display: index === currentIndex ? 'flex' : 'none',
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.buttonL} onPress={goToPrevious}>
            <Image source={imagePath.leftArrow} style={styles.arrowstyle} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonR} onPress={goToNext}>
            <Image source={imagePath.rightArrow} style={styles.arrowstyle} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backImg}
            onPress={() => props.navigation.navigate('BottomTabNavigator')}>
            <Image source={imagePath.Back} tintColor={COLORS.white} />
          </TouchableOpacity>

          <Text style={styles.matchinText2}>{i18n.t('category.matching')}</Text>

          <FlatList
            data={colors}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            renderItem={renderColors}
            contentContainerStyle={styles.colorScroll}
          />

          <View style={{paddingHorizontal: 20}}>
            <Text style={styles.matchinText}>
              {i18n.t('category.category')}
            </Text>

            <CategorySelections
              Data={categoryData}
              navigation={navigation}
              onSelectedCategory={handleSelectedCategpry}
            />
            <Text style={styles.matchinText}>{i18n.t('category.gender')}</Text>
            <GenderSelection onSelectedGender={handleSelectedGender} />
            <Text style={styles.matchinText}>{i18n.t('category.age')}</Text>
            <View style={styles.ageView}>
              <Text style={styles.numberText}>{`${sliderValues[0]}`}</Text>
              <Text style={styles.numberText}>{`${sliderValues[1]}`}</Text>
            </View>
            <MultiSlider
              values={sliderValues}
              sliderLength={width * 0.854}
              onValuesChange={handleSliderChangeAge}
              min={0}
              max={100}
              step={1}
              allowOverlap={false}
              trackStyle={{
                backgroundColor: COLORS.lightBorderLine,
                marginLeft: 2,
              }}
              selectedStyle={{backgroundColor: COLORS.black}}
              markerStyle={styles.thumbStyle}
              customMarker={renderThumb}
            />
            <Text style={styles.matchinText1}>{i18n.t('category.style')}</Text>
            <StyleSelections onSelectedStyle={handleSelectedStyle} />
            <Text style={styles.matchinText}>{i18n.t('category.weather')}</Text>
            <WeatherSelections onSelectedWeather={handleSelectedWeather} />
            <Text style={styles.matchinText}>
              {i18n.t('category.occasion')}
            </Text>
            <OccasionSelections onSelectedOccasion={handleSelectedOccasion} />
            <Text style={styles.matchinText}>{i18n.t('category.price')}</Text>
            <View style={styles.ageView}>
              <Text style={styles.numberText}>${`${priceValues[0]}`}</Text>
              <Text style={styles.numberText}>${`${priceValues[1]}`}</Text>
            </View>
            <MultiSlider
              values={priceValues}
              sliderLength={width * 0.854}
              onValuesChange={handleSliderChangePrice}
              min={0}
              max={10000}
              step={50}
              allowOverlap={false}
              trackStyle={{
                backgroundColor: COLORS.lightBorderLine,
                marginLeft: 2,
              }}
              selectedStyle={{backgroundColor: COLORS.black}}
              markerStyle={styles.thumbStyle}
              customMarker={renderThumb1}
            />

            <CustomButton
              title={'Next'}
              imageRight={imagePath.Forward}
              style={{marginTop: 20}}
              // onPress={() =>
              //   props.navigation.navigate('RotationScreen', {
              //     selectedImage: selectedImage,
              //   })
              // }
              onPress={handleNext}
            />
          </View>
        </ScrollView>
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 6,
  },

  colorView: {
    backgroundColor: COLORS.transparent,
    height: 36,

    marginTop: 8,
    flexDirection: 'row',
  },

  colors: {
    height: 36,
    width: width * 0.2,
    marginEnd: 4,
    borderRadius: 6,
    borderWidth: 3,
  },
  colorScroll: {
    paddingStart: 20,
    paddingEnd: 16,
  },
  bigImg: {
    height: 375,
    width: '100%',
    resizeMode: 'cover',
  },
  backImg: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: COLORS.outer,
    height: 34,
    width: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchinText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 20,
    marginTop: 12,
  },
  matchinText2: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 20,
    marginTop: 12,
    paddingHorizontal: 20,
  },
  matchinText1: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 20,
    // marginTop: 8,
  },

  ageView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  numberText: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.regular,
  },
  thumbStyle: {
    backgroundColor: COLORS.black,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginLeft: 16,
  },
  circularRadar: {
    backgroundColor: COLORS.lightBorderLine,
    height: 500,
    // borderBottomColor: 'red',
    // borderBottomWidth: 2,
    borderRadius: 250,
    marginTop: 40,
    width: 500,
    marginLeft: -50,
    borderBottomWidth: 80,
    borderBottomColor: 'green',
  },

  circularView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dot: {
    width: 30,
    height: 30,

    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.white,
    position: 'absolute',
    zIndex: 2,
  },
  arrowstyle: {
    // position: 'absolute',

    height: 34,
    width: 34,
    tintColor: COLORS.white,
  },
  buttonL: {
    position: 'absolute',
    top: (height * 0.4 - 14) / 2,
    backgroundColor: COLORS.outer,
    height: 34,
    width: 30,
    borderRadius: 6,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonR: {
    position: 'absolute',
    top: (height * 0.4 - 14) / 2,
    right: 10,
    backgroundColor: COLORS.outer,
    height: 34,
    width: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
