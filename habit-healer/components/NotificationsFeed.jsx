import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import NotificationItem from './NotificationItem'; // Adjust the path as necessary
import { useState, useEffect } from 'react';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { onValue } from "firebase/database";

const NotificationsFeed = () => {
  const [notifications, setNotifications] = useState([]);
  const [userNames, setUserNames] = useState({});
  const database = getDatabase();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    let localUserNames = {};
    // Fetch user names
    let namesRef = ref(database, 'usernames');
    console.log(namesRef)
    get(namesRef).then((snapshot) => {
      console.log('in here')
      console.log(snapshot.val())
      localUserNames = snapshot.val();
      if (snapshot.exists()) {
        setUserNames(snapshot.val());
      }
    }).catch((error) => {
      console.log('Error fetching names')
      console.error(error);
    });

    console.log("userNames", userNames)
    console.log("localUserNames", localUserNames)

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
                  friendName: localUserNames[friendId] || 'Unknown', // Now using the fetched name
                  habitName: key,
                  type: activity.type,
                  timestamp: `${activity.dateAdded}T${activity.timeAdded}`,
                };
              });
              // Update your state with the new notifications
              setNotifications(prevNotifications => {
                // Merge with existing notifications and remove duplicates
                const merged = [...prevNotifications, ...updatedActivities];
                const unique = [...new Map(merged.map(item => [item.id, item])).values()];
                return unique.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
              });
            }
          });
        });
      }
    });
  }, [currentUser]); // You might also want to listen for changes in userNames

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NotificationItem notification={item} />}
    />
  );
};

const styles = StyleSheet.create({
  // Add styles for the feed container if needed
});

export default NotificationsFeed;
