import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import FriendListItem from './FriendListItem'; // Make sure this path is correct
import { getDatabase, getAuth, ref, get } from '../firebase/firebaseConfig';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
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
    let namesRef = ref(database, 'names');
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

    // Fetch user's friends
    const friendsRef = ref(database, `friends/${currentUser.uid}`);
    get(friendsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const friendsList = Object.keys(snapshot.val()).map(friendId => ({
          id: friendId,
          name: localUserNames[friendId] || 'Unknown',
        }));
        setFriends(friendsList);
      }
    }).catch((error) => {
      console.error('Error fetching friends:', error);
    });

  }, [currentUser]); // You might also want to listen for changes in userNames

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FriendListItem friendName={item.name} />}
    />
  );
};

const styles = StyleSheet.create({
  // Add styles for the feed container if needed
});

export default FriendList;
