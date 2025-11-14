import {Image, StyleSheet, Text, View, Dimensions, Modal} from 'react-native';
import React from 'react';
import imagePath from '../utils/imagePath';
// import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';

const {height, width} = Dimensions.get('window');
export default function Loader() {
  return (
    <Modal visible transparent>
      <View style={styles.mainView}>
        <LottieView
          style={styles.image}
          source={imagePath.lottie}
          autoPlay
          loop
        />
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
    backgroundColor: 'rgba(0, 0, 0, 0.60)',
    zIndex: 9999,
  },
  image: {
    height: 270,
    width: 270,
  },
});

// import React from 'react';
// import LottieView from 'lottie-react-native';
// import imagePath from '../utils/imagePath';

// export default function Loader() {
//   return <LottieView  source={imagePath.Lottie} autoPlay loop />;
// }
