import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MapComponent from '../components/map';
import FloatingIcon from '../components/colorscheme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapScreen from './map';
import Instructions from '../components/instruction';
// import MapButtons from '../components/card';
import CardButtons from '../components/card';

export default function HomeScreen({navigation}: any) {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CardButtons navigation={navigation} />

        <Instructions />
      </ScrollView>

      {/* <FloatingIcon iconName="info" />  */}
    </View>
  );
}

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
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
