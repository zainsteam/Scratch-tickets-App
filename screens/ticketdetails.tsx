import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {fetchTopTickets} from '../providers/apiprovider';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import 'intl';
// import 'intl/locale-data/jsonp/en';

const TicketDetailsScreen = ({route}: any) => {
  const {select, type} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  // Update useState with correct type
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [visitedTickets, setVisitedTickets] = useState<Ticket[]>([]);

  const saveVisitedTicket = async (ticket: any) => {
    try {
      const storedTickets = await AsyncStorage.getItem('visitedTickets');
      let visitedTickets = storedTickets ? JSON.parse(storedTickets) : [];

      // Add `type` to the ticket before saving
      const ticketWithType = {...ticket, type};

      // Avoid duplicates and add the updated ticket to top
      visitedTickets = visitedTickets.filter((t: any) => t.id !== ticket.id);
      visitedTickets.unshift(ticketWithType);

      // Limit to latest 10
      if (visitedTickets.length > 10) {
        visitedTickets = visitedTickets.slice(0, 10);
      }

      await AsyncStorage.setItem(
        'visitedTickets',
        JSON.stringify(visitedTickets),
      );
      setVisitedTickets(visitedTickets);
      console.log(visitedTickets, 'saved');
      console.log(ticketWithType, 'with type saved');
    } catch (error) {
      console.error('Error saving visited ticket:', error);
    }
  };

  // Load tickets when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setTickets([]); // Clear previous tickets
      setLoading(true);

      const loadTickets = async () => {
        try {
          const fetchedTickets = await fetchTopTickets(select, type);
          let data = fetchedTickets.tickets;
          // console.log(data, 'adada');
          setTickets(data);
        } catch (error) {
          // console.error('Error fetching tickets:', error);
        } finally {
          setLoading(false);
        }
      };

      loadTickets();
    }, [select]), // Re-fetch when `select` changes
  );

  type Ticket = {
    id: number;
    name: string;
    image: string;
    created_at: string;
    cost: number;
    ranking: string;
    current_winning_probability: string;
    initial_winning_probability: string;
    url: string;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleTicketPress = (ticket: any) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const openTicketWebsite = async () => {
    if (selectedTicket) {
      await saveVisitedTicket(selectedTicket);
      console.log(selectedTicket, 'save value');
      Linking.openURL(selectedTicket['url']);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>
        {type} Tickets of {select}
      </Text>

      {/* Show Loader When Fetching Data */}
      {loading ? (
        <ActivityIndicator size="large" color="#1097ff" style={styles.loader} />
      ) : tickets?.length > 0 ? (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => handleTicketPress(item)}
              style={styles.cardContainer}>
              <View style={styles.listCardContainer}>
                <Image
                  source={
                    item.image
                      ? {
                          uri: `https://admin.scratchticketgenie.us/${item.image}`,
                        }
                      : require('../assets/images/logo4.png')
                  }
                  style={styles.ticketImage}
                />
                <View style={styles.detailsContainer}>
                  <View>
                    <View style={styles.firstRow}>
                      <Text style={styles.date}>
                        {formatDate(item.created_at)}
                      </Text>
                      <Text style={styles.overlayPrice}>$ {item.cost}</Text>
                    </View>
                    <Text style={styles.ticketName} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={styles.bottomRow}>
                    {(type == 'Newest' || type == 'Grand Prize') && (
                      <View style={styles.detailRow}>
                        <Text style={styles.label}>Ranking:</Text>
                        <Text style={styles.overlayRanking}>
                          {item.ranking}
                        </Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Initial (ROI):</Text>
                      <Text style={styles.value}>
                        {item.initial_winning_probability}%
                      </Text>
                    </View>
                    {type == 'Top 10' && (
                      <>
                        <View style={styles.detailRow}>
                          <Text style={styles.label}>Current (ROI):</Text>
                          <Text style={styles.value}>
                            {item.current_winning_probability}%
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.label}>Difference (ROI):</Text>
                          <Text style={styles.value}>
                            {(
                              parseFloat(item.current_winning_probability) -
                              parseFloat(item.initial_winning_probability)
                            ).toFixed(2)}
                            %
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noTicketsText}>No tickets available</Text>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        statusBarTranslucent
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Visit Ticket Website?</Text>
            <Text style={styles.modalText}>
              Do you want to visit {selectedTicket?.name}'s website?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.visitButton}
                onPress={openTicketWebsite}>
                <Text style={styles.visitText}>Yes, Visit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    zIndex: 1000,
    backgroundColor: '#f4f4f4',
  },
  loader: {
    marginTop: 50,
  },
  noTicketsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  bottomRow: {},
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
  },
  listCardContainer: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  ticketImage: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    width: 100,
    height: 140,
    marginRight: 10,
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlayRanking: {
    color: '#1097ff',
    fontWeight: '700',
    fontSize: 16,
  },
  overlayPrice: {
    color: '#ff7f00',
    fontWeight: '700',
    fontSize: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  date: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  visitButton: {
    flex: 1,
    backgroundColor: '#1097ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  visitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default TicketDetailsScreen;
