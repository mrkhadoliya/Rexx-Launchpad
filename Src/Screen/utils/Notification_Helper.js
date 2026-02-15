import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../../../global';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken();
  }
}

async function GetFCMToken() {
  let fcmtoken = await AsyncStorage.getItem('FCMToken');
  console.log('fcmtken old >>>>>>>', fcmtoken);
  global.FCM_Token = fcmtoken;

  if (!fcmtoken) {
    try {
      const fcmtoken = await messaging().getToken();
      if (fcmtoken) {
        console.log('fcmtken new >>>>>>>', fcmtoken);
        await AsyncStorage.setItem('FCMToken', fcmtoken);
        global.FCM_Token = fcmtoken;
      }
    } catch (error) {
      console.log(error);
    }
  }
}


export const NotificationListner = () => {
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log(
//       'Notification caused app to open from background state:',
//       remoteMessage.notification,
//     );
//   });

messaging().setBackgroundMessageHandler(async remoteMesage => {
    console.log('background',remoteMesage);
})

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('notification on forground state.....', remoteMessage);
  });
};
