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
import WardrobeComponent from '../../../components/WardrobeComponent';
import {
  GetWardrobeApi,
  WardrobeApi,
  removeCollectionApi,
  updateCollectionApi,
} from '../../../services/AppApi';
import Loader from '../../../components/Loader';
// import MenuBar from '../../modals/MenuBar';
// import DeleteModal from '../../modals/DeleteModal';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
// import MenuBarCollection from '../../modals/MenuBarCollection';
import MenuBarCollection from '../../../modals/MenuBarCollection';
import DeleteModalCollection from '../../../modals/DeleteModalCollection';
import AddInWardrobe from '../../../modals/AddinWardrobe';
import {EventRegister} from 'react-native-event-listeners';
import {registeredEvents} from '../../../utils/UserPrefs';
import {ToastMessage} from '../../../components/ToastMessage';
const {height, width} = Dimensions.get('window');
export default function Wardrobe2(props) {
  // const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [searchToggle, setSearchToggle] = useState(false);
  const [search, setSearch] = useState('');
  const data = props?.route?.params?.data;
  const initialName = props?.route?.params?.name ?? '';
  const id = props?.route?.params?.id;
  console.log(id, 'idddd');
  const [collectionName, setCollectionName] = useState(initialName);
  const [menuVisible, setMenuVisible] = useState(false);
  const closeMenu = () => {
    setMenuVisible(false);
  };

  const openMenu = () => {
    setMenuVisible(true);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    closeMenu();
    setTimeout(() => {
      setModalVisible(true);
    }, 500);
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const openEditModal = () => {
    closeMenu();
    setTimeout(() => setEditModalVisible(true), 300);
  };
  const closeEditModal = () => setEditModalVisible(false);

  console.log('datafromcollectiontolist', data);
  // console.log(name);
  // const [page, setPage] = useState(0);
  // const [limit, setLimit] = useState(10);
  // const [endLimit, setEndLimit] = useState(false);
  // const [refreshing, setRefreshing] = useState(false);
  // const [footerLoader, setFooterLoader] = useState(false);
  // const data1 = [
  //   {image: imagePath.bigMan},
  //   {image: imagePath.bigMan},
  //   {image: imagePath.bigMan},
  //   {image: imagePath.bigMan},
  //   {image: imagePath.bigMan},
  //   {image: imagePath.bigMan},
  //   {image: imagePath.bigMan},
  //   {image: imagePath.bigMan},
  // ];

  const handleClearSearch = () => {
    setSearch('');
  };

  // useEffect(() => {
  //   if (search.length > 0) {
  //     handleWardrobe(0);
  //     setEndLimit(false);
  //   } else if (search.length === 0) {
  //     handleWardrobe(0);
  //     setEndLimit(false);
  //   }
  // }, [search]);

  // const LoadMoreData = () => {
  //   if (!endLimit && !footerLoader) {
  //     setFooterLoader(true);
  //     handleWardrobe(page);
  //   } else {
  //     console.log('no more loads');
  //   }
  // };

  // function _renderFooter() {
  //   if (footerLoader) {
  //     return (
  //       <View style={{height: 20, marginVertical: 20}}>
  //         <ActivityIndicator size={30} color={COLORS.black} />
  //       </View>
  //     );
  //   }
  // }
  const handleSearchToggle = () => {
    setSearchToggle(!searchToggle);
  };

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     console.log('screen focused WARDROBE');
  //     handleWardrobe(0);
  //     setEndLimit(false);
  //   });

  //   return unsubscribe;
  // }, [props.navigation]);
  // useEffect(() => {
  //   handleWardrobe(0);
  //   setEndLimit(false);
  // }, []);

  const renderItem = ({item}) => (
    <View>
      <WardrobeComponent
        data={item}
        id={id}
        // handleWardrobeRefresh={() => {
        //   handleWardrobe(0);
        //   setEndLimit(false);
        // }}
      />
    </View>
  );

  const handleRemoveCollection = async () => {
    setLoading(true);
    const response = await removeCollectionApi(id);
    console.log('responsefromremovecollectionwardrobe', response);
    if (response?.responseCode === 200) {
      setLoading(false);
      EventRegister.emit(registeredEvents.COLLECTION);
      setTimeout(() => {
        props.navigation.goBack();
        ToastMessage('Collection deleted successfully');
      }, 500);
    } else {
      setLoading(false);
      ToastMessage(response?.data?.responseMessage);
    }
  };

  const handleEditCollection = async updatedName => {
    const trimmed = updatedName?.trim();
    if (!trimmed) {
      ToastMessage(i18n.t('toastMessage.category'));
      return;
    }
    setLoading(true);
    const response = await updateCollectionApi({
      collectionId: id,
      name: trimmed,
    });
    console.log('responsefromupdatecollection', response);
    if (response?.responseCode === 200) {
      setLoading(false);
      setCollectionName(trimmed);
      closeEditModal();
      EventRegister.emit(registeredEvents.COLLECTION);
      ToastMessage('Collection updated successfully');
    } else {
      setLoading(false);
      ToastMessage(response?.data?.responseMessage);
    }
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
        {/* {searchToggle ? (
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
        ) : ( */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image source={imagePath.Back} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{collectionName}</Text>
        </View>
        {/* )} */}
          <TouchableOpacity onPress={openMenu}>
            <Image source={imagePath.dot} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={styles.mainView}>
        <FlatList
          data={data}
          numColumns={3}
          columnWrapperStyle={styles.row}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatlistStyle}
          showsVerticalScrollIndicator={false}
          // onEndReached={LoadMoreData}
          onEndReachedThreshold={0.1}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={() => {
          //       setRefreshing(true);
          //       handleWardrobe(0);
          //       setEndLimit(false);
          //     }}
          //     tintColor={COLORS.black}
          //   />
          // }
          // ListFooterComponent={_renderFooter}
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
      {loading && <Loader />}
      <MenuBarCollection
        closeMenu={closeMenu}
        visible={menuVisible}
        deleteButton={openModal}
        editButton={openEditModal}
        text={collectionName}
      />
      <DeleteModalCollection
        visible={modalVisible}
        closeModal={closeModal}
        navigation={navigation}
        handleVerify={handleRemoveCollection}
        text1={i18n.t('del.delete')}
        text={i18n.t('del.del')}
      />
      <AddInWardrobe
        closeModal={closeEditModal}
        visible={editModalVisible}
        handleAddNewCategory={handleEditCollection}
        initialValue={collectionName}
        titleText="Edit Collection"
        primaryButtonText="Save"
      />
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
    // paddingHorizontal: 20,
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start',
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
    // paddingTop: 33,
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
    // height: 56,
    backgroundColor: COLORS.white,
    flex: 1,
    gap: 20,
  },
  headerText: {
    fontSize: FONT_SIZES.twenty,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.prata,
    lineHeight: 27,
    flex: 1,
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
});
