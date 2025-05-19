import React from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import {updateProfile} from '../providers/apiprovider';

const handleUpdateProfile = async () => {
  const userData = {
    name: 'Zain123',
    email: 'zain3333@gmail.com',
    customer_id: '2',
    subscribe: 'deactive',
  };
  // console.log(userData, 'user');

  try {
    const response = await updateProfile(userData);
    // console.log('Profile updated successfully:', response);
  } catch (error) {
    // console.error('Profile update failed:', error);
  }
};

const EditProfileScreen = ({route, navigation}: any) => {
  const {field} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Edit {field.charAt(0).toUpperCase() + field.slice(1)}
      </Text>
      <TextInput style={styles.input} placeholder={`Enter your ${field}`} />
      <Button title="Save" onPress={() => handleUpdateProfile()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '##f4f4f4',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default EditProfileScreen;
