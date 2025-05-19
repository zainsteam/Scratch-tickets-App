import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

const data = [
  {label: 'Hottest Top 10 Scratchers in the Country.', color: 'red'},
  {label: 'Above average Top 10 Scratchers in the Country.', color: 'orange'},
  {label: 'Average Top 10 Scratchers in the Country.', color: 'yellow'},
  {label: 'Below average Top 10 Scratchers in the Country.', color: 'aqua'},
  {label: 'Coldest Top 10 Scratchers in the Country.', color: 'blue'},
  {
    label: 'The state currently does not have Scratchers for sale. ',
    color: 'lavender',
  },
  {
    label:
      'Please email scratchticketgenie@gmail.com once Scratch Tickets become available in the lavender colored States.',
    color: '',
  },
];

const ScratchersLegend = () => {
  const renderItem = ({item}: {item: {label: string; color: string}}) => (
    <View style={styles.itemContainer}>
      <View style={[styles.colorIndicator, {backgroundColor: item.color}]} />
      <Text style={styles.text}>{item.label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
      {/* <Text>
        Please email scratchticketgenie@gmail.com once Scratch Tickets become
        available in the lavender colored States.
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    flexShrink: 1,
  },
});

export default ScratchersLegend;
