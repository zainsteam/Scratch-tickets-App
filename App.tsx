/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';
// import './firebaseConfig';
import {getApps, initializeApp} from '@react-native-firebase/app';
import {getMessaging} from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
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
  : Platform.OS === 'android'
  ? 'ca-app-pub-3713847936361138/5905727511'
  : 'ca-app-pub-3713847936361138/2156204320';
  

if (Platform.OS === 'android') {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

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
    // Ensure MaterialIcons font is loaded on iOS
    IconMI.loadFont();
    // Ensure FontAwesome font is loaded on iOS
    IconFA.loadFont();
    // iOS: request notification permission before registering for remote messages
    if (Platform.OS === 'ios') {
      getMessaging()
        .requestPermission()
        .catch(() => {});
    }
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
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </>
  );
}

export default App;
