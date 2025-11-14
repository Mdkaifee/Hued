import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import i18n from '../translation/i18n';
import imagePath from '../utils/imagePath';
import {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHT,
} from '../utils/constants';

import CustomButton from '../../src/components/CustomButtton';
import TextInputWithLabel from '../../src/components/TextInputWLabel';

export default function ForgotPassword(props) {
  const {closeModal, visible, navigation, handleVerify} = props;
  const [email, setEmail] = useState('');

  
  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      // onBackdropPress={closeModal}
      backdropOpacity={0.5}
      isVisible={visible}
      transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.ceneteredView}>
          <Text style={styles.deleteText}>{i18n.t('forgot.reset')}</Text>
          <TouchableOpacity style={styles.crossImg} onPress={closeModal}>
            <Image source={imagePath.cross} />
          </TouchableOpacity>
        </View>
        <Text style={styles.longText}>{i18n.t('forgot.enter')}</Text>
        <TextInputWithLabel
          label={'Email'}
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <View style={styles.buttonView}>
          <CustomButton
            title={i18n.t('forgot.reset')}
            onPress={() => {
              handleVerify(email);
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: COLORS.white,
    height: 281,
    width: '100%',
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  crossImg: {},
  ceneteredView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  deleteText: {
    fontSize: FONT_SIZES.eighteen,
    color: '#333333',
    fontFamily: FONT_FAMILIES.semiBold,

    lineHeight: 30,
    textAlign: 'center',
  },
  buttonView: {},

  longText: {
    fontSize: FONT_SIZES.fourteen,
    color: '#000000CC',
    fontFamily: FONT_FAMILIES.regular,

    lineHeight: 18,
    marginBottom: 20,
    marginTop: 12,
  },
  emailText: {
    fontSize: FONT_SIZES.sixteen,
    fontFamily: FONT_FAMILIES.fontFamily,
    color: '#000000CC',

    marginBottom: 8,
    marginTop: 10,
  },
  emailInputView: {
    backgroundColor: '#c9c9c940',
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 6,
    justifyContent: 'center',
    marginBottom: 55,
  },
  inputStyle: {
    fontSize: FONT_SIZES.fourteen,

    color: '#000000CC',
    fontFamily: FONT_FAMILIES.fontFamily,
  },
});
