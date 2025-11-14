import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import BaseView from '../../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
import HomeHeader from '../../../components/HomeHeader';
import HomeFlatlist from '../../../components/HomeFlatlist';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  GetExploreCollectionApi,
  GetHomeApi,
  addOutfitInCollectionApi,
  postCollectionsApi,
  updateTokenApi,
} from '../../../services/AppApi';
import {getFcmToken} from '../../../utils/notificationServices';
const {heigth, width} = Dimensions.get('window');
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import AddNew from '../../../modals/AddNew';
import {ToastMessage} from '../../../components/ToastMessage';

export default function Home(props) {
  const [data, setData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState('1');
  const [dataIsThere, setDataIsThere] = useState([]);
  const [isRefreshing, setisRefreshing] = useState(false);
  const [collectionData, setCollectionData] = useState([]);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [idOpened, setIdOpened] = useState('');
  const [selectedCollection, setSelectedCollection] = useState([]);

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['1%', '25%', '50%', '80%'], []);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);
  const openAddModal = () => {
    setModalAddVisible(true);
  };
  const closeAddModal = () => {
    setModalAddVisible(false);
  };

  const getHome = async () => {
    const response = await GetHomeApi();
    // console.log('response', response);
    if (response?.responseCode === 200) {
      setData(response?.result);
      let isData = false;
      response?.result.map(section => {
        if (section?.outfits?.length !== 0) {
          isData = true;
        }
        // console.log('data?', section?.outfits?.length);
      });
      // console.log('isdata', isData);
      setDataIsThere(isData);
    }
  };

  // console.log('isdataa', dataIsThere);

  const updateToken = async () => {
    const deviceToken = await getFcmToken();
    const data = {
      deviceType: Platform.OS === 'ios' ? 'ios' : 'android',
      deviceToken: deviceToken,
    };
    const response = await updateTokenApi(data);
    console.log('responsefromdevicetoken', response);
  };
  useEffect(() => {
    updateToken();
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      console.log('screenfoussedHOME');
      getHome();
    });
    return unsubscribe;
  }, []);

  const pullDownRefresh = () => {
    setisRefreshing(true);
    getHome();
    setisRefreshing(false);
  };
  console.log('home', data);

  const handleCollectionList = async id => {
    const response = await GetExploreCollectionApi(id);
    console.log('responsefromcollectionListexplore', response);
    setCollectionData(response?.result);
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
  const handleAddCollection = async collectionName => {
    const data = {
      name: collectionName,
    };
    const response = await postCollectionsApi(data);
    console.log('responsefromaddcollection', response);
    closeAddModal();
    handleCollectionList(idOpened);
  };

  // main home screen component
  const renderItem = ({item}) => (
    <View>
      <HomeFlatlist
        item={item}
        handleRefreshHome={getHome}
        openSheet={openBottomSheet}
      />
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
  };

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
  function capitaliseFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>

 
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{
        backgroundColor: COLORS.white,
      }}>
      <HomeHeader />
      {!dataIsThere ? (
        <View style={styles.noDataContainer}>
          <Image
            style={{height: 24, width: 24}}
            source={imagePath.connection}
          />
          <Text style={styles.noDataText}>No Data Available</Text>
        </View>
      ) : (
        <View style={styles.mainView}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={pullDownRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              Platform.OS === 'android'
                ? styles.androidScrollStyle
                : styles.iosScrollStyle,
            ]}>
            {data.map((section, index) => (
              <>
                {section.outfits.length > 0 && (
                  <>
                    <View key={index} style={styles.container}>
                      <Text style={styles.headerText}>
                        {capitaliseFirstLetter(section.name)}{' '}
                      </Text>
                      <Text style={styles.itemsText}>
                        {section.outfits.length} items
                      </Text>
                    </View>

                    <FlatList
                      data={section.outfits}
                      keyExtractor={item => item.id}
                      renderItem={renderItem}
                      showsHorizontalScrollIndicator={false}
                      // numColumns={2}
                      bounces={false}
                      contentContainerStyle={styles.flatlistScroll}
                      horizontal

                      // columnWrapperStyle={styles.row}
                    />
                  </>
                )}
              </>
            ))}
          </ScrollView>
        </View>
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
    </BaseView>
         </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  container: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 22,
  },
  itemsText: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.primary,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 16,
  },
  flatlistScroll: {
    paddingStart: 20,
    paddingEnd: 7,
  },
  iosScrollStyle: {
    paddingBottom: 50,
  },
  androidScrollStyle: {
    paddingBottom: 90,
  },
  noDataText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 22,
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
