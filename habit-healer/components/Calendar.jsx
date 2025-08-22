import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    ActivityIndicator,
    Text,
    TextInput,
    Dimensions,
    View,
    StyleSheet,
    useColorScheme
} from 'react-native';
import SubpageHeader from './SubpageHeader';
import MainpageHeader from './MainpageHeader';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, auth, child, set, get, ref } from '../firebase/firebaseConfig';
import { colors } from '../colors/colors';
import { Calendar as ICalendar, CalendarList as ICalendarList, Agenda as IAgenda } from 'react-native-calendars';
import { Skia, Rect, Path, Paint, Canvas, Circle, Group } from '@shopify/react-native-skia';
import moment from 'moment';

const Calendar = () => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const yearInitial = new Date().toLocaleString('en-US', { year: 'numeric', timeZone: userTimezone });
    const [year, setYear] = useState(yearInitial);
    const [selected, setSelected] = useState('');
    const [loadingHabits, setLoadingHabits] = useState(true);
    const [habits, setHabits] = useState([])
    const [usedColors, setUsedColors] = useState({});

    const theme = useColorScheme();

    const dayViewWidth = 50;
    const dayViewHeight = 50;
    const arcWidth = 45;
    const arcHeight = 45;
    const dayViewStrokeWidth = 3;
    const arcPaddingDeg = 20;

    function getHabitsToday(date) {
        const weekdayIdx = (parseInt(moment(date.dateString).format('d')) + 1);
        const habitsToday = [];
        habits.forEach(habit => {
            for (let i = 0; i < habit.habit.weekdays.length; i++) {
                if (weekdayIdx === habit.habit.weekdays[i]) {
                    habitsToday.push(habit);
                }
            }
        });
        return habitsToday;
    }

    function getHabitsCompleted(date) {
        const completed = []
        const mom = moment(date.dateString)
        habits.forEach(habit => {
            if (habit.habit.datesCompleted) {
                for (let i = 0; i < habit.habit.datesCompleted.length; i++) {
                    if (mom.dayOfYear() === moment(habit.habit.datesCompleted[i].date, 'MM/DD/YYYY').dayOfYear()) {
                        completed.push(habit)
                    }
                }
            }
        })
        return completed
    }

    function thisHabitCompletedToday(habit, date) {
        if (habit == null) return false
        if (habit.habit.datesCompleted) {
            const mom = moment(date.dateString)
            for (let i = 0; i < habit.habit.datesCompleted.length; i++) {
                if (mom.dayOfYear() === moment(habit.habit.datesCompleted[i].date, 'MM/DD/YYYY').dayOfYear()) {
                    return true
                }
            }
        }
        return false
    }

    function makeHabitStrokes(date) {
        if (loadingHabits) {
            return null
        }

        const habitsToday = getHabitsToday(date);
        const completed = getHabitsCompleted(date);
        const numHabits = habitsToday.length;
        const isToday = moment(date.dateString).isSame(moment(), 'day');

        const paths = [];
        for (let i = 0; i < numHabits; i++) {
            const arcLength = 360 / numHabits;
            const path = Skia.Path.Make();
            path.addArc({ x: (dayViewWidth - arcWidth) / 2, y: (dayViewHeight - arcHeight) / 2, width: arcWidth, height: arcHeight }, -275 + arcLength * i, arcLength - arcPaddingDeg);
            paths.push(path);
        }

        if (numHabits == 0) {
            const path = Skia.Path.Make();
            path.addArc({ x: (dayViewWidth - arcWidth) / 2, y: (dayViewHeight - arcHeight) / 2, width: arcWidth, height: arcHeight }, 0, 360);
            paths.push(path);
        }

        return paths.map((path, index) => {
            return (
                <Path key={index} path={path} color="transparent">
                    <Paint style="stroke" strokeWidth={dayViewStrokeWidth} strokeCap="round" color={thisHabitCompletedToday(habitsToday[index], date) ? isToday ? "white" : usedColors[habitsToday[index].category] : numHabits == 0 ?  "#101010" : "#404040" } />
                </Path>
            )
        })
    }

    function cancel() {
        // set screen to habit overview
    }

    useEffect(() => {
        const fetchData = async () => {
            const dbRef = ref(getDatabase());
            try {
                const snapshot = await get(child(dbRef, "habits/" + auth.currentUser.uid))
                if (snapshot.exists()) {
                    const categories = snapshot.val()
                    const newHabits = [];
                    const colorList = {}
                    Object.keys(categories).forEach(category => {
                        colorList[category] = categories[category].color
                        const habits = categories[category].habitList;
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
                    setUsedColors(colorList);
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
                {/* <SubpageHeader
                    title={'Calendar'}
                    backButtonFunction={cancel}
                    // backButtonStyle={{ color: colors.headerColor }}
                    // titleStyle={{ color: 'black' }}
                    rightSideButtonArray={
                        [
                            // <TouchableOpacity onPress={() => { setYear(year - 1) }}>
                            //     <Ionicons name={'chevron-back-outline'} size={20} color="white" />
                            // </TouchableOpacity>,
                            // <Text style={styles.year}>
                            //     {year}
                            // </Text>,
                            // <TouchableOpacity onPress={() => { setYear(year + 1) }}>
                            //     <Ionicons name={'chevron-forward-outline'} size={20} color="white" />
                            // </TouchableOpacity>
                        ]
                    }
                /> */}

                <MainpageHeader
                    title={"Calendar"}
                    rightSideButtonArray={
                        [
                        //     <TouchableOpacity onPress={() => { setCurrentScreen("HabitCreator"); }}>
                        //         <Text style={[styles.topRightButtonText, { color: colors.headerColor }]}>Add Habit</Text>
                        //     </TouchableOpacity>,
                        ]
                    }
                />
            </>
            <View style={styles.container}>
            {loadingHabits ? (
                <View style={[styles.loadingContainer, styles.loadingContainerHorizontal]}>
                    <ActivityIndicator size="large" color={colors.headerColor} />
                </View>
            ) : (
                <ICalendar
                    enableSwipeMonths={true}
                    hideExtraDays={true}
                    dayComponent={({ date, state }) => {
                        const isToday = moment(date.dateString).isSame(moment(), 'day');
                        return (
                            <View style={{ position: 'relative', width: dayViewWidth, height: dayViewWidth, justifyContent: 'center', alignItems: 'center' }}>
                                <Canvas style={{ width: dayViewWidth, height: dayViewWidth }}>
                                    {isToday ? <Circle key={date} cx={dayViewWidth / 2} cy={dayViewHeight / 2} r={dayViewWidth / 3} color="white" /> : null}
                                    {makeHabitStrokes(date)}
                                </Canvas>
                                <Text style={{ position: 'absolute', color: isToday ? 'blue' : state === 'disabled' ? 'gray' : 'white' }}>{date.day}</Text>
                            </View>
                        )
                    }}
                    theme={{
                        textDayHeaderFontWeight: '500',
                        textDayHeaderFontSize: 15,
                        textDayFontWeight: '500',
                        textDayFontSize: 15,
                        textMonthFontWeight: '500',
                        textMonthFontSize: 20,
                        backgroundColor: colors.darkBackgroundColor,
                        calendarBackground: colors.darkBackgroundColor,
                        textSectionTitleColor: '#b6c1cd',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#d9e1e8',
                        monthTextColor: 'white',
                        textDisabledColor: '#2d4150',
                        arrowColor: 'white',
                    }}
                    onDayPress={(day) => { setSelected(day.dateString) }}
                    markedDates={{
                        [selected]: { selected: true }
                    }}
                />
            )}
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    loadingContainerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        padding: 10
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerCenter: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    },
    topRightButtonText: {
        fontWeight: '700',
        fontSize: 18,
        //color: 'white'
    },
    year: {
        color: "white",
        fontSize: 20,
        fontWeight: 'bold',
    },
    lightText: {
        color: colors.lightTextColor
    },
    darkText: {
        color: colors.darkTextColor
    }
})

export default Calendar;
