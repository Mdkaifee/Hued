import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
import {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  GOOGLE_API_KEY,
  SCREEN_HEIGHT,
} from '../utils/constants';
import OptionComponent from '../components/OptionComponent';
import CustomButton from '../components/CustomButtton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {VARIABLES} from '../utils/globalVariables';
import axios from 'axios';

const {height, width} = Dimensions.get('window');
export default function FilterModal({
  closeModal,
  visible,
  navigation,
  handleApplySelections,
  handleExploreApi,
  location,
  currentLocation,
  genders,
  seasons,
  ageStarts,
  ageEnds,
  priceStarts,
  priceEnds,
  occasions,
  stylee,
}) {
  const data = [{}, {}, {}];

  const [gender, setGender] = useState(false);
  const [season, setSeason] = useState(false);
  const [age, setAge] = useState(false);
  const [occasion, setOccasion] = useState(false);
  const [style, setStyle] = useState(false);
  const [price, setPrice] = useState(false);
  const [latitude, setLatitude] = useState(VARIABLES?.lat);
  const [longitude, setLongitude] = useState(VARIABLES?.long);

  const [searchResults, setSearchResults] = useState([]);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [page, setPage] = useState(0);
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const [priceValues, setPriceValues] = useState([0, 10000]);
  const [genderSelected, setGenderSelected] = useState('');
  const [seasonSelected, setSeasonSelected] = useState([]);
  const [occasionSelected, setOccasionSelected] = useState([]);
  const [styleSelected, setStyleSelected] = useState([]);
  const [address, setAddress] = useState('');
  console.log('updatingLocation', location);
  console.log('currentLocation', currentLocation);

  const [searchValue, setSearchValue] = useState(location);

  useEffect(() => {
    if (location !== '') {
      setSearchValue(location);
    } else {
      setSearchValue(currentLocation);
    }
    setGenderSelected(genders);
    setSeasonSelected(seasons);
    setOccasionSelected(occasions);
    setStyleSelected(stylee);
    setAddress(location);
    setSliderValues([ageStarts, ageEnds]);
    setPriceValues([priceStarts, priceEnds]);
  }, [visible]);

  console.log('searchhValue', searchValue);
  //to fetch current location
  // let address;
  // const getAddressFromCoordinates = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://maps.googleapis.com/maps/api/geocode/json`,
  //       {
  //         params: {
  //           latlng: `${lat},${long}`,
  //           key: GOOGLE_API_KEY,
  //         },
  //       },
  //     );
  //     console.log('response from location', JSON.stringify(response.data));

  //     setSearchValue(response.data.results[7]?.formatted_address);
  //     console.log(response.data.results[7]?.formatted_address);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   getAddressFromCoordinates();
  // }, []);
  // console.log('realadress', realAddress);
  // to handle slider
  const handleSliderChangeAge = values => {
    setSliderValues(values);
  };
  const handleSliderChangePrice = values => {
    setPriceValues(values);
  };
  const renderThumb = () => <View style={styles.thumbStyle} />;
  const renderThumb1 = () => <View style={styles.thumbStyle} />;

  const styleArray = [
    {
      id: 1,
      name: i18n.t('category.sports'),
    },
    {
      id: 2,
      name: i18n.t('category.casual'),
    },
    {
      id: 3,
      name: i18n.t('category.gothic'),
    },
    {
      id: 4,
      name: i18n.t('category.vintage'),
    },
    {
      id: 5,
      name: i18n.t('category.boho'),
    },
  ];

  const occasionArray = [
    {
      id: 1,
      name: i18n.t('category.party'),
    },
    {
      id: 2,
      name: i18n.t('category.ethnic'),
    },
    {
      id: 3,
      name: i18n.t('category.night'),
    },
    {
      id: 4,
      name: i18n.t('category.lounge'),
    },
  ];

  const seasonArray = [
    {
      id: 1,
      name: i18n.t('category.spring'),
    },
    {
      id: 2,
      name: i18n.t('category.autum'),
    },
    {
      id: 3,
      name: i18n.t('category.summer'),
    },
    {
      id: 4,
      name: i18n.t('category.winter'),
    },
    {
      id: 5,
      name: i18n.t('category.vintage'),
    },
  ];
  const genderArray = [
    {
      id: 1,
      name: i18n.t('gender.male'),
    },
    {
      id: 2,
      name: i18n.t('gender.female'),
    },
    {
      id: 3,
      name: i18n.t('gender.non'),
    },
  ];
  const toggleGender = () => {
    setGender(!gender);
  };

  const toggleSeason = () => {
    setSeason(!season);
  };

  const toggleAge = () => {
    setAge(!age);
  };
  const toggleOccasion = () => {
    setOccasion(!occasion);
  };
  const toggleStyle = () => {
    setStyle(!style);
  };
  const togglePrice = () => {
    setPrice(!price);
  };

  const selectionGender = gender => {
    if (genderSelected === gender) {
      setGenderSelected('');
    } else {
      setGenderSelected(gender);
    }
  };
  const handleClearSearch = () => {
    setSearchValue('');
    setLatitude(null);
    setLongitude(null);
    setAddress(currentLocation);
  };
  // const selectionSeason = season => {
  //   setSeasonSelected(season);
  // };
  const selectionSeason = season => {
    if (seasonSelected.includes(season)) {
      setSeasonSelected(seasonSelected.filter(item => item !== season));
    } else {
      setSeasonSelected([...seasonSelected, season]);
    }
  };
  const selectionOccasion = occasion => {
    if (occasionSelected.includes(occasion)) {
      setOccasionSelected(occasionSelected.filter(item => item !== occasion));
    } else {
      setOccasionSelected([...occasionSelected, occasion]);
    }
  };
  const selectionStyle = style => {
    if (styleSelected.includes(style)) {
      setStyleSelected(styleSelected.filter(item => item !== style));
    } else {
      setStyleSelected([...styleSelected, style]);
    }
  };

  const handleReset = () => {
    closeModal();
    setGender(false);
    setSeason(false);
    setAge(false);
    setOccasion(false);
    setStyle(false);
    setPrice(false);
    setSliderValues([0, 100]);
    setPriceValues([0, 10000]);
    setGenderSelected('');
    setSeasonSelected([]);
    setOccasionSelected([]);

    setStyleSelected([]);
    setLongitude(VARIABLES.long);
    setLatitude(VARIABLES.lat);

    setSearchValue(currentLocation);
    handleApplySelections(
      '',
      [],
      [],
      [],
      '',
      '',
      '',
      '',
      0,
      null,
      null,
      currentLocation,
    );
  };
  console.log('hghghg', priceValues);
  const handleCross = () => {
    closeModal();
    setIsShowingResults(false);
  };
  const handleApply = () => {
    closeModal();
    const ageStart =
      sliderValues[0] === 0 && sliderValues[1] === 100
        ? ''
        : `${sliderValues[0]}`;

    const ageEnd =
      sliderValues[0] === 0 && sliderValues[1] === 100
        ? ''
        : `${sliderValues[1]}`;

    const priceStart =
      priceValues[0] === 0 && priceValues[1] === 10000
        ? ''
        : `${priceValues[0]}`;

    const priceEnd =
      priceValues[0] === 0 && priceValues[1] === 10000
        ? ''
        : `${priceValues[1]}`;

    const isItCurrent = searchValue === currentLocation ? true : false;
    handleApplySelections(
      genderSelected,
      seasonSelected,
      occasionSelected,
      styleSelected,
      ageStart,
      ageEnd,
      priceStart,
      priceEnd,
      page,
      isItCurrent ? null : latitude,
      isItCurrent ? null : longitude,
      address,
    );
  };

  console.log('genderselected ', genderSelected);
  console.log('seasonSelected ', seasonSelected);
  console.log('styleSelected ', styleSelected);
  console.log('occasionSelected ', occasionSelected);
  console.log('ageRange ', sliderValues);
  console.log('priceRange ', priceValues);

  // location
  const searchLocation = async text => {
    try {
      setSearchValue(text);
      const response = await axios.post(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_API_KEY}&input=${encodeURIComponent(
          text,
        )}`,
      );
      setSearchResults(response.data.predictions);
      setIsShowingResults(true);
      console.log('search locatttt', response);
    } catch (error) {
      console.log('error location', error.response);
    }
  };
  const _onAddressPress = item => {
    console.log('item ticked ', item);
    _onAddressAutoComplete(item);
    setSearchValue(item.description);
    setSelectedAddress(item.description);
    setIsShowingResults(false);
  };

  const _onAddressAutoComplete = data => {
    const place_id = data.place_id;
    if (place_id.length != null) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,geometry/location&key=${GOOGLE_API_KEY}`,
        )
        .then(response => {
          console.log('responseEEEEEEEEEE', response);
          if (response.data.result != '') {
            // const {latitude, longitude} = {
            //   latitude: response?.data?.result?.geometry?.location?.lat,
            //   longitude: response?.data?.result?.geometry?.location?.lng,
            // };
            setLatitude(response?.data?.result?.geometry?.location?.lat);
            setLongitude(response?.data?.result?.geometry?.location?.lng);
            setAddress(response?.data?.result?.name);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  console.log('lat', latitude);
  console.log('long', longitude);

  const renderPlacesResults = item => {
    console.log('item', item);
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => {
          _onAddressPress(item);

          Keyboard.dismiss();
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.black,
              }}>
              {item.structured_formatting.main_text}
            </Text>
            <Text
              style={{
                fontSize: 12,
                marginTop: 2,
                color: COLORS.black,
              }}>
              {item.description}
            </Text>
            <View style={styles.line} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Modal
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      onBackdropPress={handleCross}
      backdropOpacity={0.5}
      statusBarTranslucent={true}
      isVisible={visible}
      style={{margin: 0}}
      transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.filtertextView}>
            <Text style={styles.filterText}>Filters</Text>
            <TouchableOpacity onPress={handleCross}>
              <Image source={imagePath.cancel} />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 22}}>
            {/* <View style={styles.locationView}>
              <Text style={styles.locationText}>{realAddress}</Text>
            </View> */}
            <View
              style={[
                Platform.OS === 'ios'
                  ? styles.locationView
                  : styles.androidlocationView,
              ]}>
              <TextInput
                style={styles.locationText}
                value={searchValue}
                placeholder={i18n.t('menu.loc')}
                // placeholder={realAddress}
                onChangeText={text => searchLocation(text)}
              />
              {searchValue !== '' && (
                <TouchableOpacity
                  style={{
                    width: 15,
                    height: 15,
                    backgroundColor: COLORS.lightBorderLine,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                  }}
                  onPress={handleClearSearch}>
                  <Image
                    style={{width: 10, height: 10}}
                    source={imagePath.cross}
                  />
                </TouchableOpacity>
              )}
            </View>

            {isShowingResults && searchValue !== '' && (
              <View
                style={{
                  marginTop: 14,
                  borderWidth: 1,
                  borderColor: '#adadad40',
                  borderRadius: 6,
                  marginBottom: 8,
                  // position: 'absolute',
                  // bottom: 0,
                  // top: SCREEN_HEIGHT * 0.388,
                  // left: 0,
                  // right: 0,
                  overflow: 'hidden',
                  zIndex: 10000,
                  backgroundColor: COLORS.white,
                  maxHeight: SCREEN_HEIGHT * 0.35,
                }}>
                <ScrollView contentContainerStyle={{paddingBottom: 30}}>
                  {searchResults.map((item, index) =>
                    renderPlacesResults(item, index),
                  )}
                </ScrollView>
              </View>
            )}
            <OptionComponent
              title={i18n.t('filters.gender')}
              onPress={toggleGender}
              image={gender ? imagePath.dropUp : imagePath.dropDownn}
            />
            {gender &&
              genderArray.map(item => (
                <TouchableOpacity
                  style={styles.textTickView}
                  activeOpacity={0.9}
                  onPress={() => selectionGender(item.name)}>
                  <Text
                    style={
                      genderSelected === item.name
                        ? styles.optionText1
                        : styles.optionText
                    }>
                    {item.name}
                  </Text>
                  <Image
                    style={styles.tickImage}
                    source={
                      genderSelected === item.name
                        ? imagePath.ticko
                        : imagePath.untick
                    }
                  />
                </TouchableOpacity>
              ))}
            <View style={styles.line} />

            <OptionComponent
              title={i18n.t('filters.season')}
              onPress={toggleSeason}
              image={season ? imagePath.dropUp : imagePath.dropDownn}
            />
            {season &&
              seasonArray.map(item => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  style={styles.textTickView}
                  onPress={() => selectionSeason(item.name)}>
                  <Text
                    style={
                      seasonSelected.includes(item.name)
                        ? styles.optionText1
                        : styles.optionText
                    }>
                    {item.name}
                  </Text>
                  <Image
                    style={styles.tickImage}
                    source={
                      seasonSelected.includes(item.name)
                        ? imagePath.ticko
                        : imagePath.untick
                    }
                  />
                </TouchableOpacity>
              ))}
            <View style={styles.line} />
            <OptionComponent
              title={i18n.t('filters.age')}
              onPress={toggleAge}
              image={age ? imagePath.dropUp : imagePath.dropDownn}
            />
            {/* {age &&
              data.map(item => (
                <View style={styles.textTickView}>
                  <Text style={styles.optionText}>15-20 yrs</Text>
                  <TouchableOpacity>
                    <Image source={imagePath.untick} />
                  </TouchableOpacity>
                </View>
              ))} */}
            {age && (
              <>
                <View style={styles.ageView}>
                  <Text style={styles.numberText}>{`${sliderValues[0]}`}</Text>
                  <Text style={styles.numberText}>{`${sliderValues[1]}`}</Text>
                </View>
                <MultiSlider
                  values={sliderValues}
                  sliderLength={width * 0.844}
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

             
              </>
            )}
            <View style={styles.line} />
            <OptionComponent
              title={i18n.t('filters.occasion')}
              onPress={toggleOccasion}
              image={occasion ? imagePath.dropUp : imagePath.dropDownn}
            />
            {occasion &&
              occasionArray.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.textTickView}
                  activeOpacity={0.9}
                  onPress={() => selectionOccasion(item.name)}>
                  <Text
                    style={
                      occasionSelected.includes(item.name)
                        ? styles.optionText1
                        : styles.optionText
                    }>
                    {item.name}
                  </Text>
                  <Image
                    style={styles.tickImage}
                    source={
                      occasionSelected.includes(item.name)
                        ? imagePath.ticko
                        : imagePath.untick
                    }
                  />
                </TouchableOpacity>
              ))}
            <View style={styles.line} />
            <OptionComponent
              title={i18n.t('filters.style')}
              onPress={toggleStyle}
              image={style ? imagePath.dropUp : imagePath.dropDownn}
            />
            {style &&
              styleArray.map(item => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  style={styles.textTickView}
                  onPress={() => selectionStyle(item.name)}>
                  <Text
                    style={
                      styleSelected.includes(item.name)
                        ? styles.optionText1
                        : styles.optionText
                    }>
                    {item.name}
                  </Text>
                  <Image
                    style={styles.tickImage}
                    source={
                      styleSelected.includes(item.name)
                        ? imagePath.ticko
                        : imagePath.untick
                    }
                  />
                </TouchableOpacity>
              ))}
            <View style={styles.line} />
            <OptionComponent
              title={i18n.t('filters.price')}
              onPress={togglePrice}
              image={price ? imagePath.dropUp : imagePath.dropDownn}
            />
            {/* {price &&
              data.map(item => (
                <View style={styles.textTickView}>
                  <Text style={styles.optionText}>$100-$200</Text>
                  <TouchableOpacity>
                    <Image source={imagePath.untick} />
                  </TouchableOpacity>
                </View>
              ))} */}
            {price && (
              <>
                <View style={styles.ageView}>
                  <Text style={styles.numberText}>${`${priceValues[0]}`}</Text>
                  <Text style={styles.numberText}>${`${priceValues[1]}`}</Text>
                </View>
                <MultiSlider
                  values={priceValues}
                  sliderLength={width * 0.844}
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

            
                
              </>
            )}
            <View style={styles.line} />
            <View style={styles.button}>
              <CustomButton
                title={'Reset'}
                style={styles.buttonStyle1}
                textStyle={{color: COLORS.black}}
                onPress={handleReset}
              />
              <CustomButton
                title={'Apply'}
                onPress={handleApply}
                style={styles.buttonStyle2}
                textStyle={{fontFamily: FONT_FAMILIES.bold}}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalView: {
    backgroundColor: COLORS.white,
    // height: 672,
    height: height * 0.793,

    width: '100%',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  filtertextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterText: {
    fontSize: FONT_SIZES.twenty,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    marginBottom: 4,
  },
  locationView: {
    borderWidth: 1,
    borderColor: '#00000033',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 7,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  androidlocationView: {
    borderWidth: 1,
    borderColor: '#00000033',
    // paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 7,
    marginTop: 14,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    flex: 1,
  },
  textTickView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  optionText: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.black,

    fontFamily: FONT_FAMILIES.regular,
  },
  line: {
    borderTopWidth: 0.8,
    borderTopColor: '#00000033',
  },
  button: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 18,
    gap: 12,
  },
  buttonStyle1: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: COLORS.transparent,
  },
  buttonStyle2: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
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
    backgroundColor: 'red',
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
  numberText: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.regular,
  },
  ageView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText1: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.black,

    fontFamily: FONT_FAMILIES.medium,
  },
  tickImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  resultItem: {
    marginHorizontal: 10,
    borderRadius: 10,

    overflow: 'hidden',
  },
});
