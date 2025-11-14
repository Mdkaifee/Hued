import {Image, StyleSheet, Text, View, Dimensions, Modal} from 'react-native';
import React from 'react';
import imagePath from '../utils/imagePath';

export default function Loader() {
  return (
    <Modal visible transparent>
      <View style={styles.mainView}>
        <Image style={styles.image} source={imagePath.loader1} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 9999,
  },
  image: {
    width: '18%',
    height: '9%',
  },
});
