import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName, callAppName} from './app.json';
import {CallApp} from './src/Calls/CallApp';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(callAppName, () => CallApp);
