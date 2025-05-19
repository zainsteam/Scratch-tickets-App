import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, Modal, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ScratchersLegend from './colordetails';

interface FloatingIconProps {
  iconName: string;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({iconName}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  console.log(isModalVisible, 'model status');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    console.log(isModalVisible, 'model status');
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.floatingContainer]}
        onPress={toggleModal}>
        <Icon
          style={[styles.floatingIcon]}
          name={iconName}
          size={38}
          color="#1097ff"
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent={true}
        statusBarTranslucent
        visible={isModalVisible}
        onRequestClose={() => toggleModal()}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Color Scheme</Text>
            {/* Modal Content */}
            <ScratchersLegend />
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Icon name="cancel" size={34} color="white" />
              {/* <Text style={styles.closeButtonText}>Close</Text> */}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {position: 'absolute', bottom: 20, right: 20},
  floatingIcon: {
    backgroundColor: 'white',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    width: '100%',
    height: '85%',
    alignItems: 'center',
    shadowColor: '#000', // Shadow color
    shadowOffset: {width: 10, height: 16}, // Increased offset for better visibility
    shadowOpacity: 0.5, // Increased opacity for a more defined shadow
    shadowRadius: 8, // Increased blur radius for a softer shadow
    // Drop shadow for Android
    elevation: 10, // Increased elevation for a stronger shadow
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  closeButton: {
    // zIndex: 99999,
    position: 'absolute',
    top: -35,
    right: 20,
    marginTop: 16,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: '#1097ff',
    borderRadius: 80,
    alignItems: 'center',
    flexDirection: 'row',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default FloatingIcon;
