/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import 'react-native-gesture-handler';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';


// GoogleSignin.configure({
// 	webClientId:'963692059738-96r9386vl8n0sofknnlc7d2mq68ejkpg.apps.googleusercontent.com',
// 	androidClientId:'963692059738-2qmgqptrbo052qsria47t3va4jj8ifrs.apps.googleusercontent.com',
// 	// iosClientId:'765505616763-th5p4mrjl0svr4sjd1m8mcerc82l10om.apps.googleusercontent.com',
// 	scopes: ['profile', 'email'],
// });

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
AppRegistry.registerComponent(appName, () => App);
