import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
import TextInputWithLabel from '../components/TextInputWLabel';
import {ToastMessage} from '../components/ToastMessage';

export default function AddNew({
  closeModal,
  visible,
  navigation,
  handleAddNewCategory,
}) {
  const [category, setCategory] = useState('');
  const checkRequiredFields = () => {
    if (category.trim() == '') {
      ToastMessage(i18n.t('toastMessage.category'));
      return false;
    } else {
      return true;
    }
  };
  const maxCharacters = 20;

  const handleTextChange = text => {
    if (text.length <= maxCharacters) {
      setCategory(text);
    }
  };

  const saveNewCategory = () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      {
        const newCategory = category;
        handleAddNewCategory(newCategory); // Get the new category value from your input field
        setCategory('');
      }
    }
  };
  const handleClose = () => {
    setCategory('');
    closeModal();
  };
  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onBackdropPress={handleClose}
      backdropOpacity={0.7}
      isVisible={visible}
      transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.mainView}>
          <Text style={styles.deleteText}>Add New Collection</Text>
          <TouchableOpacity style={styles.crossImg} onPress={handleClose}>
            <Image source={imagePath.cross2} />
          </TouchableOpacity>
        </View>
        <TextInputWithLabel
          label={'Collection'}
          inputStyle={{fontSize: FONT_SIZES.fourteen}}
          inputContainerStyle={{
            borderBottomColor: COLORS.textBlack,
            marginBottom: 2,
          }}
          maxLength={maxCharacters}
          value={category}
          onChangeText={handleTextChange}
        />
        <Text
          style={styles.maximum}>{`${category.length}/${maxCharacters}`}</Text>
        <View style={styles.containerView}>
          <TouchableOpacity style={styles.buttonView} onPress={saveNewCategory}>
            <Text style={styles.saveCancelText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonView} onPress={handleClose}>
            <Text style={styles.saveCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: COLORS.white,
    height: 190,
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  ceneteredView: {
    marginTop: 17,
    alignItems: 'center',

    flex: 1,
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 18,
    marginBottom: 10,
  },
  buttonView: {
    backgroundColor: COLORS.black,
    height: 30,
    width: 80,
    alignItems: 'center',
    borderRadius: 4,
  },
  saveCancelText: {
    fontSize: FONT_SIZES.fourteen,
    color: COLORS.white,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 30,
  },
  containerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  deleteText: {
    fontSize: FONT_SIZES.eighteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.semiBold,
    lineHeight: 30,
  },
  areText: {
    fontSize: FONT_SIZES.eighteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
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
  maximum: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.lightText,
    fontFamily: FONT_FAMILIES.medium,
    textAlign: 'right',
    marginBottom: 20,
  },
});
