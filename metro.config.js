/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const extraNodeModules = {
  'react-native-rainbow-module': path.resolve('./node_modules/react-native-rainbow-module'),
};
const watchFolders = [
  path.resolve('./node_modules/react-native-rainbow-module')
];

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules
  },
  watchFolders,
};