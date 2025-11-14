module.exports = {
  dependencies: {
    // Disable only libraries that don't have native Android pieces you rely on.
    '@bam.tech/react-native-image-resizer': {},
  
    '@react-native-async-storage/async-storage': { platforms: { android: null } },
    // '@react-native-community/geolocation': { platforms: { android: null } },
    '@somesoap/react-native-image-palette': { platforms: { android: null } },
    // 'lottie-react-native': { platforms: { android: null } },
    'react-native-permissions': { platforms: { android: null } },

    // Keep core/native heavy libraries autolinked.
    'react-native-gesture-handler': {},
    'react-native-image-crop-picker': {},
    'react-native-reanimated': {},
    'react-native-safe-area-context': {},
    'react-native-screens': {},
    'react-native-svg': {},
    'react-native-vision-camera': {},
    // '@d11/react-native-fast-image': {},
    'react-native-worklets-core': {},
    'react-native-localize': {},
    '@react-native-community/geolocation': {},
    '@react-native-google-signin/google-signin': {},
    'react-native-webview': {},
    'lottie-react-native': {},

  },
};
