import React, { useState, useEffect } from 'react';
import {
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    TextInput,
    View,
    StyleSheet,
    useColorScheme
} from 'react-native';
import SubpageHeader from './SubpageHeader';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { colors } from '../colors/colors';

const Calendar = () => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const yearInitial = new Date().toLocaleString('en-US', { year: 'numeric', timeZone: userTimezone });
    const [year, setYear] = useState(yearInitial)


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
                <Text style={{ color: 'white' }}>Hello</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        width: 330,
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
