import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
// import {Ionicons} from '@expo/v'; // Or any icon library
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const Toast = ({
  visible,
  message,
  type = 'success',
  duration = 3000,
  position = 'bottom', // Options: top, center, bottom
  onHide = () => {}, // Callback when toast hides
}) => {
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? 100 : position === 'center' ? 0 : -50,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start(onHide); // Call onHide when animation completes
        }, duration);
      });
    }
  }, [visible]);

  if (!visible) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {backgroundColor: 'rgba(60, 95, 30, 1)'};
      case 'error':
        return {backgroundColor: 'rgba(90, 30, 30, 1)'};
      case 'info':
        return {backgroundColor: 'rgba(30, 30, 90, 1)'};
      case 'warning':
        return {backgroundColor: 'rgba(90, 80, 30, 1)'}; // Orange
      default:
        return {backgroundColor: 'rgba(50, 50, 50, 1)'};
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'info':
        return 'information-circle';
      case 'warning':
        return 'warning';
      default:
        return 'alert';
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        getToastStyle(),
        {
          transform: [{translateY: slideAnim}],
          top: position === 'top' ? 0 : position === 'center' ? '50%' : null,
          bottom: position === 'bottom' ? 100 : null,
        },
      ]}>
      <Icon name={getIconName()} size={24} color="#fff" style={styles.icon} />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    flexShrink: 1,
  },
  icon: {
    marginRight: 10,
  },
});

export default Toast;
