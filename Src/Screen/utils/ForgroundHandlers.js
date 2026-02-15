import notifee, {AndroidImportance} from '@notifee/react-native';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';


const ForegroundHandler = () => {
  useEffect(() => {
    const unSubscribe = messaging().onMessage(async remoteMessage => {
      console.log('foreground >>>>......', remoteMessage);
      const {notification, messageId} = remoteMessage;
      await notifee.requestPermission();
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'Launchpad',
        name: 'Launchpad Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      // Display a notification
      await notifee.displayNotification({
        title: notification.title,
        body: notification.body,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      });
    });
    return unSubscribe;
  }, []);
  return null;
};

export default ForegroundHandler;
