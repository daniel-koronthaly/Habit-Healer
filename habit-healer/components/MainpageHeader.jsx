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


const MainpageHeader = ({ title, rightSideButtonArray }) => {
    return (
        <SafeAreaView style={styles.outerContainer}>
            <View style={styles.container}>
                <View style={styles.left}>
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
        width: '100%',
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 20,
        marginBottom: 20
    },
    container: {
        width: 330,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 3,
        //alignItems: 'center', // this works well for subpageheader but not here
        paddingLeft: 10, // so this is used instead
        justifyContent: 'center',
    },
    title: {
        color: "white",
        fontSize: 32,
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

export default MainpageHeader;
