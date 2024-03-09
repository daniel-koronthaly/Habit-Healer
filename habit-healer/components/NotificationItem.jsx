// NotificationItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NotificationItem = ({ notification }) => {
  const { friendName, habitName, type } = notification;
  const isCompleted = type === 'completed';

  return (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>
        {`${friendName} ${isCompleted ? 'completed' : 'is late for'} ${habitName}`}
      </Text>
      {isCompleted && (
        <TouchableOpacity style={styles.hiFiveButton}>
          <Text style={styles.hiFiveButtonText}>Hi Five!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  notificationText: {
    fontSize: 16,
  },
  hiFiveButton: {
    backgroundColor: 'blue',
    borderRadius: 20,
    padding: 8,
  },
  hiFiveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default NotificationItem;
