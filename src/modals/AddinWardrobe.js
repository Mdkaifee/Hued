import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
import TextInputWithLabel from '../components/TextInputWLabel';
import {ToastMessage} from '../components/ToastMessage';

export default function AddInWardrobe({
  closeModal,
  visible,
  navigation,
  handleAddNewCategory,
  initialValue = '',
  titleText = 'Create Collection',
  primaryButtonText = 'Add',
}) {
  const [category, setCategory] = useState(initialValue);

  useEffect(() => {
    if (visible) {
      setCategory(initialValue);
    }
  }, [visible, initialValue]);
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
        const newCategory = category.trim();
        handleAddNewCategory(newCategory); // Get the new category value from your input field
        setCategory('');
      }
    }
  };
  const removeState = () => {
    setCategory('');
    closeModal();
  };
  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onBackdropPress={removeState}
      backdropOpacity={0.7}
      isVisible={visible}
      transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.mainView}>
          <Text style={styles.deleteText}>{titleText}</Text>
          {/* <TouchableOpacity style={styles.crossImg} onPress={closeModal}>
              <Image source={imagePath.cross2} />
            </TouchableOpacity> */}
        </View>
        <View
          style={{
            height: 104,
            width: 104,
            marginBottom: 10,
            marginTop: 10,
            borderRadius: 6,
            backgroundColor: COLORS.bgColor,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              height: 44,
              width: 44,
              alignSelf: 'center',
              borderRadius: 6,
              marginTop: 10,
              alignSelf: 'center',
            }}
            source={imagePath.data}
          />
        </View>

        <TextInputWithLabel
          label={'Collection Name'}
          labelStyle={{alignSelf: 'center', marginBottom: 10}}
          inputStyle={{fontSize: FONT_SIZES.fourteen}}
          inputContainerStyle={{
            borderBottomColor: COLORS.textBlack,
            marginTop: 20,
            height: 54,
            marginBottom: 8,
          }}
          maxLength={maxCharacters}
          value={category}
          onChangeText={handleTextChange}
        />
        <Text
          style={styles.maximum}>{`${category.length}/${maxCharacters}`}</Text>
        <View style={styles.containerView}>
          <TouchableOpacity
            style={styles.buttonViewAdd}
            onPress={saveNewCategory}>
            <Text style={styles.saveAddText}>{primaryButtonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonView} onPress={removeState}>
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
    height: 390,
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
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    flex: 1,
    borderColor: COLORS.black,
    borderWidth: 1,
  },
  saveCancelText: {
    fontSize: FONT_SIZES.eighteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 30,
  },
  containerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 50,
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
    height: 97,
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
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.bold,
    lineHeight: 34,
  },
  logoutimg: {
    height: 34,
    width: 34,
  },
  buttonViewAdd: {
    backgroundColor: COLORS.black,
    height: 37,
    //   width: 80,
    flex: 1,
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',
  },
  saveAddText: {
    fontSize: FONT_SIZES.eighteen,
    color: COLORS.white,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: 30,
  },
  maximum: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.lightText,
    fontFamily: FONT_FAMILIES.medium,
    textAlign: 'right',
  },
});
