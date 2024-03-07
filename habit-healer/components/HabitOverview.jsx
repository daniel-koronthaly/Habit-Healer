import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    useColorScheme
} from 'react-native'
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import MainpageHeader from './MainpageHeader'
import HabitOverviewList from './HabitOverviewList'
import { colors } from '../colors/colors';

const HabitOverview = ({ setCurrentScreen }) => {

    const [loadingHabits, setLoadingHabits] = useState(true);
    const [habits, setHabits] = useState([])

    const theme = useColorScheme();

    const auth = getAuth();

    useEffect(() => {
        const fetchData = async () => {
            const dbRef = ref(getDatabase());
            try {
                const snapshot = await get(child(dbRef, "habits/" + auth.currentUser.uid))
                if (snapshot.exists()) {
                    const categories = snapshot.val()
                    const newHabits = [];
                    Object.keys(categories).forEach(category => {
                        const habits = categories[category];
                        Object.keys(habits).forEach(habitName => {
                            const habit = habits[habitName];
                            const newHabit = {
                                category,
                                habitName,
                                habit
                            }
                            if (!newHabits.some((h) => h.category === newHabit.category && h.habitName === newHabit.habitName)) {
                                newHabits.push(newHabit)
                            }
                        })
                    })
                    setHabits(newHabits);
                } else {
                    console.log("no habits found")
                }

                setLoadingHabits(false);
            }
            catch (error) {
                console.error('Error fetching habits:', error);
                setLoadingHabits(false);
            }
        };
        fetchData();
    }, []);

    return (
        <View>
            <>
                <MainpageHeader
                    title={"Habits"}
                    rightSideButtonArray={
                        [
                            <TouchableOpacity onPress={() => { setCurrentScreen("HabitCreator"); }}>
                                <Text style={[styles.topRightButtonText, { color: colors.headerColor }]}>Add Habit</Text>
                            </TouchableOpacity>,
                        ]
                    }
                />
            </>
            <View style={styles.habitsContainer}>
                {loadingHabits ? (
                    // Render a loading indicator or temporary screen while waiting for data
                    <View style={[styles.loadingContainer, styles.loadingContainerHorizontal]}>
                        <ActivityIndicator size="large" color={colors.headerColor} />
                    </View>
                ) : (
                    habits.length === 0 ? (
                        <View style={styles.addHabit}>
                            <Text style={[styles.addHabitText, theme == 'light' ? styles.lightText : styles.darkText]}>Add your first habit to get started!</Text>
                            <TouchableOpacity style={styles.addHabitButton} onPress={() => { setCurrentScreen('HabitCreator'); }}>
                                <Text style={styles.addHabitText}>Add Habit</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.loadingContainerHorizontal}>
                            <HabitOverviewList habits={habits}></HabitOverviewList>
                        </View>
                    )
                )}
            </View>
        </View>)
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    loadingContainerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    habitsContainer: {
        flex: 3,
        width: Dimensions.get('window').width,
    },
    addHabit: {
        flex: 1,
        marginTop: 80,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    addHabitText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    addHabitButton: {
        backgroundColor: colors.headerColor,
        borderColor: colors.headerColor,
        marginTop: 30,
        height: 50,
        width: 200,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        padding: 10,
        width: 330,
    },
    topRightButtonText: {
        fontWeight: '700',
        fontSize: 18,
        //color: 'white'
    },
    lightText: {
        color: colors.lightTextColor
    },
    darkText: {
        color: colors.darkTextColor
    }
})
export default HabitOverview