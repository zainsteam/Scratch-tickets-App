import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Alert,
} from 'react-native';
import {forgotPassword} from '../providers/apiprovider'; // Import the forgot password function
import Toast from '../components/toast';

const ForgetScreen = ({navigation}: any) => {
  const [email, setEmail] = React.useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    message: '',
    type: 'success',
    position: 'top',
  });

  const showToast = (type: any, message: any, position: any) => {
    setToastConfig({type, message, position});
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // Auto-hide after 3 seconds
  };

  const handleResetPassword = async () => {
    if (!email) {
      showToast('error', 'Please enter your email.', 'top');
      // Alert.alert('Error', 'Please enter your email.');
      return;
    }

    const response = await forgotPassword(email);

    if (response.success) {
      // Alert.alert('Success', response.message);
      showToast('success', response.message, 'top');
      setTimeout(() => navigation.navigate('reset', {email}), 2000);
      // navigation.navigate('reset');
    } else {
      // Alert.alert('Error', response.message);
      showToast('error', 'Please enter the correct email.', 'top');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/pattern3.jpg')} // Replace with your texture image
      style={styles.background}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />

      {/* Heading */}
      <Text style={styles.heading1}>Forgot Your Password?</Text>
      <Text style={styles.subheading}>
        Enter your email, and we will send instructions to reset your password.
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

      {/* Reset Button */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity
        onPress={() => navigation.navigate('login')}
        style={styles.backToLogin}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>

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

export default ForgetScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  heading1: {
    fontSize: 34,
    color: '#fff',
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'left',
  },
  subheading: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '300',
    marginBottom: 40,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 30,
    color: '#fff',
  },
  button: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255,1)', // Transparent button
    padding: 15,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#090333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLogin: {
    marginTop: 20,
    alignSelf: 'center',
  },
  backToLoginText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
