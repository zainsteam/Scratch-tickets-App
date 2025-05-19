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
import {resetPassword} from '../providers/apiprovider';
import Toast from '../components/toast';

const ResetPasswordScreen = ({route, navigation}: any) => {
  const [email, setEmail] = useState(route.params?.email || '');
  const [token, setToken] = useState(route.params?.token || 0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    // console.log(token, typeof token);
    if (!email) {
      showToast('error', 'Please enter your email.', 'top');
      // Alert.alert('Error', 'Please enter your email.');
      return;
    }

    if (!token) {
      showToast('error', 'Please enter the OTP.', 'top');
      // Alert.alert('Error', 'Please enter the reset otp.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      showToast('error', 'Please enter both password fields.', 'top');
      // Alert.alert('Error', 'Please enter both password fields.');
      return;
    }

    if (newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters long.', 'top');
      // Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('error', 'Passwords do not match.', 'top');
      // Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const response = await resetPassword(
      email,
      token,
      newPassword,
      // confirmPassword,
    );

    if (response.success) {
      showToast('success', response.message, 'top');
      // Alert.alert('Success', response.message);
      navigation.navigate('login');
    } else {
      showToast('error', response.message, 'top');
      // Alert.alert('Error', response.message);
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

      {/* Heading */}
      <Text style={styles.heading1}>Reset Your Password</Text>
      <Text style={styles.subheading}>
        Enter your email, the reset token, and set a new password.
      </Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#fff"
        value={email}
        selectionColor="#fff"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Token Input */}
      <TextInput
        style={styles.input}
        placeholder="OTP"
        placeholderTextColor="#fff"
        value={token}
        onChangeText={setToken}
        selectionColor="#fff"
        autoCapitalize="none"
      />

      {/* New Password Input */}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#fff"
        secureTextEntry
        value={newPassword}
        selectionColor="#fff"
        onChangeText={setNewPassword}
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#fff"
        secureTextEntry
        value={confirmPassword}
        selectionColor="#fff"
        onChangeText={setConfirmPassword}
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

export default ResetPasswordScreen;

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
    marginBottom: 20,
    color: '#fff',
  },
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
