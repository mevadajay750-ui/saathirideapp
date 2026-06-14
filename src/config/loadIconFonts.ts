import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * iOS uses static frameworks (required for Firebase). Vector icon fonts live in the
 * RNVectorIcons pod bundle, so UIAppFonts alone is not enough — register them at runtime.
 */
export async function loadIconFonts(): Promise<void> {
  if (Platform.OS !== 'ios') {
    return;
  }

  await Promise.all([Ionicons.loadFont()]);
}
