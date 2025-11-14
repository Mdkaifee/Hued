import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import BaseView from '../../../../BaseView';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
// import CommonHeader from '../../../components/CommonHeader';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
import {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  GOOGLE_API_KEY,
} from '../../../utils/constants';
import ExploreComponent from '../../../components/ExploreComponent';
import FilterModal from '../../../modals/FilterModal';
import {
  addOutfitInCollectionApi,
  exploreApi,
  GetCategoriesApi,
  GetExploreCollectionApi,
  GetRemoveCollectionApi,
  GetWardrobeCollectionApi,
  postCollectionsApi,
  removeOutfitInCollectionApi,
} from '../../../services/AppApi';
import Loader from '../../../components/Loader';
import {ToastMessage} from '../../../components/ToastMessage';
import AddNew from '../../../modals/AddNew';
import axios from 'axios';
import {VARIABLES} from '../../../utils/globalVariables';
// import {isNull} from 'lodash';

const {height, width} = Dimensions.get('window');
export default function Explore(props) {
  const [selectedCategories, setSelectedCategories] = useState('1');
  const [categories, setCategories] = useState([]);
  const [searchToggle, setSearchToggle] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [season, setSeason] = useState([]);
  const [ageStart, setAgeStart] = useState('');
  const [occasion, setOccasion] = useState([]);
  const [style, setStyle] = useState([]);
  const [search, setSearch] = useState('');
  const [priceStart, setPriceStart] = useState('');
  const [ageEnd, setAgeEnd] = useState('');
  const [isRefreshing, setisRefreshing] = useState(false);
  const [priceEnd, setPriceEnd] = useState('');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [limit, setLimit] = useState(10);
  const [endLimit, setEndLimit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const [idOpened, setIdOpened] = useState('');
  const [collectionData, setCollectionData] = useState([]);
  const [isSelected, setIsSelected] = useState();
  const [realAddress, setRealAddress] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');

  const lat = VARIABLES?.lat;
  const long = VARIABLES?.long;
  console.log('lat', lat, 'long', long);
  const getAddressFromCoordinates = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            latlng: `${lat},${long}`,
            key: GOOGLE_API_KEY,
          },
        },
      );
      console.log('response from location', JSON.stringify(response.data));
      if (currentLocation === '') {
        setCurrentLocation(response.data.results[7]?.formatted_address);
      }
      console.log(response.data.results[7]?.formatted_address);
    } catch (error) {
      console.error(error);
    }
  };
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const openAddModal = () => {
    setModalAddVisible(true);
  };
  const closeAddModal = () => {
    setModalAddVisible(false);
  };
  const handleSearchToggle = () => {
    setSearchToggle(!searchToggle);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const LoadMoreData = () => {
    if (!endLimit && !footerLoader) {
      setFooterLoader(true);
      handleExplore(page);
    } else {
      console.log('no more loads');
    }
  };

  function _renderFooter() {
    if (footerLoader) {
      return (
        <View style={{height: 20, marginVertical: 20}}>
          <ActivityIndicator size={30} color={COLORS.black} />
        </View>
      );
    }
  }

  useEffect(() => {
    if (search.length > 0) {
      handleGetCategories();
      handleExplore(0);
      setEndLimit(false);
    } else if (search.length === 0) {
      handleGetCategories();
      handleExplore(0);
      setEndLimit(false);
    }
  }, [search]);

  const handleGetCategories = async () => {
    const response = await GetCategoriesApi();
    setCategories(response?.result);
  };

  useEffect(() => {
    handleGetCategories();
    handleCollectionList();
    getAddressFromCoordinates();
    handleExplore(0);
    setEndLimit(false);
  }, []);

  const toggleCategory = async category => {
    setSelectedCategories(category);

    setPage(0);
    setEndLimit(false);
    // setRefreshing(true);
    setLoading(true);
    let page = 0;
    const data = {
      page: page,
      limit: limit,
      category: category,
      search: search,
      gender: gender,
      style: style,
      weather: season,
      occasion: occasion,
      priceStart: priceStart,
      priceEnd: priceEnd,
      ageStart: ageStart,
      ageEnd: ageEnd,
      lat: latitude,
      long: longitude,
    };
    console.log('dataaafor explore after categoryyy', data);

    const response = await exploreApi(data);

    if (response?.responseCode === 200) {
      setLoading(false);
      if (response?.result?.docs?.length < limit) {
        setEndLimit(true);
      }
      console.log('pagecategory', page);
      if (page !== 0) {
        setData(prev => [...prev, ...response?.result?.docs]);
      } else {
        setData(response?.result?.docs);
      }
      console.log('endlimit', endLimit);

      setPage(page + 1);
      setFooterLoader(false);
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  };
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['1%', '25%', '50%', '80%'], []);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleApply = async (
    gender,
    season,
    occasion,
    style,
    ageStart,
    ageEnd,
    priceStart,
    priceEnd,
    page,
    latitude,
    longitude,
    address,
  ) => {
    setGender(gender),
      setSeason(season),
      setOccasion(occasion),
      setStyle(style),
      setAgeStart(ageStart),
      setAgeEnd(ageEnd),
      setEndLimit(false);
    setPriceStart(priceStart);
    setPriceEnd(priceEnd);
    setLatitude(latitude), setLongitude(longitude);
    setRealAddress(address);
    setLoading(true);
    const data = {
      page: page,
      limit: limit,
      category: selectedCategories,
      search: search,
      gender: gender,
      style: style,
      weather: season,
      occasion: occasion,
      priceStart: priceStart,
      priceEnd: priceEnd,
      ageStart: ageStart,
      ageEnd: ageEnd,
      lat: latitude,
      long: longitude,
    };
    console.log('dataaafor explore after apply', data);

    const response = await exploreApi(data);

    if (response?.responseCode === 200) {
      setLoading(false);
      if (response?.result?.docs?.length < limit) {
        setEndLimit(true);
      }

      if (page !== 0) {
        setData(prev => [...prev, ...response?.result?.docs]);
      } else {
        setData(response?.result?.docs);
      }

      setPage(page + 1);
      setFooterLoader(false);
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  };

  const handleAddCollection = async collectionName => {
    const data = {
      name: collectionName.trim(),
    };
    const response = await postCollectionsApi(data);
    console.log('responsefromaddcollection', response);
    closeAddModal();
    handleCollectionList(idOpened);
  };
  console.log('genderrr', gender);
  console.log('seasonnnnnn', season);
  console.log('occasionnnnnn', occasion);
  console.log('styleeee', style);
  console.log('ageStart', ageStart);
  console.log('ageEnd', ageEnd);
  console.log('priceStart', priceStart);
  console.log('priceEnd', priceEnd);
  console.log('locationn', latitude, longitude);
  const handleCollectionList = async id => {
    const response = await GetExploreCollectionApi(id);
    console.log('responsefromcollectionListexplore', response);
    setCollectionData(response?.result);
  };

  const handleExplore = async page => {
    const data = {
      page: page,
      limit: limit,
      category: selectedCategories,
      search: search,
      gender: gender,
      style: style,
      weather: season,
      occasion: occasion,
      priceStart: priceStart,
      priceEnd: priceEnd,
      ageStart: ageStart,
      ageEnd: ageEnd,
      long: longitude,
      lat: latitude,
    };
    console.log('dataaafor explore ', data);

    const response = await exploreApi(data);

    if (response?.responseCode === 200) {
      if (response?.result?.docs?.length < limit) {
        setEndLimit(true);
      }

      if (page !== 0) {
        setData(prev => [...prev, ...response?.result?.docs]);
      } else {
        setData(response?.result?.docs);
      }

      setPage(page + 1);
      setFooterLoader(false);
      setRefreshing(false);
    }
  };

  const openBottomSheet = id => {
    setIdOpened(id);
    handleCollectionList(id); // jis explore ki outfit se open hu hai bottom sheet vo id sending
    console.log('idfromitem', id);
    bottomSheetRef.current?.snapToIndex(2);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close(); // Close the bottom sheet
  };
  const renderItem = ({item}) => (
    <View>
      <ExploreComponent data={item} openSheet={openBottomSheet} />
    </View>
  );
  const toggleSelection = async item => {
    const id = item?._id;

    const isSaved = item?.isSaved || false;
    console.log('isSavedd', isSaved);

    const data = {
      _id: idOpened,
      collections: [id],
    };
    console.log('datafromsaveoutfit', data);
    const response = await addOutfitInCollectionApi(data);
    console.log('responseaddoutfittocollection', response);
    {
      if (response?.responseCode === 200) {
        ToastMessage(response?.responseMessage);
      }
    }

    if (selectedCollection.includes(id)) {
      setSelectedCollection(prevSelected =>
        prevSelected.filter(collectionId => collectionId !== id),
      );
    } else {
      setSelectedCollection(prevSelected => [...prevSelected, id]);
    }

    closeBottomSheet();

    handleExplore(0);
    setEndLimit(false);
  };

  console.log('selectedcollectioni', selectedCollection);
  const renderItemBottomSheet = ({item}) => (
    <TouchableOpacity
      style={styles.mainSaveView}
      activeOpacity={1}
      onPress={() => toggleSelection(item)}>
      <View style={styles.imageTextView}>
        <View style={styles.imgg}>
          <Image style={styles.saveImg} source={imagePath.shirt2} />
        </View>
        <Text style={styles.saveNameText}>{item.name}</Text>
      </View>
      <Image
        style={styles.add}
        source={
          // selectedCollection.includes(item._id)
          item?.isSaved || selectedCategories.includes(item._id)
            ? imagePath.checked
            : imagePath.add
        }
      />
    </TouchableOpacity>
  );
  console.log('agestart', ageStart);
  const ageStarts = ageStart === '' ? 0 : ageStart;
  const ageEnds = ageEnd === '' ? 100 : ageEnd;
  const priceStarts = priceStart === '' ? 0 : priceStart;
  const priceEnds = priceEnd === '' ? 10000 : priceEnd;
  console.log('agestarts', ageStarts);

  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{
        backgroundColor: COLORS.white,
      }}>
      <View
        style={
          Platform.OS === 'android' ? styles.androidHeader : styles.iosHeader
        }>
        {searchToggle ? (
          <>
            <TextInput
              style={styles.searchStyle}
              placeholder="Search"
              placeholderTextColor={COLORS.lightText}
              value={search}
              onChangeText={text => setSearch(text)}
            />
            {search !== '' && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Image style={styles.searchIcon} source={imagePath.remove} />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <View style={styles.blankView}></View>
            <Text style={styles.headerText}>{i18n.t('explore.explore')}</Text>
          </>
        )}
        <TouchableOpacity onPress={handleSearchToggle}>
          <Image source={imagePath.searchEx} />
        </TouchableOpacity>
      </View>
      <View style={styles.mainView}>
        <View style={styles.selectfilterView}>
          <Text style={styles.selectText}>{i18n.t('explore.select')}</Text>
          <TouchableOpacity onPress={openModal}>
            <Image source={imagePath.filter} />
          </TouchableOpacity>
        </View>
        <View style={styles.allCategories}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollStyle}>
            <TouchableOpacity
              style={[
                styles.categories,
                selectedCategories === '1' && {
                  backgroundColor: COLORS.black,
                },
              ]}
              onPress={() => toggleCategory('1')}>
              <Text
                style={[
                  styles.nameText,
                  selectedCategories === '1' && {
                    color: COLORS.white,
                  },
                ]}>
                All
              </Text>
            </TouchableOpacity>

            {categories?.map(item => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.categories,
                  selectedCategories === item._id && {
                    backgroundColor: COLORS.black,
                  },
                ]}
                onPress={() => toggleCategory(item._id)}>
                <Text
                  style={[
                    styles.nameText,
                    selectedCategories === item._id && {
                      color: COLORS.white,
                    },
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{marginTop: 20, paddingHorizontal: 20, flex: 1}}>
          <FlatList
            data={data}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={renderItem}
            ListEmptyComponent={
              <>
                <View style={styles.noDataContainer}>
                  <Image
                    style={{height: 24, width: 24}}
                    source={imagePath.connection}
                  />
                  <Text style={styles.noDataText}>No Data Available</Text>
                </View>
              </>
            }
            onEndReached={LoadMoreData}
            onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  handleExplore(0);
                  setEndLimit(false);
                }}
                tintColor={COLORS.black}
              />
            }
            ListFooterComponent={_renderFooter}
            contentContainerStyle={styles.flatlistStyle}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      {modalVisible && (
        <FilterModal
          closeModal={closeModal}
          visible={modalVisible}
          handleApplySelections={handleApply}
          handleExploreApi={handleExplore}
          location={realAddress}
          currentLocation={currentLocation}
          genders={gender}
          seasons={season}
          ageStarts={Number(ageStarts)}
          ageEnds={Number(ageEnds)}
          priceStarts={Number(priceStarts)}
          priceEnds={Number(priceEnds)}
          occasions={occasion}
          stylee={style}
        />
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={BottomSheetBackdrop}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          <View style={styles.collectionView}>
            <Text style={styles.collectionText}>
              {i18n.t('collection.colle')}
            </Text>
            <TouchableOpacity onPress={openAddModal}>
              <Text style={styles.addText}>{i18n.t('collection.add')}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={collectionData}
            keyExtractor={i => i._id}
            renderItem={renderItemBottomSheet}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bottomsheetflatlist}
          />
        </View>
      </BottomSheet>
      <AddNew
        closeModal={closeAddModal}
        visible={modalAddVisible}
        handleAddNewCategory={handleAddCollection}
      />
      {loading && <Loader />}
    </BaseView>
  );
}

const styles = StyleSheet.create({
  iosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: COLORS.white,
    shadowColor: '#0000000A',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.7,
    shadowRadius: 5,
    paddingHorizontal: 20,
  },
  androidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.textBlack,
    elevation: 14,
    shadowOpacity: 0.5,
    paddingHorizontal: 20,
  },
  mainView: {
    flex: 1,
    // backgroundColor: 'green',
    marginTop: 20,
  },
  selectfilterView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  selectText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 22,
  },
  categories: {
    borderWidth: 1,
    borderColor: COLORS.black,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginEnd: 8,
    borderRadius: 7,
    marginTop: 14,
    // marginBottom: 20,
  },
  nameText: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 18,
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'center',
    marginTop: height * 0.29,
  },
  noDataText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 22,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  flatlistView: {
    // flex: 1,
    // paddingHorizontal: 20,
  },
  scrollStyle: {
    paddingStart: 20,
    paddingEnd: 12,
  },
  flatlistStyle: {
    paddingBottom: 80,
  },
  allCategories: {
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.white,
  },
  headerText: {
    fontSize: FONT_SIZES.twenty,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 27,
  },

  blankView: {
    width: 24,
    height: 24,
  },
  searchStyle: {
    color: COLORS.black,
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    height: 16,
    width: 16,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  collectionView: {
    // marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    shadowColor: '#0000000A',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 2,
    shadowRadius: 5,
    borderBottomWidth: 1,
    paddingVertical: 6,
    elevation: 7,
    borderBlockColor: COLORS.bgColor,
    paddingBottom: 10,
  },

  collectionText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.semiBold,
    // marginBottom: 14,
    paddingLeft: 14,
    // lineHeight: 24,
  },
  addText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.medium,
    // marginBottom: 14,
    paddingRight: 14,
    // lineHeight: 24,
  },
  mainSaveView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  imageTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  add: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  saveImg: {
    height: 30,
    width: 30,
    borderRadius: 10,
    alignSelf: 'center',
  },
  bottomsheetflatlist: {
    paddingTop: 20,
    padding: 14,
  },
  saveNameText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.fourteen,
    fontFamily: FONT_FAMILIES.medium,
  },
  imgg: {
    height: 58,
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgColor,
    borderRadius: 8,
  },
});
