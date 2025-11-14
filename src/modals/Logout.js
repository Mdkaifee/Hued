import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';

export default function Logout({
  closeModal,
  visible,
  navigation,
  handleVerify,
}) {
  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onBackdropPress={closeModal}
      backdropOpacity={0.5}
      isVisible={visible}
      transparent={true}>
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.crossImg} onPress={closeModal}>
          <Image source={imagePath.cross} />
        </TouchableOpacity>
        <View style={styles.ceneteredView}>
          <Image style={styles.logoutimg} source={imagePath.logout1} />
          <Text style={styles.deleteText}>{i18n.t('logout.logout')}</Text>
          <Text style={styles.areText}>{i18n.t('logout.are')}</Text>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.noView} onPress={closeModal}>
            <Text style={styles.noText}>{i18n.t('logout.no')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.yesView} onPress={handleVerify}>
            <Text style={styles.yesText}>{i18n.t('logout.yes')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: COLORS.white,
    height: 200,
    width: '100%',
    borderRadius: 16,
  },
  crossImg: {
    alignSelf: 'flex-end',
    marginTop: 11,
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  ceneteredView: {
    marginTop: 17,
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  deleteText: {
    fontSize: FONT_SIZES.twentyFour,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.semiBold,
    lineHeight: 30,
    textAlign: 'center',
    marginTop: 6,
  },
  areText: {
    fontSize: FONT_SIZES.eighteen,
    color: COLORS.lightBlack,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 20,
    marginBottom: 17,
  },
  noView: {
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    flex: 1,
    borderColor: COLORS.black,
    borderWidth: 1,
  },
  yesView: {
    backgroundColor: COLORS.black,
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    flex: 1,
  },
  noText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 34,
  },
  yesText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.white,
    fontFamily: FONT_FAMILIES.bold,
    lineHeight: 34,
  },
  logoutimg: {
    height: 34,
    width: 34,
  },
});
