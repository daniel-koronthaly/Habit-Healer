import React, { useState, useEffect, useRef } from 'react';
import {
    TouchableOpacity,
    ActivityIndicator,
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { colors } from '../colors/colors';
import Autocomplete from 'react-native-autocomplete-input';
const auth = getAuth();

const HabitCreator = () => {
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isFocused, setIsFocused] = useState(false)

    const [habitName, setHabitName] = useState('')

    const uid = auth.currentUser.uid;


    useEffect(() => {
        const dbRef = ref(getDatabase());


        get(child(dbRef, "users/" + auth.currentUser.uid + "/habits"))
            .then(snapshot => {
                if (snapshot.exists()) {
                    const categories = Object.keys(snapshot.val());
                    setCategories(categories);
                    setLoadingCategories(false);
                }
                else {
                    setLoadingCategories(false);
                }
            })
            .catch(error => {
                console.error('Error fetching habits:', error);
                setLoadingCategories(false);
            });
    }, []);

    const findCategory = (query) => {
        if (query === '') {
            return categories;
        }

        const regex = new RegExp(`${query.trim()}`, 'i');
        return categories.filter(category => regex.test(category));
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setQuery(category);
        setIsFocused(false);
        Keyboard.dismiss()
    };


    return (
        <View>
            {loadingCategories ? (
                // Render a loading indicator or temporary screen while waiting for data
                <View style={[styles.loadingContainer, styles.loadingContainerHorizontal]}>
                    <ActivityIndicator size="large" color={colors.headerColor} />
                </View>
            ) : (
                // Render actual content once data is loaded
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container} pointerEvents='box-none'>
                        <View zIndex={1} style={styles.textInputPair}>
                            <Text style={styles.labelText}>Habit Category</Text>
                            <View>
                                <View style={styles.autocompleteContainer}>
                                    <Autocomplete
                                        data={findCategory(query)}
                                        placeholder={'Select a category'}
                                        defaultValue={query}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        onTextInput={() => setIsFocused(true)}
                                        onChangeText={(text) => setQuery(text)}
                                        flatListProps={{
                                            keyboardShouldPersistTaps: 'handled',
                                            keyExtractor: (_, idx) => idx.toString(),
                                            renderItem: ({ item }) => (
                                                <TouchableOpacity onPress={() => handleSelectCategory(item)}>
                                                    <Text style={styles.itemText}>{item}</Text>
                                                </TouchableOpacity>
                                            ),
                                        }}
                                        hideResults={!isFocused}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        listContainerStyle={styles.listContainer}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.textInputPair}>
                            <Text style={styles.labelText}>Habit Name</Text>
                            <TextInput style={styles.input} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
}

async function saveHabit() {
    const dbRef = getDatabase();
    set(ref(dbRef, "users/" + auth.currentUser.uid), { preprompt: newCustomPrePromptText.replace(/\n/g, " ").replace(/\s+/g, ' ') });
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    loadingContainerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    container: {
        flex: 1,
        padding: 20,
        width: 330,
        marginBottom: 100,
        backgroundColor: 'red'
    },
    inputContainerStyle: {
        width: 150
    },
    listContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        maxHeight: 150,
        width: 150,
        zIndex: 6
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 5,
    },
    itemText: {
        fontSize: 15,
        margin: 2,
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: 150
    },
    labelText: {
        marginBottom: 12
    },
    textInputPair: {
        marginBottom: 80
    }
});
export default HabitCreator