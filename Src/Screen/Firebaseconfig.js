// firebaseInitializer.js
import { initializeApp, getAuth } from '@react-native-firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBB75Y9nYdEL7ebn68DEUJ7u9J92k6pzPI',
    authDomain: 'docoinlaunchpad.com',
    projectId: 'docoinlaunchpad-afd0b',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: '625850993642',
    appId: '1:625850993642:android:791ba9313db20f42a90093',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
