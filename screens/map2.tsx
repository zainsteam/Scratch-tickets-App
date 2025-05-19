import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import Map2Component from '../components/map2';
import FloatingIcon from '../components/colorscheme';
import MapComponent from '../components/map';

export default function Map2Screen({route, navigation}: any) {
  const {type} = route.params;
  const [selectedState, setSelectedState] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <MapComponent
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
