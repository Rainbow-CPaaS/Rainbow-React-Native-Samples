const plugins = [  
  "react-native-reanimated/plugin",
]
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["module:@react-native/babel-preset"],
    plugins,
  };
};