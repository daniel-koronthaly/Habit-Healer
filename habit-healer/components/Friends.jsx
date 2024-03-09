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

    // Dynamically adjust styles based on theme
    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 10,
            width: Dimensions.get('window').width,
            backgroundColor: theme === 'light' ? '#FFF' : '#333', // Adjust based on theme
        },
        // Other styles can remain static or be adjusted dynamically as well
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
