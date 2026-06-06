import firebase from '@react-native-firebase/app';

export const isFirebaseConfigured =
  firebase.apps.length > 0 &&
  firebase.app().options.projectId !== 'saathiride-placeholder';

export { firebase };
export { default as auth } from '@react-native-firebase/auth';
export { default as firestore } from '@react-native-firebase/firestore';
export { default as storage } from '@react-native-firebase/storage';
export { default as messaging } from '@react-native-firebase/messaging';
