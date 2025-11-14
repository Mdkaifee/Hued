import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import i18n from '../../src/translation/i18n';
// import imagePath from '../../utils/imagePath';
import imagePath from '../utils/imagePath';
import {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  SCREEN_WIDTH,
} from '../utils/constants';

export default function YearModal({closeModal, visible, onSelectedYear}) {
  const [selectedYear, setSelectedYear] = useState('');

  const handleYearSelection = year => {
    const yearAsString = year.toString(); // Convert year to string
    console.log(yearAsString);
    setSelectedYear(year);
    onSelectedYear(yearAsString);
    closeModal();
  };

  const renderYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1800; // Change this to the desired starting year
    const years = Array.from(
      {length: currentYear - startYear + 1},
      (_, index) => currentYear - index,
    );

    return years.map(year => (
      <TouchableOpacity
        key={year}
        onPress={() => handleYearSelection(year)}
        style={[
          styles.yearItem,
          selectedYear === year && styles.selectedYearItem,
        ]}>
        <Text
          style={[
            styles.yearText,
            selectedYear === year && styles.selectedYearText,
          ]}>
          {year}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onBackdropPress={closeModal}
      backdropOpacity={0.5}
      isVisible={visible}
      transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.yearView}>
          <Text style={styles.deleteText}>{i18n.t('gender.year')}</Text>
          <TouchableOpacity onPress={closeModal}>
            <Image style={styles.crossImg} source={imagePath.cross} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.yearPickerContainer}>
          {renderYears()}
        </ScrollView>
        <View style={{marginTop: 20}} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: COLORS.white,
    height: 380,
    width: '100%',
    borderRadius: 16,
  },
  crossImg: {
    // alignSelf: 'flex-end',
    // marginTop: 11,
    // position: 'absolute',
    // right: 16,
    // zIndex: 1,
    height: 20,
    width: 20,
  },
  deleteText: {
    fontSize: FONT_SIZES.twenty,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.semiBold,
    lineHeight: 30,
    textAlign: 'center',
  },
  yearPicker: {
    // height: 200,
  },
  yearPickerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    // paddingBottom: 16,
  },
  yearItem: {
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.black,
    paddingVertical: 10,
    borderColor: COLORS.lightBorderLine,
    borderWidth: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 130,
    marginBottom: 10,
  },
  selectedYearItem: {
    backgroundColor: COLORS.black,
  },
  yearText: {
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.black,
    paddingVertical: 2,
  },
  selectedYearText: {
    color: COLORS.white,
  },
  yearView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 14,
    // backgroundColor: 'pink',
  },
});
