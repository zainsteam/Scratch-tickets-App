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
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {registerUser} from '../providers/apiprovider'; // Import the register function
import Toast from '../components/toast';

const RegisterScreen = ({navigation}: any) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
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

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match', 'top');
      // Alert.alert('Passwords do not match');
      return;
    }
    try {
      const response = await registerUser(name, email, password);
      // Alert.alert('Registration successful');
      showToast('success', 'Registration successful', 'top');

      navigation.navigate('login');
    } catch (errors: any) {
      // console.log(errors, 'dda');
      showToast('error', errors.message, 'top');
      // Alert.alert(errors.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/pattern3.jpg')}
      style={styles.background}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />

        <Text style={styles.heading1}>Create Account</Text>
        <Text style={styles.description}>
          Join Scratch Ticket Genie and unlock a world of exciting
          opportunities.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#fff"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          selectionColor="#fff"
        />

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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
          <Icon
            name="arrow-forward"
            size={20}
            color="#090333"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
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

export default RegisterScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  heading1: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
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
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: '#fff',
  },
  iconContainer: {
    padding: 5,
  },
  button: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
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
  icon: {
    marginLeft: 10,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
