/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundMessageHandler } from './src/services/notification.service';

registerBackgroundMessageHandler(async () => {
  // Background FCM handling will be implemented in a later prompt.
});

AppRegistry.registerComponent(appName, () => App);
