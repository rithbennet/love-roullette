module.exports = function (api) {
  api.cache(true);
  let plugins = [];
  plugins.push('react-native-worklets/plugin');
  // Reanimated plugin is required for @gorhom/bottom-sheet and Reanimated v2
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
