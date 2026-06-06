/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { loadIconFonts } from './src/config/loadIconFonts';
import { setBackgroundMessageHandler } from './src/services/notification.service';

setBackgroundMessageHandler();

async function bootstrap() {
  await loadIconFonts();
  AppRegistry.registerComponent(appName, () => App);
}

bootstrap();
