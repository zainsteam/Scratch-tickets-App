import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CardButtons = ({navigation}: any) => {
  return (
    <>
      <Text style={styles.heading}>Explore Tickets:</Text>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.push('Top 10 Tickets', {type: 'Top 10'})}>
          <Icon name="star" size={40} color="#1097ff" style={styles.icon} />
          <Text style={styles.cardText}>Top 10 </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.push('Newest Tickets', {type: 'Newest'})}>
          <Icon name="ticket" size={40} color="#1097ff" style={styles.icon} />
          <Text style={styles.cardText}>Newest </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container1}>
        <TouchableOpacity
          style={styles.card1}
          onPress={() =>
            navigation.push('Grand Prize Tickets', {type: 'Grand Prize'})
          }>
          <Icon name="trophy" size={40} color="#1097ff" style={styles.icon} />
          <Text style={styles.cardText}>Grand Prize </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
  },
  container1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 4, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  card1: {
    width: '98%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 4, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
  },
});

export default CardButtons;
