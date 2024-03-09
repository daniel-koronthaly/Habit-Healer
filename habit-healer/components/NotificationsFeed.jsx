// NotificationsFeed.js
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import NotificationItem from './NotificationItem'; // Adjust the path as necessary

const mockNotifications = [
  {
    id: '1',
    friendName: 'Alice',
    habitName: 'Morning Run',
    type: 'completed',
    timestamp: '2024-03-08T09:00:00.000Z',
  },
  {
    id: '2',
    friendName: 'Bob',
    habitName: 'Read 20 Pages',
    type: 'late',
    timestamp: '2024-03-07T20:00:00.000Z',
  },
  // Add more notifications as needed for the mockup
];

const NotificationsFeed = () => {
  return (
    <FlatList
      data={mockNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NotificationItem notification={item} />}
    />
  );
};

const styles = StyleSheet.create({
  // Add styles for the feed container if needed
});

export default NotificationsFeed;
