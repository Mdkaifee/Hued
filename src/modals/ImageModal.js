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
// import i18n from '../../translation/i18n';
import imagePath from '../utils/imagePath';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';

export default function ImageModal({
  closeModal,
  visible,
  navigation,
  onPress3D,
  onPressImage,
}) {
  console.log('visible state', visible);
  return (
    <Modal
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      onBackdropPress={closeModal}
      // animationOutTiming={00}

      backdropOpacity={0.5}
      isVisible={visible}
      style={{margin: 0}}
      transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.uploadCrossView}>
            <Text style={styles.uploadCrossText}>Do you want to</Text>
            <TouchableOpacity onPress={closeModal}>
              <Image source={imagePath.cross} />
            </TouchableOpacity>
          </View>
          <View style={styles.takePhotoGalleryView}>
            <TouchableOpacity
              style={styles.transparentView}
              onPress={onPressImage}>
              <View style={styles.blackView}>
                <Image source={imagePath.gallery} />
              </View>
              <Text style={styles.takeText}>Generate Color Palette</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.transparentView}
              onPress={onPress3D}>
              <View style={styles.blackView}>
                <Image source={imagePath.round} />
              </View>
              <Text style={styles.takeText}>Generate 360 View</Text>
            </TouchableOpacity>
          </View>
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
    height: 253,
    width: '100%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 22,
  },
  uploadCrossView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadCrossText: {
    fontSize: FONT_SIZES.twenty,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
  },
  transparentView: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1.2,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    height: 140,
    alignItems: 'flex-start',
    paddingTop: 24,
    paddingStart: 20,
    gap: 16,
    flex: 1,
  },

  blackView: {
    backgroundColor: COLORS.black,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takePhotoGalleryView: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  takeText: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
  },
});
