import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { colors } from '../colors/colors';
import {Calendar as ICalendar, CalendarList as ICalendarList, Agenda as IAgenda} from 'react-native-calendars';

const Calendar = () => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const yearInitial = new Date().toLocaleString('en-US', { year: 'numeric', timeZone: userTimezone });
    const [year, setYear] = useState(yearInitial);
    const [selected, setSelected] = useState('');

    const theme = useColorScheme();

    function cancel() {
        // set screen to habit overview
    }

    return (
        <View>
            <>
                <SubpageHeader
                    title={'Calendar'}
                    backButtonFunction={cancel}
                    // backButtonStyle={{ color: colors.headerColor }}
                    // titleStyle={{ color: 'black' }}
                    rightSideButtonArray={
                        [
                            <TouchableOpacity onPress={() => {setYear(year-1)}}>
                                <Ionicons name={'chevron-back-outline'} size={20} color="white" />
                            </TouchableOpacity>,
                            <Text style={styles.year}>
                                {year}
                            </Text>,
                            <TouchableOpacity onPress={() => {setYear(year+1)}}>
                                <Ionicons name={'chevron-forward-outline'} size={20} color="white" />
                            </TouchableOpacity>
                        ]
                    }
                />
            </>
            <View style={styles.container}>
                <ICalendar
                    theme = {{
                        textDayHeaderFontWeight: '500',
                        textDayHeaderFontSize: 15,
                        textDayFontWeight: '500',
                        textDayFontSize: 15,
                        textMonthFontWeight: '500',
                        textMonthFontSize: 20,
                        backgroundColor: colors.darkBackgroundColor,
                        calendarBackground: colors.darkBackgroundColor,
                        textSectionTitleColor: '#b6c1cd',
                        // selectedDayBackgroundColor: '#00adf5',
                        // selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#d9e1e8',
                        textDisabledColor: '#2d4150',
                    }}
                    onDayPress={(day) => {setSelected(day.dateString)}}
                    markedDates={{
                        [selected]: {selected: true}
                    }}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
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
