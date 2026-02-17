import {
  StyleSheet,
  Switch,
  Text,
  View,
  Button,
  Image,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from '../components/toast';
// import RNFS from 'react-native-fs'; // Import react-native-fs
import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {disableAds, updateProfile} from '../providers/apiprovider';

const SettingsScreen = ({navigation}: any) => {
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [adsEnabled, setAdsEnabled] = useState(false); // Default false
  const [shoutoutProof, setShoutoutProof] = useState<any>(null);
  const [userData, setuserData] = useState<any>(null);
  const [pendingApproval, setPendingApproval] = useState<any>(null);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ Track loading state
  const [toastConfig, setToastConfig] = useState({
    message: '',
    type: 'success',
    position: 'top',
  });

  const handleNewsletterToggle = async (value: any) => {
    const changeValue = value ? 'active' : 'deactive';

    const updatedUserData = {
      ...userData,
      subscribe: changeValue, // Update the subscription status
    };

    setuserData(updatedUserData); // Update the state
    setNewsletterEnabled(value);

    const data = {
      name: userData.name,
      email: userData.email,
      customer_id: userData.id,
      subscribe: userData.subscribe,
    };

    try {
      const response = await updateProfile(data);
      // const jsonValue = await AsyncStorage.setItem('userData', response);
      showToast('success', `Newsletter ${changeValue}`, 'bottom');
      // console.log('Profile updated successfully:', response.message);
    } catch (error: any) {
      showToast('success', error.message, 'bottom');
      // console.error('Profile update failed:', error);
    }

    // console.log(userData, 'data');
  };

  // Check if the user is already logged in on app startup
  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true); // Start loading
        const jsonValue = await AsyncStorage.getItem('userData');
        const data = jsonValue ? JSON.parse(jsonValue) : null;
        // console.log(data, 'data');

        if (data) {
          setuserData(data);
          // console.log(userData);
          setAdsEnabled(data.ads === 'active');

          // Set pending state if ads are deactivated and proof is uploaded
          setPendingApproval(data.ads === 'deactive' && shoutoutProof);
        }
      } catch (error) {
        // console.error('Error retrieving data ', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getUserData();
  }, [shoutoutProof]);

  if (loading) {
    return <Text>Loading user data...</Text>; // ✅ Prevent UI flickering
  }

  const showToast = (type: any, message: any, position: any) => {
    setToastConfig({type, message, position});
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // Auto-hide
  };

  const convertUriToBase64 = async (imageUri: string | null) => {
    if (!imageUri) {
      // console.error('Image URI is null or undefined.');
      return null;
    }

    try {
      const base64String = await RNFS.readFile(imageUri, 'base64');
      // console.log(base64String, 'image');
      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      // console.error('Error converting URI to Base64:', error);
      return null;
    }
  };

  const handleImageUpload = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      async response => {
        if (response.didCancel) {
          // console.log('User cancelled image picker');
        } else if (response.errorCode) {
          // console.log('Image Picker Error:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          if (imageUri) {
            const base64String = await convertUriToBase64(imageUri);
            if (base64String) {
              try {
                const response = await disableAds(
                  userData.id,
                  'Disable Ads Request',
                  'User has uploaded shoutout proof and requests ad removal.',
                  // base64Image,
                  '',
                );

                showToast('info', response.message, 'bottom');
                setPendingApproval(true); // Set pending status
                setBase64Image(base64String);
                setShoutoutProof(imageUri);
                setAdsEnabled(false); // Keep ads disabled
              } catch (error) {
                showToast('error', 'Failed to submit request.', 'bottom');
                // console.error('Error requesting ad removal:', error);
              }
              // console.log(base64String, 'image'); // ✅ Log the base64 string before setting state
              // setAdsEnabled(true); // ✅ Enable ads only after image is uploaded
              // setShowUploadButton(false); // ✅ Hide the upload button
              // showToast(
              //   'success',
              //   'Shoutout proof uploaded! Ads have been disabled.',
              //   'bottom',
              // );
            } else {
              // console.error('Failed to convert image.');
            }
          }
        }
      },
    );
  };

  const handleAdsToggle = async () => {
    if (!userData) {
      showToast('error', 'User data not found.', 'bottom');
      return;
    }

    if (userData.ads === 'active') {
      setAdsEnabled(prevState => !prevState);
      showToast(
        'success',
        adsEnabled ? 'Ads enabled.' : 'Ads disabled.',
        'bottom',
      );
    } else if (userData.ads === 'deactive') {
      if (!shoutoutProof) {
        showToast(
          'warning',
          'Please upload proof of your shoutout to request ad removal.',
          'bottom',
        );
        return;
      }

      try {
        const response = await disableAds(
          userData.id,
          'Disable Ads Request',
          'User has uploaded shoutout proof and requests ad removal.',
          // base64Image,
          '',
        );

        showToast('info', response.message, 'bottom');
        setPendingApproval(true); // Set pending status
        setAdsEnabled(false); // Keep ads disabled
      } catch (error) {
        showToast('error', 'Failed to submit request.', 'bottom');
        // console.error('Error requesting ad removal:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>

        {/* Newsletter Toggle */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Newsletters</Text>
          <Switch
            value={newsletterEnabled}
            onValueChange={value => handleNewsletterToggle(value)}
            thumbColor={newsletterEnabled ? '#1097ff' : '#ccc'}
            trackColor={{false: '#ddd', true: '#BFDFFF'}}
          />
        </View>

        {/* Ads Toggle */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Hide Ads</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {pendingApproval && (
              <Text
                style={{
                  color: 'orange',
                  fontWeight: 'bold',
                }}>
                Pending
              </Text>
            )}
            <Switch
              value={adsEnabled}
              onValueChange={handleAdsToggle}
              thumbColor={adsEnabled ? '#1097ff' : '#ccc'}
              trackColor={{false: '#ddd', true: '#BFDFFF'}}
              style={{marginLeft: 10}}
            />
          </View>
        </View>

        {/* Shoutout Proof Upload Section */}
        {userData.ads === 'deactive' && (
          <View style={styles.uploadSection}>
            <Text style={styles.uploadMessage}>
              Please upload proof of your shoutout to disable ads:
            </Text>
            <Button title="Upload Image" onPress={handleImageUpload} />

            {/* Display Uploaded Image */}
            {/* Display Uploaded Image */}
            {base64Image && (
              <Image source={{uri: base64Image}} style={styles.uploadedImage} />
            )}
          </View>
        )}
      </View>
      <Toast
        visible={toastVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        position={toastConfig.position}
        onHide={() => setToastVisible(false)} // Callback on hide
      />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  container: {
    ...(Platform.OS === 'ios'
      ? {}
      : {
          marginTop: -30,
          backgroundColor: '#f4f4f4',
          // Drop shadow for iOS
          shadowColor: '#000', // Shadow color
          shadowOffset: {width: 0, height: 16}, // Increased offset for better visibility
          shadowOpacity: 1, // Increased opacity for a more defined shadow
          shadowRadius: 8, // Increased blur radius for a softer shadow
          // Drop shadow for Android
          elevation: 10, // Increased elevation for a stronger shadow
        }),
    flex: 1,
    // borderTopRightRadius: 30,
    // borderTopLeftRadius: 30,
    // marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  settingsSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  uploadSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  uploadMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },

  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
});
