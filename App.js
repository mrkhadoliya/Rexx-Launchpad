import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import MainNavigation from './Src/Screen/navigation/MainNavigation'
import store from './Src/Screen/Redux-Toolkit/Slices/Store/Index'
import { Provider } from 'react-redux'
import OTP from './Src/Screen/Otp'
import { NotificationListner, requestUserPermission } from './Src/Screen/utils/Notification_Helper'
import ForegroundHandler from './Src/Screen/utils/ForgroundHandlers'
import notifee, {EventType} from '@notifee/react-native';
import SuperNavigation from './Src/Screen/navigation/SuperNavigate'



const App = () => {
  // if (!firebase.apps.length) {
  //   firebase.initializeApp({
  //     // Your Firebase config object
  //     apiKey: "316853437111-7fjqtsl0chu008tkf5pvr2e4lff0fp1m.apps.googleusercontent.com",
  //     authDomain: "docoinlaunchpad.com",
  //     projectId: "docoinlaunchpad-9e010",
  //     storageBucket: "docoinlaunchpad-9e010.appspot.com",
  //     messagingSenderId: "316853437111",
  //     appId: "1:316853437111:android:476ed602da170d5d364332"
  //   });
  // }

  useEffect(() => {
    requestUserPermission();
    NotificationListner();
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);

          break;
      }
    });
  }, []);

  
  
  return (
   <Provider store={store}>
     <ForegroundHandler />
     <SuperNavigation />
   </Provider>
  )
}

export default App