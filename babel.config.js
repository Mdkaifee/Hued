module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      require.resolve('react-native-worklets-core/plugin'),
      require.resolve('react-native-reanimated/plugin'),
    ],
  };
};
