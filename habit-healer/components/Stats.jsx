import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    ActivityIndicator,
    Text,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    useColorScheme
} from 'react-native';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { colors, habitColors } from '../colors/colors';
import SubpageHeader from './SubpageHeader';
import DeleteModal  from './DeleteModal';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { startOfWeek, addDays, isSameWeek, parseISO, format, subWeeks   } from 'date-fns';

const auth = getAuth();

const Stats = ({ selectedHabit, setCurrentScreen }) => {
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [habitName, setHabitName] = useState(selectedHabit.habitName)

    const [modalVisible, setModalVisible] = useState(false);

    const theme = useColorScheme();

    // Add state to manage the status of today's habit
    const [todayStatus, setTodayStatus] = useState('notDone'); // 'done', 'notDone', or 'neither'
    const [weekCompletion, setWeekCompletion] = useState(Array(7).fill(false)); // Initialized with all days incomplete
    // State to manage past weeks data
    const [pastWeeksData, setPastWeeksData] = useState([]);

    useEffect(() => {
        // Get today's date
        const today = new Date();
        // Format today's date to match the format in your 'datesCompleted' array
        const formattedToday = format(today, 'M/d/yyyy');

        // Find the start of the current week assuming the week starts on Sunday
        const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
        // Generate dates for the entire current week
        const currentWeekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

        // Reference to the user's habit in the database
        const dbRef = ref(getDatabase());
        const habitRef = child(dbRef, `habits/${auth.currentUser.uid}/${selectedHabit.category}/habitList/${selectedHabit.habitName}`);

        // Fetch the habit data from the database
        get(habitRef).then((snapshot) => {
            if (snapshot.exists()) {
            const habitData = snapshot.val();
            
            // Determine if the habit is completed today
            const isCompletedToday = habitData.datesCompleted?.some(dc => dc.date === formattedToday && dc.completed);

            // Update the 'todayStatus' based on whether today's habit is completed
            setTodayStatus(isCompletedToday ? 'done' : 'notDone');

            // Determine the completion status for each day of the current week
            const weekCompletionStatus = currentWeekDays.map(date => {
                // Adjusting the index to match your application's weekdays numbering
                const dayIndex = (date.getDay() + 1) % 7 || 7; 
                const isScheduled = habitData.weekdays.includes(dayIndex);
                const dateFormatted = format(date, 'M/d/yyyy');
                const isCompleted = habitData.datesCompleted?.some(dc => dc.date === dateFormatted && dc.completed);
                return isScheduled && isCompleted;
            });

            // Update the 'weekCompletion' state with the completion status of the current week
            setWeekCompletion(weekCompletionStatus);
            } else {
            console.log('No habit data found');
            }
            // Stop the loading indicator
            setLoadingCategories(false);
        }).catch((error) => {
            console.error('Error fetching habit data:', error);
            // Stop the loading indicator in case of error
            setLoadingCategories(false);
        });
    }, [selectedHabit, auth.currentUser.uid]);
      

    function cancel() {
        setCurrentScreen('HabitOverview')
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    const onDelete = () => {
        setCurrentScreen('HabitOverview')
    }

    const getCircleFill = () => {
        return todayStatus === 'done' ? 100 : 0;
      };

    const Dot = ({ isRunning }) => (
        <View
          style={[
            styles.dot,
            { backgroundColor: isRunning ? colors.headerColor : habitColors.lightGray } // green for running, red for done
          ]}
        />
      );

      const WeekBarGraph = () => {
        // Generate labels for the bars based on the weekdays from habitData
        const barLabels = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
      
        return (
          <View style={styles.weekGraphContainer}>
            {weekCompletion.map((completed, index) => (
              <View key={index} style={styles.dayContainer}>
                <View style={[styles.bar, { backgroundColor: completed ? '#70A9D2' : '#D3D3D3' }]} />
                <Text style={styles.dayLabel}>{barLabels[index]}</Text>
              </View>
            ))}
          </View>
        );
      };

// Render the past weeks' graph
const PastWeeksGraph = () => {
    return (
      <View style={styles.pastWeeksGraphContainer}>
        {pastWeeksData && pastWeeksData.map((weekData, index) => (
          <View key={index} style={styles.weekContainer}>
            {weekData && weekData.dailyData && weekData.dailyData.map((dayData, dayIndex) => (
              <View key={dayIndex} style={styles.dayContainer}>
                {/* Grey background bar representing total habits due */}
                <View style={[styles.bar, { height: dayData.totalDue * 10, backgroundColor: '#D3D3D3' }]} />
                {/* Blue front bar representing total completed habits */}
                <View style={[styles.bar, { height: dayData.totalCompleted * 10, backgroundColor: '#70A9D2', position: 'absolute' }]} />
                <Text style={styles.dayLabel}>{format(parseISO(weekData.date), 'M/dd')}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };  

    // Assume getHabitData is a function that fetches habit data from Firebase
    const getHabitData = async (category, habitName) => {
        const dbRef = ref(getDatabase());
        const habitRef = child(dbRef, `habits/${auth.currentUser.uid}/${category}/habitList/${habitName}`);
        const snapshot = await get(habitRef);
        if (snapshot.exists()) {
        return snapshot.val();
        } else {
        return null;
        }
    };


    return (
        <View>
            {loadingCategories ? (
                // Render a loading indicator or temporary screen while waiting for data
                <View style={[styles.loadingContainer, styles.loadingContainerHorizontal]}>
                    <ActivityIndicator size="large" color={colors.headerColor} />
                </View>
            ) : (
                // Render actual content once data is loaded
                <>
                    <SubpageHeader
                        title={habitName}

                        backButtonFunction={cancel}

                        rightSideButtonArray={
                            [
                                <TouchableOpacity onPress={() => { setCurrentScreen('Settings') }}>
                                    <Text style={[styles.habitNameText, { color: colors.headerColor }]}>Settings</Text>
                                </TouchableOpacity>
                            ]
                        }
                    />
                    <DeleteModal visible={modalVisible} onClose={closeModal} onDelete={onDelete} selectedHabit={selectedHabit} />
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            <View style={styles.columnContainer}>

                                <View style={styles.rowContainer}>
                                    <Text style={styles.subHeaderText}>Today</Text>
                                        <View style={styles.rowContainerSmall}>
                                            <Dot isRunning={false} />
                                            <Text style={styles.statusText}> Not Done </Text>
                                            <Dot isRunning={true} />
                                            <Text style={styles.statusText}> Done </Text>
                                        </View>
                                </View>

                                <View style={styles.graphContainer}>
                                    <AnimatedCircularProgress
                                    size={125}
                                    width={25}
                                    fill={getCircleFill()} // Call the function to get the fill percentage
                                    tintColor={todayStatus === 'done' ? "#70A9D2" : "#D3D3D3"} // Blue if done, grey otherwise
                                    backgroundColor="#3d5875"
                                    >
                                    {(fill) => <Text style={styles.points}>{todayStatus === 'done' ? '100%' : '0%'}</Text>}
                                    </AnimatedCircularProgress>
                                </View>

                                <View style={styles.rowContainer}>
                                    <Text style={styles.subHeaderText}>This Week</Text>
                                        <View style={styles.rowContainerSmall}>
                                            <Dot isRunning={false} />
                                            <Text style={styles.statusText}> Incomplete </Text>
                                            <Dot isRunning={true} />
                                            <Text style={styles.statusText}> Complete </Text>
                                        </View>
                                </View>

                                <WeekBarGraph/>    


                                {/* <View style={styles.rowContainer}>
                                    <Text style={styles.subHeaderText}>Past Weeks</Text>
                                        <View style={styles.rowContainerSmall}>
                                            <Dot isRunning={false} />
                                            <Text style={styles.statusText}> Incomplete </Text>
                                            <Dot isRunning={true} />
                                            <Text style={styles.statusText}> Complete </Text>
                                        </View>
                                </View>

                                <PastWeeksGraph/>     */}

                                
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </>
            )}
        </View>
    );
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
    container: {
        flex: 1,
        padding: 10,
        width: Dimensions.get('window').width,
    },
    columnContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10, // Add padding to align with the rest of your content
        width: '100%', // Ensure the container takes the full width
      },
      rowContainerSmall: {
        flexDirection: 'row',
        alignItems: 'center', // Align items vertically in the center
      },
    containerCenter: {
        flexDirection: 'row',
        flex: 1,
    },
    lightText: {
        color: colors.lightTextColor
    },
    darkText: {
        color: colors.darkTextColor
    },
    habitNameText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '600',
        marginRight: 10, 
    },
    dot: {
        height: 7,
        width: 7,
        borderRadius: 7,
        marginHorizontal: 7,
      },
      timeText: {
        fontSize: 15,
        color: 'white',
        fontWeight: '600',
      },
      statusText: {
        fontSize: 10,
        color: 'white',
        fontWeight: '600',
        opacity: 0.5,
      },
      graphContainer: {
        height: 70, // Set a fixed height
        justifyContent: 'center', // Center vertically in the container
        alignItems: 'center', // Center horizontally in the container
        marginVertical: 30, // Add some vertical margin if needed
      },
      points: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -30, // Half of your text size to center it, adjust as needed
        marginTop: -15, // Half of your text size to center it, adjust as needed
        color: 'white', // Your text color
        fontSize: 24, // Adjust your size
        textAlign: 'center',
        fontWeight: '700',
      },
      subHeaderText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '600',
        paddingVertical: 10,
        paddingHorizontal: 10,
      },
      weekGraphContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 100,
        marginTop: 20,
    },
    dayContainer: {
        alignItems: 'center',
    },
    bar: {
        width: 20,
        height: 50, // Adjust based on your needs
        borderRadius: 10,
        marginBottom: 5,
    },
    dayLabel: {
        color: 'white',
    },
    weekBarGraphContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%', // Adjust width as necessary
    },
    weekdayLabelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%', // This width should match weekBarGraphContainer width
        marginTop: 1, // Adjust spacing as needed
    },
    weekdayLabel: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
    },
    pastWeeksGraphContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 200, // Adjust according to the maximum height of the bars
        marginVertical: 20, // Space between each week
      },
      weekContainer: {
        alignItems: 'center',
        marginHorizontal: 5, // Space between each week
      },
});

export default Stats
