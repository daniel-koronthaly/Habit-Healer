import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { colors } from '../colors/colors'
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native';

const Header = () => {
    return (
        <SafeAreaView style={styles.outerContainer}>
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Habit Healer</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: colors.brown,
        width: '100%',
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 20,
    },
    container: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: colors.headerColor,
        fontSize: 36,
        fontWeight: 'bold',
    },
});

export default Header;
