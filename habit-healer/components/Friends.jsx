import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { getAuth } from '../firebase/firebaseConfig';
import { colors } from '../colors/colors';
import NotificationsFeed from './NotificationsFeed';
import MainpageHeader from './MainpageHeader';

const auth = getAuth();

// Accept setCurrentScreen as a prop here
const Friends = ({ setCurrentScreen }) => {
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
        // Define topRightButtonText style to be used below
        topRightButtonText: {
            color: colors.headerColor, // Example color, adjust as necessary
            // Add other styling for your topRightButtonText here
        },
        // Any other dynamic styles based on the theme can be defined here
    });

    return (
        <View style={dynamicStyles.container}>
            <MainpageHeader
                title={"Friends"}
                rightSideButtonArray={
                    [
                        // Use setCurrentScreen function here as intended
                        <TouchableOpacity onPress={() => { setCurrentScreen("ViewFriends"); }}>
                            <Text style={dynamicStyles.topRightButtonText}>View Friends</Text>
                        </TouchableOpacity>,
                    ]
                }
            />
            <NotificationsFeed />
        </View>
    );
};

export default Friends;
