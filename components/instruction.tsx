import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Or use another icon library
import Icon2 from 'react-native-vector-icons/Ionicons'; // Or use another icon library

const HowItWorks = () => {
  const steps = [
    {
      icon: <Icon name="map" size={40} color="#1097ff" />,
      title: 'State Selection',
      description: 'Choose your state from the map or drop-down menu.',
    },
    {
      icon: <Icon2 name="ticket" size={40} color="#1097ff" />,
      title: 'Ticket Name',
      description:
        'Direct links to state-specific scratch tickets or state lottery site.',
    },
    {
      icon: <Icon name="stars" size={40} color="#1097ff" />,
      title: 'Initial Winning Return on Investment',
      description: 'Algorithmically calculated at ticket release.',
    },
    {
      icon: <Icon name="stars" size={40} color="#1097ff" />,
      title: 'Current Winning Return on Investment',
      description: 'Regularly updated to reflect ongoing performance.',
    },
    {
      icon: <Icon name="autorenew" size={40} color="#1097ff" />,
      title: 'Return on Investment Change',
      description:
        'Monitor fluctuations in winning Return on Investment over time.',
    },
    {
      icon: <Icon name="money" size={40} color="#1097ff" />,
      title: 'Ticket Cost',
      description: 'Clearly displayed purchase price for each featured ticket.',
    },
  ];

  return (
    <>
      <Text style={styles.heading}>How It Works:</Text>
      <View style={styles.container}>
        <View style={styles.list}>
          {steps.map((step, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.iconContainer}>{step.icon}</View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{step.title}</Text>
                <Text style={styles.description}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    elevation: 1, // For Android shadow
    shadowColor: '#000', // For iOS shadowsudo
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 15,
  },
  list: {
    flexDirection: 'column',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    // elevation: 2, // For shadow on Android
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default HowItWorks;
