import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const auth = getAuth();

const HabitList = ({ habits, currentDate, isAfterCurrentDate, colorList }) => {

    const [sortedHabits, setSortedHabits] = useState([...habits].sort(sortHabits));

    useEffect(() => {
        const newSortedHabits = [...habits].sort(sortHabits);
        if (!areArraysEqual(newSortedHabits, sortedHabits)) {
            setSortedHabits(newSortedHabits);
        }
    }, [habits, sortHabits]);

    const areArraysEqual = (array1, array2) => {
        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    };

    function sortHabits(a, b) {
        const hasDatesCompletedA = "datesCompleted" in a.habit
        const hasDatesCompletedB = "datesCompleted" in b.habit

        if (hasDatesCompletedA !== hasDatesCompletedB) {
            return hasDatesCompletedA - hasDatesCompletedB
        }

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
            set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/habitList/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
            // update activities list
            // put key: habitName, value: {dateCompleted, timeCompleted, type: "finished"}
            set(ref(dbRef, "activities/" + auth.currentUser.uid + "/" + item.habitName + "/"), { "dateCompleted": currentDate, "timeCompleted": item.habit.notificationTime, "type": "finished" })
        }
        else {
            const existingDateEntry = item.habit.datesCompleted.find(entry => entry.date === dateEntry.date);
            if (!existingDateEntry) {
                item.habit.datesCompleted.push(dateEntry)
                item.habit.datesCompleted.sort((a, b) => sortByDate(a, b))
                set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/habitList/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
            }
            else if (!existingDateEntry.completed) {
                existingDateEntry.completed = true;
                set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/habitList/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
            }
        }

        const modifiedHabits = sortedHabits.map((originalItem) =>
            originalItem.id === item.id ? item : originalItem
        );
        setSortedHabits(modifiedHabits.sort(sortHabits))
    }

    function checkNotDone(item) {
        const dateEntry = {
            "date": currentDate,
            "completed": false
        }
        const dbRef = getDatabase();

        if (!item.habit.datesCompleted) {
            item.habit.datesCompleted = [dateEntry]
            set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/habitList/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
        }
        else {
            const existingDateEntry = item.habit.datesCompleted.find(entry => entry.date === dateEntry.date);
            if (!existingDateEntry) {
                item.habit.datesCompleted.push(dateEntry)
                item.habit.datesCompleted.sort((a, b) => sortByDate(a, b))
                set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/habitList/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
            }
            else if (existingDateEntry.completed) {
                existingDateEntry.completed = false;
                set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/habitList/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
            }
        }
        const modifiedHabits = sortedHabits.map((originalItem) =>
            originalItem.id === item.id ? item : originalItem
        );
        setSortedHabits(modifiedHabits.sort(sortHabits))
    }

    function removeCompletedEntry(item) {
        const dbRef = getDatabase();
        item.habit.datesCompleted = item.habit.datesCompleted.filter(entry => entry.date !== currentDate)
        if (item.habit.datesCompleted.length === 0) {
            delete item.habit.datesCompleted;
            set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/habitList/" + item.habitName + "/datesCompleted"), null)
        }
        else {
            set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + item.category + "/habitList/" + item.habitName + "/datesCompleted"), item.habit.datesCompleted)
        }
        const modifiedHabits = sortedHabits.map((originalItem) =>
            originalItem.id === item.id ? item : originalItem
        );
        setSortedHabits(modifiedHabits.sort(sortHabits))
    }

    const renderItem = ({ item, index }) => {
        const hasDatesCompleted = "datesCompleted" in item.habit
        let dateMatch = null
        if (hasDatesCompleted) {
            dateMatch = Object.values(item.habit.datesCompleted).find(entry => entry.date === currentDate)
        }
        const isDone = hasDatesCompleted && dateMatch !== undefined && dateMatch.completed
        return (
            <View style={styles.listItem}>
                <View style={styles.colorStrip} backgroundColor={!dateMatch ? colorList[item.category] : 'gray'} />
                <View style={styles.left}>
                    <Text style={!dateMatch ? styles.habitText : styles.habitTextCompleted}>{item.habitName}</Text>
                    <Text style={!dateMatch ? styles.habitSubtitleText : styles.habitSubtitleTextCompleted}>
                        Time set at {item.habit.notificationTime}
                    </Text>
                </View>
                {isAfterCurrentDate ?
                    (
                        <View style={styles.right}>
                            <Text style={styles.habitSubtitleText}>You cannot edit a day in the future.</Text>
                        </View>
                    )
                    : (
                        !dateMatch ? (
                            <View style={styles.right}>
                                <TouchableOpacity style={styles.button} onPress={() => { checkNotDone(item) }}>
                                    <Ionicons name={'close-outline'} size={20} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} onPress={() => { checkDone(item) }}>
                                    <Ionicons name={'checkmark-outline'} size={20} color="white" />
                                </TouchableOpacity>
                            </View>) : (
                            <View style={styles.right}>
                                <TouchableOpacity style={styles.button} onPress={() => { removeCompletedEntry(item) }}>
                                    <Text style={styles.completedText}>{isDone ? "Done" : "Not Done"}</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                }
            </View>
        )
    };

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
    colorStrip: {
        width: 3,
        height: 40,
        marginRight: 20,
        borderRadius: 5,
        backgroundColor: 'red'
    },
    listItem: {
        backgroundColor: '#333',
        marginBottom: 10,
        height: 70,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10
    },
    habitText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    habitTextCompleted: {
        fontSize: 20,
        fontWeight: '600',
        color: 'gray',
    },
    habitSubtitleText: {
        fontSize: 14,
        fontWeight: '400',
        color: 'gray',
    },
    habitSubtitleTextCompleted: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666',
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
    },
    completedText: {
        fontSize: 10,
        fontWeight: '600',
        color: 'gray',
    }
})
export default HabitList;