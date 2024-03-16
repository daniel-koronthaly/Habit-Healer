import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import NotificationItem from './NotificationItem'; // Adjust the path as necessary
import { getDatabase, ref, child, get, onValue } from '@firebase/database';
import { getAuth } from "firebase/auth";

const NotificationsFeed = () => {
  const [notifications, setNotifications] = useState([]);
  const database = getDatabase();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const friendsRef = ref(database, `friends/${currentUser.uid}`);
    get(friendsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const friendsList = Object.keys(snapshot.val());
        friendsList.forEach(friendId => {
          const activitiesRef = ref(database, `activities/${friendId}`);
          onValue(activitiesRef, (activitySnapshot) => {
            if (activitySnapshot.exists()) {
              // Transform and update your notifications based on the new snapshot
              const updatedActivities = Object.keys(activitySnapshot.val()).map(key => {
                // Transform the activity data to match your NotificationItem component's expected format
                const activity = activitySnapshot.val()[key];
                return {
                  id: key,
                  friendName: friendId, // You might want to fetch the friend's name from another part of your database
                  habitName: key,
                  type: activity.type,
                  timestamp: `${activity.dateAdded}T${activity.timeAdded}`,
                };
              });
              // Update your state with the new notifications (you might need to merge this with existing notifications)
              setNotifications(prevNotifications => [...prevNotifications, ...updatedActivities]);
            }
          });
        });
      }
    });
  }, [currentUser]);

  return (
    <FlatList
      data={notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NotificationItem notification={item} />}
    />
  );
};

export default NotificationsFeed;
