import React, { useState, useEffect } from 'react';
import { FlatList, SectionList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const auth = getAuth();


const SubList = ({ habits, setCurrentScreen, setSelectedHabit, colorList }) => {
    const renderItem = ({ item, index }) => {
        const days = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']
        return (
            <View style={styles.listItem}>
                <View style={styles.colorStrip} backgroundColor={colorList[item.category]} />
                <View style={styles.left}>
                    <Text style={styles.habitText}>{item.habitName}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {days.map((day, index) => (
                            <Text
                                key={index}
                                style={
                                    [styles.habitSubtitleWeekdays,
                                    { color: item.habit.weekdays.includes(index+1) ? 'white' : 'gray' }
                                    ]
                                }
                            >
                                {day}
                            </Text>
                        ))}
                        <Text style={[styles.habitSubtitleText, {marginLeft:10}]}>
                            {item.habit.notificationTime}
                        </Text>
                    </View>
                </View>
                <View style={styles.right}>
                    <TouchableOpacity style={styles.button} onPress={() => { setSelectedHabit(item); setCurrentScreen('EditHabit');  }}>
                        <Ionicons name={'pencil-outline'} size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => { setSelectedHabit(item); setCurrentScreen('Stats') }}>
                        <Text style={styles.completedText}>Stats</Text>
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
            scrollEnabled={false}
        />
    );
}

const HabitList = ({ habits, setCurrentScreen, setSelectedHabit, colorList }) => {

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

    // This makes all sections expanded by default, otherwise they would be collapsed
    useEffect(() => {
        const allSectionIndices = groupedData.map((_, index) => index);
        setExpandedSections(allSectionIndices);
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

    const renderSectionHeader = ({ section }) => {
        const isSectionExpanded = expandedSections.includes(section.index);

        return (<TouchableOpacity onPress={() => toggleSection(section.index)}>
            <View style={styles.container}>
                <View style={styles.left}>
                    <Text style={styles.headerText}>{section.title}</Text>
                </View>
                <View style={styles.right}>
                    {isSectionExpanded ?
                        (<Ionicons name={'chevron-up-outline'} size={20} color="white" />) :
                        (<Ionicons name={'chevron-down-outline'} size={20} color="white" />)}

                </View>
            </View>
        </TouchableOpacity>)
    }


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
            stickySectionHeadersEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            extraData={expandedSections}
            renderSectionFooter={({ section }) => (
                expandedSections.includes(section.index) && (
                    <SubList habits={section.data} setCurrentScreen={setCurrentScreen} setSelectedHabit={setSelectedHabit} colorList={colorList} />
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
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
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
    habitSubtitleWeekdays: {
        fontSize: 14,
        fontWeight: '400',
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
        color: 'white',
    }
})
export default HabitList;