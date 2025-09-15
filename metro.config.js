
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const root = path.resolve(__dirname, '..');
const extraNodeModules = {
  'react-native-rainbow-module': path.resolve('./node_modules/react-native-rainbow-module'),
};
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
* @type {import('@react-native/metro-config').MetroConfig} */
const config = {
  watchFolders: [path.resolve('./node_modules/react-native-rainbow-module')],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we block them at the root, and alias them to the versions in example's node_modules
  resolver: {
    nodeModulesPaths: [root],
    extraNodeModules: extraNodeModules,
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
