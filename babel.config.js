module.exports = function (api) {
  api.cache(true);
  let plugins = [];
  plugins.push('react-native-worklets/plugin');
  // Reanimated plugin is required for @gorhom/bottom-sheet and Reanimated v2
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
