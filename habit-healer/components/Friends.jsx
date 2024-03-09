import React from 'react';
import { Text, View, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { getAuth } from '../firebase/firebaseConfig';
import { colors } from '../colors/colors';
import NotificationsFeed from './NotificationsFeed';
import MainpageHeader from './MainpageHeader'; // Changed to MainpageHeader for consistency

const auth = getAuth();

const Friends = () => {
    const theme = useColorScheme();
    // Adjusting the container to use colors from the 'colors' object, if applicable
    const backgroundColor = theme === 'light' ? '#FFF' : '#333'; // Assuming you have these colors defined or use similar logic

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 10,
            width: Dimensions.get('window').width,
            backgroundColor: backgroundColor,
        },
        // Continue with other styles, ensuring they match the design language of the Settings page
    });

    return (
        <View style={dynamicStyles.container}>
            <MainpageHeader // Assuming you want to standardize header usage
                title={'Notifications'}
                // Assuming MainpageHeader accepts similar props as SubpageHeader
                rightSideButtonArray={[]}
            />
            <NotificationsFeed />
        </View>
    );
};

export default Friends;
