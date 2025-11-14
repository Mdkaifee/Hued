import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
import {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  SCREEN_WIDTH,
} from '../utils/constants';

export default function GenderModal({closeModal, visible, onSelectedGender}) {
  const genders = [
    i18n.t('gender.male'),
    i18n.t('gender.female'),
    i18n.t('gender.non'),
  ];
  const [selectedGender, setSelectedGender] = useState('');

  const handleGenderSelection = gender => {
    setSelectedGender(gender);
    onSelectedGender(gender);
    closeModal();
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
          <Text style={styles.deleteText}>{i18n.t('gender.gender')}</Text>
          <TouchableOpacity onPress={closeModal}>
            <Image style={styles.crossImg} source={imagePath.cross} />
          </TouchableOpacity>
        </View>
        {genders.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.genderButton,
              selectedGender === item && {backgroundColor: COLORS.black},
            ]}
            onPress={() => handleGenderSelection(item)}>
            <Text
              style={{
                color: selectedGender === item ? COLORS.white : COLORS.black,
              }}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: COLORS.white,
    height: 272,
    width: '100%',
    borderRadius: 16,
  },

  deleteText: {
    fontSize: FONT_SIZES.twenty,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.semiBold,
    lineHeight: 30,
    textAlign: 'center',

    // marginBottom: 8,
  },
  genderButton: {
    height: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginHorizontal: 30,
    marginTop: 14,

    borderWidth: 1,
    borderColor: COLORS.black,
  },
  yearView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
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
});
