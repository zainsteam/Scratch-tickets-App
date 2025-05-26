import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/home';
import TicketDetailsScreen from '../screens/ticketdetails';
import ProfileScreen from '../screens/profile';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import ForgetScreen from '../screens/forget';
import {Gesture, GestureHandlerRootView} from 'react-native-gesture-handler';
// import AdsSettingsScreen from '../screens/adssettings';
import SettingsScreen from '../screens/settings';
import EditProfileScreen from '../screens/editprofile';
import MapScreen from '../screens/map';
import Map2Screen from '../screens/map2';
import Popover from 'react-native-popover-view';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResetPasswordScreen from '../screens/resetpassword';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const CustomDrawerContent = (props: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState<any>({});

  // Check if the user is already logged in on app startup
  useEffect(() => {
    const getUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        // console.log(jsonValue, 'json');
        return jsonValue ? JSON.parse(jsonValue) : null;
      } catch (error) {
        // console.error('Error retrieving data:', error);
      }
    };
    getUserData().then(data => setFormValues(data));
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('visitedTickets');
      props.navigation.navigate('login');
    } catch (error) {
      // console.error('Error clearing storage:', error);
    } finally {
      setModalVisible(false); // Close modal after logout
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}>
      {/* Profile Section */}
      <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
        <View style={styles.profileContainer}>
          <Text style={styles.profileName}>{formValues.name}</Text>
          <Text style={styles.profileEmail}>{formValues.email}</Text>
        </View>
      </TouchableOpacity>

      {/* Drawer Items */}
      <ScrollView style={styles.drawerList}>
        {props.state.routes.map((route: any, index: any) => {
          const isFocused = props.state.index === index;
          return (
            route.name !== 'Details' && (
              <TouchableOpacity
                key={route.name}
                style={[
                  styles.drawerItem,
                  isFocused && styles.drawerItemActive,
                ]}
                onPress={() => props.navigation.navigate(route.name)}>
                <Icon
                  name={getIcon(route.name)}
                  size={22}
                  color={isFocused ? '#1097ff' : '#555'}
                />
                <Text
                  style={[
                    styles.drawerText,
                    isFocused && styles.drawerTextActive,
                  ]}>
                  {route.name}
                </Text>
              </TouchableOpacity>
            )
          );
        })}
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setModalVisible(true)}>
        <Icon name="logout" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}>
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
};

// Function to Assign Icons to Drawer Items
const getIcon = (screenName: string) => {
  switch (screenName) {
    case 'Home':
      return 'home';
    case 'Profile':
      return 'person';
    case 'Top 10 Tickets':
      return 'star';
    case 'Newest Tickets':
      return 'fiber-new';
    case 'Details':
      return 'info';
    case 'Settings':
      return 'settings';
    default:
      return 'help';
  }
};

// Custom Header Component
const CustomHeader = ({title}: any) => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const profileRef = useRef(null);

  const togglePopover = () => setIsVisible(!isVisible);

  const handleOptionSelect = (option: string) => {
    navigation.navigate('Profile' as never);
    setIsVisible(false); // Close the dropdown
    // if (option === 'Profile') {
    // } else if (option === 'Logout') {
    //   // Handle logout logic here
    //   console.log('Logging out...');
    //   navigation.navigate('login');
    // }
  };

  return (
    <ImageBackground
      source={require('../assets/images/pattern3.jpg')} // Replace with your background image
      style={styles.headerBackground}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <View style={styles.header}>
        {/* Hamburger Icon in Circle */}
        {navigation.canGoBack() && title != 'Home' && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.iconContainer}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
        {title == 'Home' && (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <View style={styles.iconContainer}>
              <Icon name="menu" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        )}

        {/* Title */}
        <View style={styles.centerContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        {/* Profile Icon in Circle */}
        {/* Profile Icon in Circle with Dropdown */}
        <TouchableOpacity
          ref={profileRef}
          onPress={() => handleOptionSelect('Profile')}>
          <View style={styles.iconContainer}>
            <Icon name="person" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// Home Stack with Custom Header
function HomeStack() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        header: ({route}) => <CustomHeader title={route.name} />,
        drawerStyle: {backgroundColor: '#fff', width: '80%'},
        headerShown: true,
        swipeEnabled: false, // Disable swipe gesture
        // gestureEnabled: false, // Disable gestures for opening drawer
      }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen
        name="Top 10 Tickets"
        component={MapScreen}
        initialParams={{type: 'Top 10'}}
      />
      <Drawer.Screen
        name="Newest Tickets"
        component={MapScreen}
        initialParams={{type: 'Newest'}}
      />
      <Drawer.Screen name="Details" component={TicketDetailsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  // Check if the user is already logged in on app startup
  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userToken');
        setInitialRoute(userData ? 'homestack' : 'login');
        // console.log(userData, '12oken');
      } catch (error) {
        // console.error('Error checking user data:', error);
        setInitialRoute('login');
      }
    };

    checkUserData();
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a0637" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            header: ({route}) => <CustomHeader title={route.name} />,
            headerShown: false, // Hides all headers in the Stack Navigator
          }}>
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="register" component={RegisterScreen} />
          <Stack.Screen name="reset" component={ResetPasswordScreen} />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{headerShown: true}}
          />
          <Stack.Screen name="forget" component={ForgetScreen} />
          <Stack.Screen name="homestack" component={HomeStack} />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
          />
          <Stack.Screen
            name="Details"
            component={TicketDetailsScreen}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="Top 10 Tickets"
            component={MapScreen}
            initialParams={{type: 'Top 10'}}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="Newest Tickets"
            component={MapScreen}
            initialParams={{type: 'Newest'}}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="Grand Prize Tickets"
            component={MapScreen}
            initialParams={{type: 'Grand Prize'}}
            options={{headerShown: true}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    // alignItems: 'left',
    paddingLeft: 30,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'rgba(16, 151, 255, 1)',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  drawerList: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(16, 151, 255, 0.1)',
  },
  drawerText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
  drawerTextActive: {
    color: '#1097ff',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1097ff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin: 20,
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  headerBackground: {
    width: '100%',
    // backgroundColor: '#fe6901',
    height: 150, // Adjust as needed for your design
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 60, // For safe area adjustment
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent fill
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)', // Optional border for better visuals
  },
  centerContainer: {
    // justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  popoverContent: {
    width: 120,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  popoverItem: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  popoverText: {
    paddingLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#d9534f',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
