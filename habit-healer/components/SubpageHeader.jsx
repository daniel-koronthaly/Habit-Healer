import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import { colors } from '../colors/colors'
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const SubpageHeader = ({ title, backButtonFunction, rightSideButtonArray }) => {
    return (
        <SafeAreaView style={styles.outerContainer}>
            <View style={styles.container}>
                <View style={styles.left}>
                    <TouchableOpacity
                        onPress={backButtonFunction}
                    >
                        <Ionicons name={'chevron-back-outline'} size={28} color="white" />
                    </TouchableOpacity>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                </View>
                <View style={styles.right}>
                    {rightSideButtonArray.map((button, index) => (
                        <View style={styles.buttons} key={index}>{button}</View>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        width: "100%",
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 20,
        marginBottom: 20,
    },
    container: {
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 60
    },
    textContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: "white",
        fontSize: 26,
        fontWeight: 'bold',
    },
    left: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        flex: 1.2,
        alignItems: 'center'
    },
    right: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        flex: 1,
        alignItems: 'center'
    },
    buttons: {
        marginLeft: 10
    }
});

export default SubpageHeader;
