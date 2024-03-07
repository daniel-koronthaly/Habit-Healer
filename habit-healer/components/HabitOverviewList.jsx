import React, { useState, useEffect } from 'react';
import { FlatList, SectionList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const auth = getAuth();


const SubList = ({ habits, setCurrentScreen }) => {
    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.listItem}>
                <View style={styles.left}>
                    <Text style={styles.habitText}>{item.habitName}</Text>
                    <Text style={styles.habitSubtitleText}>
                        Time set at {item.habit.notificationTime}
                    </Text>
                </View>
                <View style={styles.right}>
                    <TouchableOpacity style={styles.button} onPress={() => { }}>
                        <Ionicons name={'close-outline'} size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => { }}>
                        <Ionicons name={'checkmark-outline'} size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    return (
        <FlatList
            data={habits}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
        />
    );
}

const HabitList = ({ habits, setCurrentScreen }) => {

    const [expandedSections, setExpandedSections] = useState([]);

    const toggleSection = (sectionIndex) => {
        const updatedSections = [...expandedSections];
        const isSectionExpanded = updatedSections.includes(sectionIndex);

        if (isSectionExpanded) {
            // Collapse the section
            updatedSections.splice(updatedSections.indexOf(sectionIndex), 1);
        } else {
            // Expand the section
            updatedSections.push(sectionIndex);
        }
        setExpandedSections(updatedSections);
    };

    const groupedData = habits.reduce((acc, item) => {
        const existingCategoryIndex = acc.findIndex((group) => group[0] && group[0].category === item.category);

        if (existingCategoryIndex !== -1) {
            acc[existingCategoryIndex].push(item);
        } else {
            acc.push([item]);
        }

        return acc;
    }, []);


    const sortedData = groupedData.map((subarray) => subarray.sort(sortHabits));

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

    const renderSectionHeader = ({ section }) => (
        <TouchableOpacity onPress={() => toggleSection(section.index)}>
            <View style={{ backgroundColor: 'lightgray', padding: 10 }}>
                <Text>{section.title}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = () => null // All the data is displayed in the footer

    const sections = sortedData.map((section, index) => ({
        title: section[0].category,
        data: section,
        index,
    }))

    return (
        <SectionList
            sections={sections}
            renderItem={(renderItem)}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item, index) => index.toString()}
            extraData={expandedSections}
            renderSectionFooter={({ section }) => (
                expandedSections.includes(section.index) && (
                    <SubList habits={section.data} />
                )
            )}
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