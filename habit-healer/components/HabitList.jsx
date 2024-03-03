import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HabitList = ({ habits }) => {
    const sortedHabits = habits.slice().sort((a, b) => {
        const timeA = new Date(a.notificationTime).getTime();
        const timeB = new Date(b.notificationTime).getTime();
        return timeA - timeB;
    });

    function checkDone() {
        // TO-DO
    }

    function checkNotDone() {
        // TO-DO
    }

    const renderItem = ({ item, index }) => (
        <View style={styles.listItem}>
            <View style={styles.left}>
                <Text style={styles.habitText}>{item.habitName}</Text>
                <Text style={styles.habitSubtitleText}>Time set at {item.habit.notificationTime}</Text>
            </View>
            <View style={styles.right}>
                <TouchableOpacity style={styles.button} onPress={checkNotDone}>
                    <Ionicons name={'close-outline'} size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={checkDone}>
                    <Ionicons name={'checkmark-outline'} size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            data={sortedHabits}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    left: {
        justifyContent: "flex-start",
        flex: 1.2
    },
    right: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        flex: 1,
    },
    listItem: {
        backgroundColor: '#333',
        marginBottom: 10,
        height: 70,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10
    },
    habitText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    habitSubtitleText: {
        fontSize: 14,
        fontWeight: '400',
        color: 'gray',
    },
    button: {
        height: 40,
        width: 55,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'gray',
        marginLeft: 6,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default HabitList;