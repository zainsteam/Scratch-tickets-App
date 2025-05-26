import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import TicketCard from './ticket';
import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = ({navigation}: any) => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [storedTickets, setstoredTickets] = useState<storedTickets1[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTicketPress = (ticket: any) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  type storedTickets1 = {
    id: string;
    name: string;
    image: string;
    created_at: string;
    cost: number;
    ranking: string;
    current_winning_probability: string;
    initial_winning_probability: string;
    url: string;
    type: string;
  };
  const openTicketWebsite = () => {
    if (selectedTicket) {
      // console.log(selectedTicket['url'], 'asd');
      Linking.openURL(selectedTicket['url']);
    }
    setModalVisible(false);
  };

  const getVisitedTickets = async () => {
    try {
      const storedTickets = await AsyncStorage.getItem('visitedTickets');
      setstoredTickets(storedTickets ? JSON.parse(storedTickets) : []);
      console.log(storedTickets, 'store');
      return storedTickets ? JSON.parse(storedTickets) : [];
    } catch (error) {
      // console.error('Error retrieving visited tickets:', error);
      return [];
    }
  };

  useEffect(() => {
    // fetchProfile();
    getVisitedTickets();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getVisitedTickets();
    }, []),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const TicketCard = ({ticket}: any) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => Alert.alert(`More info: ${ticket.infoUrl}`)}>
      <View style={styles.listCardContainer}>
        {/* Left Side: Image with Overlay */}
        <ImageBackground
          source={
            ticket.image
              ? {
                  uri: `https://admin.scratchticketgenie.us/${ticket.image}`,
                }
              : require('../assets/images/logo4.png')
          }
          style={styles.ticketImage}>
          {/* Overlay for Price and Ranking */}
          {/* <View style={styles.imageOverlay}>
            <Text style={styles.overlayRanking}>{ticket.ranking}</Text>
            <Text style={styles.overlayPrice}>{ticket.cost}</Text>
          </View> */}
        </ImageBackground>

        {/* Right Side: Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.firstRow}>
            <Text style={styles.date}>{ticket.launchDate}</Text>
            <Text style={styles.overlayPrice}>{ticket.cost}</Text>
          </View>
          {/* Title */}
          <Text style={styles.ticketName} numberOfLines={2}>
            {ticket.name}
          </Text>

          {/* Launch Date */}
          {(ticket.type == 'Newest' || ticket.type == 'Grand Prize') && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Ranking:</Text>
              <Text style={styles.overlayRanking}>{ticket.ranking}</Text>
            </View>
          )}

          {/* Return on Investment */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Initial (ROI):</Text>
            <Text style={styles.value}>
              {ticket.initial_winning_probability}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Current (ROI):</Text>
            <Text style={styles.value}>
              {ticket.current_winning_probability}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return storedTickets ? (
    <>
      <Text style={styles.sectionTitle}>Recently Viewed</Text>
      <FlatList
        data={storedTickets}
        keyExtractor={item => item.id}
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
                      {' '}
                      {formatDate(item.created_at)}
                    </Text>
                    <Text style={styles.overlayPrice}>$ {item.cost}</Text>
                  </View>
                  <Text style={styles.ticketName} numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>
                <View style={styles.bottomRow}>
                  {(item.type == 'Newest' || item.type == 'Grand Prize') && (
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Ranking:</Text>
                      <Text style={styles.overlayRanking}>{item.ranking}</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Initial (ROI):</Text>
                    <Text style={styles.value}>
                      {item.initial_winning_probability}%
                    </Text>
                  </View>
                  {item.type == 'Top 10' && (
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

      {/* Confirmation Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Visit Ticket Website?</Text>
            <Text style={styles.modalText}>Do you want to visit website?</Text>
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
    </>
  ) : (
    <></>
  );
};
export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ticketImage: {
    width: 100,
    height: 150,
    // borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {},
  // header: {
  //   fontSize: 20,
  //   fontWeight: '700',
  //   marginBottom: 20,
  //   color: '#333',
  // },
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
