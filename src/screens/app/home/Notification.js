import {
  SectionList,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseView from '../../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
import CommonHeader from '../../../components/CommonHeader';
import {notificationsApi} from '../../../services/AppApi';
import moment from 'moment';
import {RefreshControl} from 'react-native-gesture-handler';
const {height, width} = Dimensions.get('window');

export default function Notifications() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [endLimit, setEndLimit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const LoadMoreData = () => {
    if (!endLimit && !footerLoader) {
      setFooterLoader(true);
      handleNotification(page);
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
  const handleNotification = async page => {
    const response = await notificationsApi(page, limit);
    console.log('responsefromnotifcationApi', JSON.stringify(response));

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
  useEffect(() => {
    handleNotification(0);
    setEndLimit(false);
  }, []);

  // const organizeData = () => {
  //   const organizedData = {};

  //   data.forEach(item => {
  //     const date = moment(item.createdAt).format('YYYY-MM-DD');

  //     if (!organizedData[date]) {
  //       organizedData[date] = [];
  //     }

  //     organizedData[date].push(item);
  //   });

  //   const sortedSections = Object.keys(organizedData).sort((a, b) => {
  //     return moment(b, 'YYYY-MM-DD').diff(moment(a, 'YYYY-MM-DD'));
  //   });

  //   return sortedSections.map(date => ({
  //     title: date,
  //     data: organizedData[date],
  //   }));
  // };
  const organizeData = () => {
    const organizedData = {};

    data.forEach(item => {
      const date = moment(item.createdAt).format('YYYY-MM-DD');

      if (!organizedData[date]) {
        organizedData[date] = [];
      }

      organizedData[date].push(item);
    });

    const sortedSections = Object.keys(organizedData).sort((a, b) => {
      return moment(b, 'YYYY-MM-DD').diff(moment(a, 'YYYY-MM-DD'));
    });

    // Sort notifications within each section in descending order
    sortedSections.forEach(date => {
      organizedData[date].sort((a, b) => {
        return moment(b.createdAt).diff(moment(a.createdAt));
      });
    });

    return sortedSections.map(date => ({
      title: date,
      data: organizedData[date],
    }));
  };

  const DATA = organizeData();

  console.log(JSON.stringify(DATA));

  const formatSectionTitle = title => {
    const currentDate = moment().startOf('day');
    const sectionDate = moment(title);

    if (currentDate.isSame(sectionDate, 'day')) {
      return 'Today';
    } else if (currentDate.subtract(1, 'days').isSame(sectionDate, 'day')) {
      return 'Yesterday';
    } else if (currentDate.week() === sectionDate.week()) {
      return 'This Week';
    } else {
      return moment(title).format('MMMM D, YYYY');
    }
  };
  return (
    <BaseView
      safeView={{backgroundColor: COLORS.white}}
      topView={{flex: 0, backgroundColor: COLORS.white}}
      baseViewStyle={{
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
      }}>
      <CommonHeader
        title={i18n.t('notifications.notifications')}
        imageLeft={imagePath.Back}
        // headerStyle={{paddingHorizontal: 20}}
      />
      <View style={styles.mainView}>
        <SectionList
          sections={DATA}
          stickySectionHeadersEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentStyle}
          onEndReached={LoadMoreData}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                handleNotification(0);
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
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => (
            <View style={styles.container}>
              <View style={styles.transparentView}>
                <Image source={item.img} />
                <View style={styles.TextView}>
                  <Text style={styles.desText1}>{item?.message} </Text>
                  <Text style={styles.offerText}>
                    {moment(item?.createdAt).format('hh:mm a')}
                  </Text>
                </View>
              </View>
            </View>
          )}
          renderSectionHeader={({section: {title}}) => {
            console.log(title, 'tileeee');
            return (
              <View style={styles.headerView}>
                <Text style={styles.todayText}>
                  {formatSectionTitle(title)}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 11,
    // paddingHorizontal: 20,
  },
  transparentView: {
    flexDirection: 'row',
    flex: 1,
    // paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'center',
    // gap: 12,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderColor: '#00000033',
    marginBottom: 20,
  },
  TextView: {
    flex: 1,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  offerText: {
    fontSize: FONT_SIZES.fourteen,
    color: '#979797',
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 18,
  },
  todayText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.primary,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 20,
  },
  desText: {
    flex: 1,
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 18,
  },
  desText1: {
    flex: 1,
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 18,
  },
  headerView: {
    marginBottom: 14,
    backgroundColor: COLORS.white,
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
});
