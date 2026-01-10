import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

let showToastFunction = null;

const Toast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const show = (msg) => {
    setMessage(msg);
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        hide();
      }, 3000); // Auto hide after 3 seconds
    });
  };

  const hide = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  // Expose the show function globally
  showToastFunction = show;

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastText}>{message}</Text>
        <TouchableOpacity onPress={hide} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastContent: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  closeButton: {
    marginLeft: 10,
  },
});

// Export the component and the show function
export default Toast;
export const showToast = (message) => {
  if (showToastFunction) {
    showToastFunction(message);
  }
};