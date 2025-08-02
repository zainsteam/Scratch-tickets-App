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
  ActivityIndicator,
} from 'react-native';
import TicketCard from './ticket';
import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = ({navigation}: any) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);

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
    launch_date: string;
    top_grand_prize: number;
    initial_grand_prize: string;
    current_grand_prize: string;
    grand_prizes_left: string;
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
      {storedTickets?.length > 0 ? (
        <FlatList
          data={storedTickets}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => handleTicketPress(item)}
              style={styles.cardContainer}>
              <View style={styles.listCardContainer}>
                {item.type === 'Newest' && (
                  <View style={styles.imageWrapper}>
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

                    {/* {(type === 'Newest' || type === 'Grand Prize') && (
                            <View style={styles.badgeContainer}>
                              <Text style={styles.badgeText}>#{item.ranking}</Text>
                            </View>
                          )} */}
                  </View>
                )}

                <View style={styles.detailsContainer}>
                  {/* Title & Price in one row */}
                  <View style={styles.titlePriceRow}>
                    <Text style={styles.ticketName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.price}>
                      {item.cost ? (
                        <Text style={styles.roiValue}>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 2,
                          }).format(item.cost)}
                        </Text>
                      ) : null}
                    </Text>
                  </View>

                  {/* Only show date if not "Top 10" */}
                  {/* {type !== 'Top 10' && (
                          <Text style={styles.date}>
                            {formatDate(item.created_at)}
                          </Text>
                        )} */}

                  {/* ROI values */}

                  {item.type === 'Newest' && (
                    <View style={styles.roiGrid}>
                      <View
                        style={[styles.roiColumn, {alignItems: 'flex-start'}]}>
                        <Text style={styles.roiLabel}>Initial ROI</Text>
                        {item.initial_winning_probability ? (
                          <Text style={styles.roiValue}>
                            {parseFloat(
                              item.initial_winning_probability,
                            ).toFixed(2)}
                            %
                          </Text>
                        ) : null}
                      </View>

                      <View style={[styles.roiColumn, {alignItems: 'center'}]}>
                        <Text style={styles.roiLabel}>Launch Date</Text>
                        {item.launch_date ? (
                          <Text style={styles.roiValue}>
                            {formatDate(item.launch_date)}
                          </Text>
                        ) : null}
                      </View>
                      <View
                        style={[styles.roiColumn, {alignItems: 'flex-end'}]}>
                        <Text style={styles.roiLabel}>Ranking</Text>
                        {item.ranking ? (
                          <Text style={styles.roiValue}>{item.ranking}</Text>
                        ) : null}
                      </View>
                    </View>
                  )}

                  {item.type === 'Grand Prize' && (
                    <View style={styles.roiGrid}>
                      <View
                        style={[styles.roiColumn, {alignItems: 'flex-start'}]}>
                        <Text style={styles.roiLabel}>Grand Prize</Text>
                        {item.top_grand_prize ? (
                          <Text style={styles.roiValue}>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 2,
                            }).format(item.top_grand_prize)}
                          </Text>
                        ) : null}
                      </View>
                      <View style={[styles.roiColumn, {alignItems: 'center'}]}>
                        <Text style={styles.roiLabel}>Initial</Text>
                        {item.initial_grand_prize ? (
                          <Text style={styles.roiValue}>
                            {/* {item.initial_grand_prize} */}
                            {parseFloat(item.initial_grand_prize).toFixed(0)}
                          </Text>
                        ) : null}
                      </View>
                      <View style={[styles.roiColumn, {alignItems: 'center'}]}>
                        <Text style={styles.roiLabel}>Current</Text>
                        {item.current_grand_prize ? (
                          <Text style={styles.roiValue}>
                            {/* {item.current_grand_prize} */}
                            {parseFloat(item.current_grand_prize).toFixed(0)}
                          </Text>
                        ) : null}
                      </View>
                      <View
                        style={[styles.roiColumn, {alignItems: 'flex-end'}]}>
                        <Text style={styles.roiLabel}>Remaining</Text>
                        {item.initial_grand_prize ? (
                          <Text style={styles.roiValue}>
                            {item.grand_prizes_left}%
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  )}

                  {item.type === 'Top 10' && (
                    <View style={styles.roiGrid}>
                      <View
                        style={[styles.roiColumn, {alignItems: 'flex-start'}]}>
                        <Text style={styles.roiLabel}>Initial ROI</Text>
                        {item.initial_winning_probability ? (
                          <Text style={styles.roiValue}>
                            {parseFloat(
                              item.initial_winning_probability,
                            ).toFixed(2)}
                            %
                          </Text>
                        ) : null}
                      </View>
                      <View style={[styles.roiColumn, {alignItems: 'center'}]}>
                        <Text style={styles.roiLabel}>Current ROI</Text>
                        {item.current_winning_probability ? (
                          <Text style={styles.roiValue}>
                            {parseFloat(
                              item.current_winning_probability,
                            ).toFixed(2)}
                            %
                          </Text>
                        ) : null}
                      </View>
                      <View
                        style={[styles.roiColumn, {alignItems: 'flex-end'}]}>
                        <Text style={styles.roiLabel}>Diff ROI</Text>
                        {item.current_winning_probability &&
                        item.initial_winning_probability ? (
                          <Text
                            style={[
                              styles.roiValue,
                              parseFloat(item.current_winning_probability) -
                                parseFloat(item.initial_winning_probability) <
                              0
                                ? {color: 'red'}
                                : {color: 'green'},
                            ]}>
                            {(
                              parseFloat(item.current_winning_probability) -
                              parseFloat(item.initial_winning_probability)
                            ).toFixed(2)}
                            %
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noTicketsText}>No tickets available</Text>
      )}

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
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4, // Less space between title and ROI
  },
  cost: {},

  ticketName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    paddingRight: 6,
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff7a00',
  },

  // Already exists, no change needed unless spacing feels tight
  date: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 6, // Optional tweak
  },

  imageWrapper: {
    position: 'relative',
  },

  badgeContainer: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 1,
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  datePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 6,
    // marginBottom: 10,
  },

  // price: {
  //   fontSize: 14,
  //   fontWeight: 'bold',
  //   color: '#ff7a00',
  // },

  roiHeading: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 4,
    color: '#444',
  },

  roiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  roiColumn: {
    flex: 1,
    // alignItems: 'center',
  },

  roiLabel: {
    fontSize: 13,
    color: '#777',
    marginBottom: 2,
  },

  roiValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  rankingRow: {
    flexDirection: 'row',
    marginTop: 8,
  },

  // ticketName: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   marginTop: 6,
  // },

  screenContainer: {
    flex: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 15,
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
  bottomRow: {paddingTop: 10},
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
    height: 100,
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
    // justifyContent: 'space-between',
    paddingVertical: 15,
    paddingLeft: 15,
  },
  // ticketName: {
  //   fontSize: 16,
  //   fontWeight: '700',
  //   color: '#333',
  // },
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
    fontWeight: '900',
    color: '#666',
  },
  // date: {
  //   fontSize: 14,
  //   fontWeight: '700',
  //   color: '#666',
  // },
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
  container: {
    padding: 0,
    backgroundColor: '#f4f4f4',
  },
  // header: {
  //   fontSize: 20,
  //   fontWeight: '700',
  //   marginBottom: 20,
  //   color: '#333',
  //   textAlign: 'left',
  // },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // ticketImage: {
  //   width: 100,
  //   height: 150,
  //   // borderRadius: 10,
  //   overflow: 'hidden',
  //   marginRight: 10,
  // },
  // firstRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // noTicketsText: {
  //   textAlign: 'center',
  //   marginTop: 20,
  //   fontSize: 16,
  //   color: '#666',
  // },
  // bottomRow: {},
  // header: {
  //   fontSize: 20,
  //   fontWeight: '700',
  //   marginBottom: 20,
  //   color: '#333',
  // },
  // cardContainer: {
  //   backgroundColor: '#fff',
  //   borderRadius: 15,
  //   marginBottom: 15,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.2,
  //   shadowOffset: {width: 0, height: 2},
  //   shadowRadius: 8,
  //   elevation: 5,
  // },
  // listCardContainer: {
  //   flexDirection: 'row',
  //   paddingRight: 10,
  // },

  // overlayRanking: {
  //   color: '#1097ff',
  //   fontWeight: '700',
  //   fontSize: 16,
  // },
  // overlayPrice: {
  //   color: '#ff7f00',
  //   fontWeight: '700',
  //   fontSize: 16,
  // },
  // detailsContainer: {
  //   flex: 1,
  //   justifyContent: 'space-between',
  //   paddingVertical: 10,
  // },
  // ticketName: {
  //   fontSize: 16,
  //   fontWeight: '700',
  //   color: '#333',
  // },
  // detailRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  // loader: {
  //   marginTop: 50,
  // },
  // label: {
  //   fontSize: 14,
  //   color: '#666',
  //   fontWeight: '600',
  // },
  // value: {
  //   fontSize: 16,
  //   fontWeight: '700',
  //   color: '#666',
  // },
  // date: {
  //   fontSize: 14,
  //   fontWeight: '700',
  //   color: '#666',
  // },
  // modalOverlay: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0,0,0,0.5)',
  // },
  // modalContainer: {
  //   width: 300,
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   padding: 20,
  //   alignItems: 'center',
  // },
  // modalTitle: {
  //   fontSize: 18,
  //   fontWeight: '700',
  //   marginBottom: 10,
  //   color: '#333',
  // },
  // modalText: {
  //   fontSize: 16,
  //   textAlign: 'center',
  //   color: '#555',
  //   marginBottom: 20,
  // },
  // buttonRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   width: '100%',
  // },
  // cancelButton: {
  //   flex: 1,
  //   backgroundColor: '#ddd',
  //   padding: 10,
  //   borderRadius: 5,
  //   marginRight: 10,
  //   alignItems: 'center',
  // },
  // cancelText: {
  //   fontSize: 16,
  //   fontWeight: '700',
  //   color: '#333',
  // },
  // visitButton: {
  //   flex: 1,
  //   backgroundColor: '#1097ff',
  //   padding: 10,
  //   borderRadius: 5,
  //   alignItems: 'center',
  // },
  // visitText: {
  //   fontSize: 16,
  //   fontWeight: '700',
  //   color: '#fff',
  // },
});
