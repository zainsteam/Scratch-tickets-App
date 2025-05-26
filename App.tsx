/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
// import './firebaseConfig';
import {getApps, initializeApp} from '@react-native-firebase/app';
import {getMessaging} from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import HomeScreen from './screens/home';
import AppNavigator from './routes/homestack';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-3713847936361138/5905727511';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

async function getFCMToken() {
  try {
    await getMessaging().registerDeviceForRemoteMessages();
    const token = await getMessaging().getToken();
    console.log('FCM Token:', token);
  } catch (error) {
    console.error('Failed to get FCM token:', error);
  }
}

function App(): React.JSX.Element {
  useEffect(() => {
    const firebaseConfig = {
      apiKey: 'AIzaSyAiW4zVngCI8REeZe_xsX2wEtRvLvPkKW4',
      authDomain: 'scratchticketgenie-cda36.firebaseapp.com',
      projectId: 'scratchticketgenie-cda36',
      storageBucket: 'scratchticketgenie-cda36.firebasestorage.app',
      messagingSenderId: '497463621680',
      appId: '1:497463621680:android:4c0b65e06c7d80982355f5',
    };

    const firebaseApp =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    const unsubscribe = getMessaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log('Received background notification:', remoteMessage);
      },
    );
    const tokens = getFCMToken();
    return unsubscribe;
  }, []);

  return (
    <>
      <AppNavigator />
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </>
  );
}

export default App;
