import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FriendListItem = ({ friendName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{friendName}</Text>
      <View style={styles.right}>
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        marginBottom: 10,
        height: 70,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    right: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        flex: 1,
    },
    button: {
        height: 40,
        width: 55,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'gray',
        marginLeft: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
    },
});

export default FriendListItem;
