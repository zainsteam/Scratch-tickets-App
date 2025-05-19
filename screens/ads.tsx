import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const AdsScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <Text>ads page</Text>
    </View>
  );
};

export default AdsScreen;

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
});
