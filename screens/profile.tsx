import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HistoryScreen from '../components/history';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateProfile} from '../providers/apiprovider';
import Toast from '../components/toast';
import AnnouncementList from '../components/history';

type ProfileField = 'name'; // Define allowed keys

const ProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editField, setEditField] = useState<ProfileField>('name');
  const [formValues, setFormValues] = useState<any>({});
  const [toastVisible, setToastVisible] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    message: '',
    type: 'success',
    position: 'bottom',
  });

  const showToast = (type: any, message: any, position: any) => {
    setToastConfig({type, message, position});
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // Auto-hide after 3 seconds
  };

  const handleUpdateProfile = async () => {
    const userData = {
      name: formValues.name,
      email: formValues.email,
      customer_id: formValues.id,
      subscribe: formValues.subscribe,
    };

    try {
      const response = await updateProfile(userData);
      // const jsonValue = await AsyncStorage.setItem('userData', response);
      showToast('success', response.message, 'bottom');
      // console.log('Profile updated successfully:', response.message);
    } catch (error: any) {
      showToast('success', error.message, 'bottom');
      // console.error('Profile update failed:', error);
    }
  };

  const openEditModal = (field: any) => {
    setEditField(field);
    setModalVisible(true);
  };

  const saveChanges = () => {
    setModalVisible(false);
    handleUpdateProfile();
  };

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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        {/* <View style={styles.header}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editProfilePicture}
            onPress={() =>
              navigation.navigate('EditProfileScreen', {field: 'photo'})
            }>
            <Icon name="edit" size={18} color="#fff" />
          </TouchableOpacity>
        </View> */}

        {/* Profile Details */}
        <View style={styles.profileDetails}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          <View style={styles.detailRow}>
            <View>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{formValues.name}</Text>
            </View>
            <TouchableOpacity onPress={() => openEditModal('name')}>
              <Icon name="edit" size={20} color="#1097ff" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <View>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{formValues.email}</Text>
            </View>
            {/* <TouchableOpacity onPress={() => openEditModal('email')}>
              <Icon name="edit" size={20} color="#1097ff" />
            </TouchableOpacity> */}
          </View>

          {/* <View style={styles.detailRow}>
            <View>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>{formValues.phone}</Text>
            </View>
            <TouchableOpacity onPress={() => openEditModal('phone')}>
              <Icon name="edit" size={20} color="#1097ff" />
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Settings Section */}
        {/* <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Receive Newsletters</Text>
            <Switch
              value={newsletterEnabled}
              onValueChange={value => setNewsletterEnabled(value)}
              thumbColor={newsletterEnabled ? '#1097ff' : '#ccc'}
              trackColor={{false: '#ddd', true: '#BFDFFF'}}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Show Ads</Text>
            <Switch
              value={adsEnabled}
              onValueChange={value => setAdsEnabled(value)}
              thumbColor={adsEnabled ? '#1097ff' : '#ccc'}
              trackColor={{false: '#ddd', true: '#BFDFFF'}}
            />
          </View>
        </View> */}

        <AnnouncementList />

        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          statusBarTranslucent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit {editField}</Text>
              <TextInput
                style={styles.input}
                value={formValues[editField]}
                onChangeText={text =>
                  setFormValues({...formValues, [editField]: text})
                }
                placeholder={`Enter your ${editField}`}
              />
              <View style={styles.modalButtons}>
                {/* <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color="#6c757d"
                /> */}
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <View style={styles.iconContainer2}>
                    <Icon name="cancel" size={24} color="white" />
                    <Text style={styles.buttonText}>Cancel</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveChanges}>
                  <View style={styles.iconContainer}>
                    <Icon name="check-circle" size={24} color="white" />
                    <Text style={styles.buttonText}>Save</Text>
                  </View>
                </TouchableOpacity>
                {/* <Button title="Save" onPress={saveChanges} color="#1097ff" /> */}
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {/* Toast Component */}
      <Toast
        visible={toastVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        position={toastConfig.position}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    zIndex: 1000,
    backgroundColor: '#f4f4f4',
    // Drop shadow for iOS
    shadowColor: '#000', // Shadow color
    shadowOffset: {width: 0, height: 16}, // Increased offset for better visibility
    shadowOpacity: 1, // Increased opacity for a more defined shadow
    shadowRadius: 8, // Increased blur radius for a softer shadow
    // Drop shadow for Android
    elevation: 10, // Increased elevation for a stronger shadow
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  editProfilePicture: {
    position: 'absolute',
    bottom: 10,
    right: '40%',
    backgroundColor: '#007BFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  ticketsSection: {
    marginTop: 20,
  },
  ticketList: {
    marginTop: 10,
  },
  ticketCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  ticketDate: {
    fontSize: 14,
    color: '#888',
  },
  ticketPrize: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28A745',
  },
  noPrize: {
    color: '#DC3545',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 30,
    width: '100%',
    // height: '30%',
    alignItems: 'center',
    shadowColor: '#000', // Shadow color
    shadowOffset: {width: 10, height: 16}, // Increased offset for better visibility
    shadowOpacity: 0.5, // Increased opacity for a more defined shadow
    shadowRadius: 8, // Increased blur radius for a softer shadow
    // Drop shadow for Android
    elevation: 10, // Increased elevation for a stronger shadow
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 25,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    marginBottom: 25,
    flexDirection: 'row',
    borderRadius: 50,
    justifyContent: 'space-between',
    width: '100%',
  },
  iconContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#1097ff', // Semi-transparent fill
    alignItems: 'center',
  },
  iconContainer2: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: 'darkred', // Semi-transparent fill
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
