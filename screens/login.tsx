import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from '../components/toast';
import {loginUser} from '../providers/apiprovider'; // Ensure you have this function imported
import {getMessaging, getToken} from '@react-native-firebase/messaging';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    message: '',
    type: 'success',
    position: 'top',
  });

  async function getFCMToken() {
    try {
      await getMessaging().registerDeviceForRemoteMessages();
      const token = await getMessaging().getToken();
      console.log('login FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  }

  const showToast = (type: any, message: any, position: any) => {
    setToastConfig({type, message, position});
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // Auto-hide after 3 seconds
  };

  const submitLogin = async () => {
    if (!email || !password) {
      showToast('error', 'Email and password are required', 'top');
      return;
    }
    const mobileToken = await getFCMToken(); // Replace with actual token if dynamic

    setLoading(true);
    try {
      const response = await loginUser(email, password, mobileToken);

      if (response) {
        showToast('success', 'Login Successful!', 'top');
        setTimeout(() => navigation.navigate('homestack'), 2000);
      }
    } catch (error: any) {
      showToast('error', error.message || 'Login Failed', 'top');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/pattern3.jpg')}
      style={styles.background}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Logo */}
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />

      {/* Heading */}
      <Text style={styles.heading2}>Scratch Ticket Genie</Text>

      {/* Additional Description */}
      <Text style={styles.description}>
        Your gateway to an exciting scratch ticket experience. Log in to get
        started!
      </Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        selectionColor="#fff"
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          selectionColor="#fff"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}>
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={submitLogin}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#090333" />
        ) : (
          <>
            <Text style={styles.buttonText}>Login</Text>
            <Icon
              name="arrow-forward"
              size={20}
              color="#090333"
              style={styles.icon}
            />
          </>
        )}
      </TouchableOpacity>

      {/* Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('forget')}>
          <Text style={styles.linkText1}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('register')}>
          <Text style={styles.linkText2}>Register Yourself</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Component */}
      <Toast
        visible={toastVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        position={toastConfig.position}
        onHide={() => setToastVisible(false)}
      />
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {flex: 1, justifyContent: 'center', paddingHorizontal: 30},
  logo: {width: 150, height: 150, marginBottom: 20, alignSelf: 'center'},
  heading2: {
    fontSize: 34,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'left',
    lineHeight: 22,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 20,
    color: '#fff',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 20,
  },
  passwordInput: {flex: 1, fontSize: 16, paddingVertical: 8, color: '#fff'},
  iconContainer: {padding: 5},
  button: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255,1)',
    padding: 15,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {color: '#090333', fontSize: 16, fontWeight: 'bold'},
  icon: {marginLeft: 10},
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    // position: 'absolute',
    // bottom: 40,
    // left: 30,
  },
  linkText1: {
    color: '#fff',
    fontSize: 14,
    borderBottomWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    padding: 15,
  },
  linkText2: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    padding: 15,
  },
});
