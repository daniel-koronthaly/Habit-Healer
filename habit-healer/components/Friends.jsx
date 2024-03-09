import React from 'react';
import { View, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { getAuth } from '../firebase/firebaseConfig';
import { colors } from '../colors/colors';
import NotificationsFeed from './NotificationsFeed';
import MainpageHeader from './MainpageHeader';

const auth = getAuth();

const Friends = () => {
    const theme = useColorScheme(); // Detects the current theme (light or dark)

    // Selects background color based on the theme
    const backgroundColor = theme === 'light' ? colors.lightBackgroundColor : colors.darkBackgroundColor;

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 10,
            width: Dimensions.get('window').width,
            backgroundColor: backgroundColor, // Applies the dynamic background color
        },
        // Any other dynamic styles based on the theme can be defined here
    });

    return (
        <View style={dynamicStyles.container}>
            <MainpageHeader
                title={'Notifications'}
                rightSideButtonArray={[]}
            />
            <NotificationsFeed />
        </View>
    );
};

export default Friends;
