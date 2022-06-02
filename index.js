import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { registerRainbowCallApp } from './src/Calls/CallApp'

AppRegistry.registerComponent(appName, () => App);
// Register Rainbow Calls
registerRainbowCallApp();