import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    useColorScheme,
    Dimensions,
} from 'react-native';
import { getAuth } from '../firebase/firebaseConfig';
import { colors } from '../colors/colors';
import NotificationsFeed from './NotificationsFeed'; // Make sure the path is correct
import SubpageHeader from './SubpageHeader';

const auth = getAuth();

const Friends = () => {
    const theme = useColorScheme();
    // Assuming a similar approach to handling dark/light mode as in the provided example
    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 10,
            width: Dimensions.get('window').width,
            backgroundColor: theme === 'light' ? '#FFF' : '#333',
        },
        // Adapted styles for text, buttons, etc., to match HabitList's style
        textStyle: {
            fontSize: 20,
            fontWeight: '600',
            color: theme === 'light' ? 'black' : 'white', // Adjusting color based on theme
        },
        subtitleStyle: {
            fontSize: 14,
            fontWeight: '400',
            color: 'gray',
        },
        // Example button style based on HabitList's button styling
        buttonStyle: {
            height: 40,
            width: 55,
            borderWidth: 1,
            borderRadius: 20,
            borderColor: 'gray',
            marginLeft: 6,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme === 'light' ? '#FFF' : '#333', // Adjusting background based on theme
        },
        buttonText: {
            fontSize: 16,
            color: 'white',
        },
        // Add other styles as needed
    });

    return (
        <View style={dynamicStyles.container}>
            <SubpageHeader
                title={'Notifications'}
                backButtonFunction={() => console.log('Back button pressed')}
                rightSideButtonArray={[]}
            />
            <NotificationsFeed />
        </View>
    );
};
export default Friends;