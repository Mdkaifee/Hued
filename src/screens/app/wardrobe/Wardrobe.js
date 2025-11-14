import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseView from '../../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
// import CommonHeader from '../../../components/CommonHeader';
import imagePath from '../../../utils/imagePath';
import i18n from '../../../translation/i18n';
// import WardrobeComponent from '../../../components/WardrobeComponent';
import {
  GetWardrobeApi,
  GetWardrobeCollectionApi,
  WardrobeApi,
  postCollectionsApi,
} from '../../../services/AppApi';
import Loader from '../../../components/Loader';
import {SafeAreaView} from 'react-native-safe-area-context';
import AddInWardrobe from '../../../modals/AddinWardrobe';
// import WardrobeCollectionComponent from '../../../../components/WardrobeCollectionComponent';
import WardrobeCollectionComponent from '../../../components/WardrobeCollectionComponent';
import {EventRegister} from 'react-native-event-listeners';
import {registeredEvents} from '../../../utils/UserPrefs';
const {height, width} = Dimensions.get('window');
export default function Wardrobe(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchToggle, setSearchToggle] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [endLimit, setEndLimit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const data1 = [{}, {}, {}, {}, {}, {}, {}, {}];

  const handleClearSearch = () => {
    setSearch('');
    // setSearchToggle(!searchToggle);
  };
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (search.length > 0) {
      handleWardrobe(0);
      setEndLimit(false);
    } else if (search.length === 0) {
      handleWardrobe(0);
      setEndLimit(false);
    }
  }, [search]);





  useEffect(() => {
    EventRegister.addEventListener(registeredEvents.COLLECTION, () => {
      handleWardrobe(0);
      setEndLimit(false);
    });
    return () => {
      EventRegister.removeEventListener(registeredEvents.COLLECTION);
    };
  }, []);

  useEffect(() => {
    EventRegister.addEventListener(registeredEvents.OUTFIT_REMOVE, () => {
      handleWardrobe(0);
      setEndLimit(false);
    });
    return () => {
      EventRegister.removeEventListener(registeredEvents.OUTFIT_REMOVE);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      console.log('screenfoussedWARDROBE');
    handleWardrobe(0);
    setEndLimit(false)
    });
    return unsubscribe;
  }, [search]);

  const LoadMoreData = () => {
    if (!endLimit && !footerLoader) {
      setFooterLoader(true);
      handleWardrobe(page);
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
  const handleSearchToggle = () => {
    setSearchToggle(!searchToggle);
  };

  useEffect(() => {
    handleWardrobe(0);
    setEndLimit(false);
  }, []);

  const handleWardrobe = async page => {
    console.log({page, limit, search});
    const response = await GetWardrobeCollectionApi(page, limit, search);
    console.log('responsefromgetcollections', response);

    if (response?.responseCode === 200) {
      // setLoading(false);
      if (response?.result?.docs?.length < limit) {
        setEndLimit(true);
      }
      console.log('page', page);
      if (page !== 0) {
        setData(prev => [...prev, ...response?.result?.docs]);
      } else {
        setData(response?.result?.docs);
      }
      console.log('endlimit', endLimit);

      setPage(page + 1);
      setFooterLoader(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({item}) => (
    <View>
      <WardrobeCollectionComponent data={item} />
    </View>
  );
  const handleAddCollection = async collectionName => {
    const data = {
      name: collectionName,
    };
    const response = await postCollectionsApi(data);
    console.log('responsefromaddcollection', response);
    closeModal();
    handleWardrobe(0);
    setEndLimit(false);
  };
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{
        backgroundColor: COLORS.white,
      }}>
      <SafeAreaView edges={['top']} style={{backgroundColor: COLORS.white}}>
        <View
          style={
            Platform.OS === 'android' ? styles.androidHeader : styles.iosHeader
          }>
          {searchToggle ? (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
              <TouchableOpacity activeOpacity={1} onPress={handleSearchToggle}>
                <Image source={imagePath.searchEx} />
              </TouchableOpacity>
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
            </View>
          ) : (
            <>
              <View style={styles.blankView}>
                <TouchableOpacity>
                  <Image
                    style={{tintColor: COLORS.white}}
                    source={imagePath.searchEx}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    style={{tintColor: COLORS.white, height: 30, width: 30}}
                    source={imagePath.plus1}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.headerText}>
                {i18n.t('explore.wardrobe')}
              </Text>
              <View style={styles.blankView}>
                <TouchableOpacity onPress={handleSearchToggle}>
                  <Image source={imagePath.searchEx} />
                </TouchableOpacity>
                <TouchableOpacity onPress={openModal}>
                  <Image
                    style={{tintColor: COLORS.black, height: 30, width: 30}}
                    source={imagePath.plus1}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
      <View style={styles.mainView}>
        <FlatList
          data={data}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatlistStyle}
          showsVerticalScrollIndicator={false}
          onEndReached={LoadMoreData}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                handleWardrobe(0);
                setEndLimit(false);
              }}
              tintColor={COLORS.black}
            />
          }
          ListFooterComponent={_renderFooter}
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
        />
      </View>
      <AddInWardrobe
        closeModal={closeModal}
        visible={modalVisible}
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
  },
  mainView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
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
    paddingTop: 33,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
});
