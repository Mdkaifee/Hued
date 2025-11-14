import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import BaseView from '../../../../BaseView';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../../../utils/constants';
import CommonHeader from '../../../components/CommonHeader';
import i18n from '../../../translation/i18n';
import imagePath from '../../../utils/imagePath';
import TextInputWithLabel from '../../../components/TextInputWLabel';
import CustomButton from '../../../components/CustomButtton';
import {VARIABLES} from '../../../utils/globalVariables';
import {ContactUsApi} from '../../../services/AuthApi';
import {ToastMessage} from '../../../components/ToastMessage';
import Loader from '../../../components/Loader';

export default function ContactUs(props) {
  const userData = JSON.parse(VARIABLES.details);
  const [loading, setLoading] = useState(false);
  console.log('details', userData);
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const checkRequiredFields = () => {
    if (subject.trim() == '') {
      ToastMessage(i18n.t('toastMessage.subject'));
      return false;
    } else if (message.trim() == '') {
      ToastMessage(i18n.t('toastMessage.message'));
      return false;
    } else {
      return true;
    }
  };
  const handleSendInquiry = async () => {
    const isValid = checkRequiredFields();
    if (isValid) {
      setLoading(true);
      const data = {
        name: name,
        email: email,
        subject: subject,
        comment: message,
      };
      console.log('data', data);
      const response = await ContactUsApi(data);
      console.log('responsee', response);
      if (response?.responseCode === 200) {
        setLoading(false);
        setTimeout(() => {
          props.navigation.goBack();
          ToastMessage('Inquiry sent successfully');
        }, 1000);
      } else {
        setLoading(false);
        ToastMessage(response?.data?.responseMessage);
      }
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
        title={i18n.t('contact.contact')}
        imageLeft={imagePath.Back}
      />
      <View style={styles.mainView}>
        <ScrollView scrollEnabled={false}>
          <Text style={styles.leaveText}>{i18n.t('contact.leave')}</Text>
          <TextInputWithLabel
            label={i18n.t('contact.name')}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputText1}
            value={name}
            onChangeText={text => setName(text)}
            editable={false}
          />
          <TextInputWithLabel
            label={i18n.t('contact.email')}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputText1}
            value={email}
            onChangeText={text => setEmail(text)}
            editable={false}
          />
          <TextInputWithLabel
            label={i18n.t('contact.subject')}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputText}
            value={subject}
            onChangeText={text => setSubject(text)}
          />
          <TextInputWithLabel
            label={i18n.t('contact.what')}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputText}
            value={message}
            onChangeText={text => setMessage(text)}
          />
        </ScrollView>
      </View>
      <CustomButton
        title={i18n.t('contact.send')}
        onPress={handleSendInquiry}
      />
      {loading && <Loader />}
    </BaseView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    marginTop: 6,
    flex: 1,
  },
  leaveText: {
    fontSize: FONT_SIZES.sixteen,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 21,
    marginBottom: 30,
  },
  inputContainerStyle: {
    borderBottomColor: '#D4D4D4',
  },
  inputText: {
    fontSize: FONT_SIZES.fourteen,
  },
  inputText1: {
    fontSize: FONT_SIZES.fourteen,

    color: COLORS.lightBlack,
  },
});
