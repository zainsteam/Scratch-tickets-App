import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const TicketCard = ({ticket}: any) => {
  return (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => Alert.alert(`More info: ${ticket.infoUrl}`)}>
      {/* Image on the left */}
      <Image source={ticket.image} style={styles.ticketImage} />

      {/* Details on the right */}
      <View style={styles.detailsContainer}>
        {/* Header with title and cost */}
        <View style={styles.titleContainer}>
          <Text style={styles.ticketName}>{ticket.name}</Text>
          <Text style={styles.ticketCost}>{ticket.cost}</Text>
        </View>

        {/* Row for headings */}
        <View style={styles.rowHeadings}>
          <Text style={styles.heading}>Launch Date</Text>
          <Text style={styles.heading}>Return on Investment</Text>
          <Text style={styles.heading}>Ranking</Text>
        </View>

        {/* Row for values */}
        <View style={styles.rowValues}>
          <Text style={styles.value}>{ticket.launchDate}</Text>
          <Text style={styles.value}>{ticket.probability}</Text>
          <Text style={styles.value}>{ticket.ranking}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: {width: 0, height: 16},
    shadowRadius: 18,
    elevation: 2,
  },
  ticketImage: {
    width: 100,
    height: 120,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  ticketCost: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1097ff',
  },
  rowHeadings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  heading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#666',
    width: '30%',
    textAlign: 'center',
  },
  rowValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 14,
    color: '#333',
    width: '30%',
    textAlign: 'center',
  },
});

export default TicketCard;
