import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import Map2Component from '../components/map2';
import FloatingIcon from '../components/colorscheme';
import MapComponent from '../components/map';

export default function MapScreen({route, navigation}: any) {
  const {type} = route.params;
  console.log(type, 'type ');
  const [selectedState, setSelectedState] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Map2Component
          // selectedState={selectedState}
          // setSelectedState={setSelectedState}
          type={type}
          navigation={navigation}
        />
      </ScrollView>
      {/* {type === 'Newest' ? <></> : <FloatingIcon iconName="info" />} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(Platform.OS === 'ios'
      ? {}
      : {
          // marginTop: -30,
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

    paddingTop: 0,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
