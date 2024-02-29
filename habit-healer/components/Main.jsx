import React, { useState, useRef } from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableWithoutFeedback,
    Dimensions,
    useColorScheme
} from 'react-native'
import Swiper from 'react-native-swiper';
import moment from 'moment';
import 'moment-timezone';
import { colors } from '../colors/colors';

const windowWidth = Dimensions.get('window').width;
const Main = () => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const hour = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: userTimezone });
    
    const swiper = useRef();
    const [value, setValue] = useState(new Date());
    const [week, setWeek] = useState(0);

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
                <Text style={styles.greeting}>
                    Good {timeOfDay} {emoji}
                </Text>
            </View>
            <View style={styles.container}>
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
                                                <Text style={[styles.itemWeekday, isActive && { color: '#fff' }]}>
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
            </View>
        </SafeAreaView>)
}
const styles = StyleSheet.create({
    greetingContainer: {
        paddingHorizontal: 20
    },
    greeting: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },
    container: {
        flex: 1,
        width: windowWidth,
    },
    picker: {
        flex: 1,
        maxHeight: 110,
        paddingVertical: 12,
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
    active:{
        backgroundColor: colors.headerColor,
    },
    inactive: {

    }
});

export default Main