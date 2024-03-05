import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const auth = getAuth();

const HabitList = ({ habits, currentDate }) => {
    const sortedHabits = habits.slice().sort(sortHabits);

    function sortHabits(a, b) {
        const parseTime = (timeString) => {
            const [time, period] = timeString.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            const adjustedHours = period === 'PM' ? hours + 12 : hours;
            return adjustedHours * 60 + minutes;
        };

        const timeA = parseTime(a.habit.notificationTime);
        const timeB = parseTime(b.habit.notificationTime);
        return timeA - timeB;
    }

    function sortByDate(a, b) {
        const parseDate = (dateString) => {
            const [month, day, year] = dateString.split('/').map(Number);
            return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
        };

        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        return dateA - dateB;
    }

    function checkDone(item) {
        const dateEntry = {
            "date": currentDate,
            "completed": true
        }
        const dbRef = getDatabase();

        if (!item.habit.datesCompleted) {
            item.habit.datesCompleted = [dateEntry]
            set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
        }
        else {
            const existingDateEntry = item.habit.datesCompleted.find(entry => entry.date === dateEntry.date);
            if (!existingDateEntry) {
                item.habit.datesCompleted.push(dateEntry)
                item.habit.datesCompleted.sort((a, b) => sortByDate(a, b))
                set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
            }
            else if (!existingDateEntry.completed) {
                existingDateEntry.completed = true;
                set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
            }
        }
    }

    function checkNotDone(item) {
        const dateEntry = {
            "date": currentDate,
            "completed": false
        }
        const dbRef = getDatabase();

        if (!item.habit.datesCompleted) {
            item.habit.datesCompleted = [dateEntry]
            set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
        }
        else {
            const existingDateEntry = item.habit.datesCompleted.find(entry => entry.date === dateEntry.date);
            if (!existingDateEntry) {
                item.habit.datesCompleted.push(dateEntry)
                item.habit.datesCompleted.sort((a, b) => sortByDate(a, b))
                console.log(item.habit.datesCompleted)
                set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
            }
            else if (existingDateEntry.completed) {
                existingDateEntry.completed = false;
                set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
            }
        }
    }

    function removeCompletedEntry(item) {
        const dbRef = getDatabase();
        set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/" + item.habitName + "/datesCompleted"), null)

    }

    const renderItem = ({ item, index }) => (
        <View style={styles.listItem}>
            <View style={styles.left}>
                <Text style={styles.habitText}>{item.habitName}</Text>
                <Text style={styles.habitSubtitleText}>Time set at {item.habit.notificationTime}</Text>
            </View>
            <View style={styles.right}>
                <TouchableOpacity style={styles.button} onPress={() => { checkNotDone(item) }}>
                    <Ionicons name={'close-outline'} size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => { checkDone(item) }}>
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