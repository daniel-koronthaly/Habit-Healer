import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    TouchableWithoutFeedback,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    useColorScheme,
} from 'react-native'
import Swiper from 'react-native-swiper';
import moment from 'moment';
import 'moment-timezone';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { colors } from '../colors/colors';
import HabitList from './HabitList';
import HabitFilter from './HabitFilter';

const windowWidth = Dimensions.get('window').width;
const Main = ({ setCurrentScreen }) => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const hour = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: userTimezone });

    const swiper = useRef();
    const [value, setValue] = useState(new Date());
    const currentDate = value.toLocaleDateString('en-US', { timeZone: userTimezone })
    const [week, setWeek] = useState(0);

    const [loadingHabits, setLoadingHabits] = useState(true);
    const [habits, setHabits] = useState([])

    const [selectedCategory, setSelectedCategory] = useState('All')

    const auth = getAuth();

    const theme = useColorScheme();

    // Generate the weeks array based on the current week
    const weeks = React.useMemo(() => {
        const start = moment().add(week, 'weeks').startOf('week');
        return [-1, 0, 1].map(adj => {
            return Array.from({ length: 7 }).map((_, index) => {
                const date = moment(start).add(adj, 'week').add(index, 'day');
                return {
                    weekday: date.format('ddd'),
                    date: date.toDate(),
                };
            });
        });
    }, [week, userTimezone]);

    // every time a different day is selected, see which habits match that day of the week
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
                            if (habit.weekdays && habit.weekdays.includes(value.getDay() + 1)) {
                                const newHabit = {
                                    category,
                                    habitName,
                                    habit
                                }
                                if (!newHabits.some((h) => h.category === newHabit.category && h.habitName === newHabit.habitName)) {
                                    newHabits.push(newHabit)
                                }
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
    }, [value]);

    const memoizedHabits = useMemo(() => habits, [habits]);
    let filteredHabits = memoizedHabits
    if (selectedCategory !== 'All') {
        filteredHabits = filteredHabits.filter(item => item.category === selectedCategory)
    }

    var timeOfDay = null;
    var emoji = null;
    if (hour < 12) {
        timeOfDay = "Morning"
        emoji = '☀️';
    }
    else if (hour < 17) {
        timeOfDay = "Afternoon"
        emoji = '🌤️'
    }
    else {
        timeOfDay = "Evening"
        emoji = '🌙';
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.greetingContainer}>
                <Text style={[styles.greeting, theme == 'light' ? styles.lightText : styles.darkText]}>
                    Good {timeOfDay} {emoji}
                </Text>
            </View>
            <View style={styles.picker}>
                <Swiper
                    index={1}
                    ref={swiper}
                    loop={false}
                    showsPagination={false}
                    onIndexChanged={ind => {
                        if (ind === 1) {
                            return;
                        }
                        setTimeout(() => {
                            const newIndex = ind - 1;
                            const newWeek = week + newIndex;
                            setWeek(newWeek);
                            setValue(moment(value).add(newIndex, 'week').toDate());
                            swiper.current.scrollTo(1, false);
                        }, 100);
                    }}
                >
                    {weeks.map((dates, index) => (
                        <View style={[styles.itemRow]} key={index}>
                            {dates.map((item, dateIndex) => {
                                const isActive =
                                    value.toDateString() === item.date.toDateString();
                                return (
                                    <TouchableWithoutFeedback key={dateIndex} onPress={() => setValue(item.date)}>
                                        <View style={[styles.item, isActive && { backgroundColor: colors.specialButtonColor, borderColor: colors.specialButtonColor }]}>
                                            <Text style={[styles.itemWeekday, isActive && { color: theme == 'light' ? colors.lightTextColor : colors.darkTextColor }]}>
                                                {item.weekday}
                                            </Text>
                                            <View style={[styles.itemDateContainer, isActive ? styles.active : styles.inactive]}>
                                                <Text style={[styles.itemDate, isActive && { color: '#fff' }]}>
                                                    {item.date.getDate()}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </View>
                    ))}
                </Swiper>
            </View>
            {(memoizedHabits.length > 0) &&
                <HabitFilter habitList={memoizedHabits} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            }
            <View style={styles.habitsContainer}>
                {loadingHabits ? (
                    // Render a loading indicator or temporary screen while waiting for data
                    <View style={[styles.loadingContainer, styles.loadingContainerHorizontal]}>
                        <ActivityIndicator size="large" color={colors.headerColor} />
                    </View>
                ) : (
                    memoizedHabits.length === 0 ? (
                        <View style={styles.addHabit}>
                            <Text style={[styles.addHabitText, theme == 'light' ? styles.lightText : styles.darkText]}>Add your first habit to get started!</Text>
                            <TouchableOpacity style={styles.addHabitButton} onPress={() => { setCurrentScreen('HabitCreator'); }}>
                                <Text style={styles.addHabitText}>Add Habit</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.loadingContainerHorizontal}>
                            <HabitList habits={filteredHabits} currentDate={currentDate}></HabitList>
                        </View>
                    )
                )}
            </View>
        </SafeAreaView>)
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
    greetingContainer: {
        paddingHorizontal: 20,
        marginVertical: 20
    },
    greeting: {
        fontSize: 24,
        fontWeight: '700',
        //color: 'white',
    },
    picker: {
        flex: 1,
        width: windowWidth,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemRow: {
        width: windowWidth,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 5
    },
    item: {
        flex: 1,
        height: 70,
        marginHorizontal: 4,
        paddingVertical: 6,
        flexDirection: 'column',
        alignItems: 'center',
    },
    itemDateContainer: {
        height: 45,
        width: 45,
        borderWidth: 2,
        borderRadius: 22.5,
        borderColor: colors.specialButtonColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemWeekday: {
        fontSize: 13,
        fontWeight: '500',
        color: 'grey',
        marginBottom: 10,
    },
    itemDate: {
        fontSize: 15,
        fontWeight: '600',
        color: 'grey',
    },
    active: {
        backgroundColor: colors.headerColor,
    },
    inactive: {

    },
    lightText: {
        color: colors.lightTextColor
    },
    darkText: {
        color: colors.darkTextColor
    }
});

export default Main