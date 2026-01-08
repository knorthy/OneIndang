module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets-core/plugin',  // Add this if missing
      'react-native-reanimated/plugin',     // Must be last
    ],
  };
};