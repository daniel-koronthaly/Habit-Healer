import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';


const HabitFilter = ({ habitList, selectedCategory, setSelectedCategory }) => {
    const categoryCounts = {};

    habitList.forEach(item => {
        const category = item.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const renderItem = ({ item }) => {
        const isActive = item.category === selectedCategory
        return (<TouchableOpacity style={[styles.button, isActive && styles.buttonActive]} onPress={() => setSelectedCategory(item.category)}>
            <View style={styles.rowContainer}>
                <View style={styles.left}>
                    <Text style={isActive ? styles.activeCategory : styles.inactiveCategory}>{item.category}</Text>
                </View>
                <View style={styles.right}>
                    <Text style={styles.activeCount}>{item.count}</Text>
                </View>
            </View>
        </TouchableOpacity>)
    };

    let data = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));
    // here you can sort data either alphabetically on category or on count numerically
    const all = {'category': 'All', "count": Object.keys(categoryCounts).length}
    data = [all,...data]

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.category}
                horizontal={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        // backgroundColor: 'green'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    left: {
        flexDirection: 'row',
        justifyContent: "flex-start",
    },
    right: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
        marginLeft: 10,
        width: 20,
        height: 20
    },
    activeCategory: {
        fontSize: 13,
        fontWeight: '500',
        color: 'white',
    },
    inactiveCategory: {
        fontSize: 13,
        fontWeight: '500',
        color: 'gray',
    },
    activeCount: {
        fontSize: 13,
        fontWeight: '500',
        color: 'white',
    },
    inactiveCount: {

    },
    button: {
        borderRadius: 20,
        height: 40,
        marginRight: 10,
        justifyContent: 'center',
        padding: 10
    },
    buttonActive: {
        backgroundColor: '#333'
    }
});

export default HabitFilter;