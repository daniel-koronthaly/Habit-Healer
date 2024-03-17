import React, { useState, useEffect } from 'react';
import {
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Switch,
    Dimensions,
    useColorScheme
} from 'react-native';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { colors, habitColors } from '../colors/colors';
import Autocomplete from 'react-native-autocomplete-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DaySelector from './DaySelector';
import SubpageHeader from './SubpageHeader';

const auth = getAuth();

const AddFriends = ({setCurrentScreen}) => {
    const [loadingUsernames, setLoadingUsernames] = useState(true);
    const [usernames, setUsernames] = useState([]);
    const [username, setUsername] = useState('');

    // used to hide dropdown menu results when the dropdown is not selected
    const [isFocused, setIsFocused] = useState(false)

    const [habitName, setHabitName] = useState('')

    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);

    const [shareWithFriends, setShareWithFriends] = useState(false)
    const toggleSwitch = () => setShareWithFriends(previousState => !previousState);
    const [weekdays, setWeekdays] = React.useState([])


    const theme = useColorScheme();

    // this gets all of the previously used usernames of habits by this user
    useEffect(() => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, "usernames"))
            .then(snapshot => {
                const data = snapshot.val()
                if (data && Object.keys(data).length > 0) {
                    const usernames =  Object.values(data);
                    setUsernames(usernames);
                    setLoadingUsernames(false);
                }
                else {
                    setLoadingUsernames(false);
                }
            })
            .catch(error => {
                console.error('Error fetching usernames:', error);
                setLoadingUsernames(false);
            });
    }, []);

    // returns all usernames that match what you have typed: "eati" will match "eating"
    const findCategory = (query) => {
        if (query === '') {
            return usernames;
        }

        const regex = new RegExp(`${query.trim()}`, 'i');
        return usernames.filter(username => regex.test(username));
    };

    const handleSelectCategory = (username) => {
        setUsername(username);
        setIsFocused(false);
        Keyboard.dismiss()
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (time) => {
        setSelectedTime(time);
        hideTimePicker();
    };

    function cancel() {
        setCurrentScreen('HabitOverview')
    }

    // returns true if database query can be made and all elements of a habit are selected
    function checkSavable() {
        let savable = true;
        let errorMessage = '';
        if (username === '') {
            savable = false;
            errorMessage += "You must give a username for this habit.\n"
        }
        if (habitName === '') {
            savable = false;
            errorMessage += "You must choose a name for this habit.\n"
        }
        if (selectedTime === null) {
            savable = false;
            errorMessage += "You must choose a time.\n"
        }
        if (!weekdays.length) {
            savable = false;
            errorMessage += "You must choose at least one day.\n"
        }
        errorMessage = errorMessage.trimEnd();
        if (!savable) {
            Alert.alert(
                "Error adding habit",
                errorMessage,
                [
                    {
                        text: "OK",
                    },
                ]
            );
        }
        return savable;
    }

    // saves habit in firebase
    function saveHabit() {
        if (checkSavable()) {
            setWeekdays(weekdays.sort())
            const dbRef = getDatabase();
            const habit = {
                "notificationTime": selectedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, }),
                "weekdays": weekdays,
                "sharesWithFriends": shareWithFriends,
                "dateUpdated": new Date().toDateString()
            }
            if (usedColors[username]) {
                set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + username + "/habitList/" + habitName), habit).then(() => {
                    // Alert.alert(
                    //     "Added new habit",
                    //     [
                    //         {
                    //             text: "OK",
                    //         },
                    //     ]
                    // );
                    // Why is this crashing
                }).catch((error) => {
                    console.log("Failed to write habit to database " + error);
                });
            }
            else {
                let chosenColor = null;
                const colorKeys = Object.keys(habitColors);
                for (let i = 0; i < colorKeys.length; i++) {
                    const color = habitColors[colorKeys[i]]
                    if (!Object.values(usedColors).some(newcolor => newcolor === color)) {
                        chosenColor = color;
                        break;
                    }
                }
                if (chosenColor) {
                    const usernameRef = ref(dbRef, "habits/" + auth.currentUser.uid + "/" + username);
                    const dataToSet = {
                        "color": chosenColor,
                        "habitList": {
                            [habitName]: habit
                        }
                    };
                    set(usernameRef, dataToSet);
                    console.log("set new username " + username + " with color " + chosenColor)
                }
                else {
                    Alert.alert(
                        "Error adding habit",
                        "There are 10 usernames allowed max. Delete habits from a username to free up a slot.",
                        [
                            {
                                text: "OK",
                            },
                        ]
                    );
                }
            }
            setCurrentScreen('HabitOverview')
        }
    }


    return (
        <View>
            {loadingUsernames ? (
                // Render a loading indicator or temporary screen while waiting for data
                <View style={[styles.loadingContainer, styles.loadingContainerHorizontal]}>
                    <ActivityIndicator size="large" color={colors.headerColor} />
                </View>
            ) : (
                // Render actual content once data is loaded
                <>
                    <SubpageHeader
                        title={'Add Friends'}
                        backButtonFunction={cancel}
                        // backButtonStyle={{ color: colors.headerColor }}
                        // titleStyle={{ color: 'black' }}
                        rightSideButtonArray={
                            [
                                <TouchableOpacity onPress={saveHabit}>
                                    <Text style={[styles.topRightButtonText, { color: colors.headerColor }]}>Done</Text>
                                </TouchableOpacity>
                            ]
                        }
                    />
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container} pointerEvents='box-none'>
                            <View zIndex={1} style={styles.textInputPair}>
                                <Text style={[styles.labelText, theme == 'light' ? styles.lightText : styles.darkText]}>Username</Text>
                                <View style={styles.containerCenter}>
                                    <View style={styles.autocompleteContainer}>
                                        <Autocomplete
                                            data={findCategory(username)}
                                            flatListProps={{
                                                keyboardShouldPersistTaps: 'handled',
                                                keyExtractor: (_, idx) => idx.toString(),
                                                renderItem: ({ item }) => (
                                                    <TouchableOpacity style={styles.listItem} onPress={() => handleSelectCategory(item)}>
                                                        <Text style={styles.itemText}>{item}</Text>
                                                    </TouchableOpacity>
                                                ),
                                            }}
                                            hideResults={!isFocused}
                                            inputContainerStyle={styles.inputContainerStyle}
                                            containerStyle={flex = 1}
                                            listContainerStyle={styles.listContainer}
                                            renderTextInput={() => (
                                                <TextInput
                                                    defaultValue={username}
                                                    style={[styles.input, theme == 'light' ? styles.lightText : styles.darkText]}
                                                    placeholder="Select a username"
                                                    //placeholderTextColor={theme == 'light' ? colors.lightTextColor : colors.darkTextColor}
                                                    onFocus={() => setIsFocused(true)}
                                                    onBlur={() => setIsFocused(false)}
                                                    onTextInput={() => setIsFocused(true)}
                                                    onChangeText={(text) => setUsername(text)}
                                                    value={username}
                                                />
                                            )}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </>
            )}
        </View>
    );
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
        padding: 10,
        width: Dimensions.get('window').width,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerCenter: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    },
    listContainer: {
        borderColor: 'transparent',
        maxHeight: 300,
        zIndex: 6,
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 5,
    },
    listItem: {
        justifyContent: 'center',
        height: 30
    },
    itemText: {
        fontSize: 15,
        margin: 2,
    },
    inputContainerStyle: {
        borderColor: 'transparent'
    },
    input: {
        borderRadius: 25,
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        paddingRight: 10,
        paddingLeft: 20,
        justifyContent: 'center',
        color: 'white'
    },
    labelText: {
        marginBottom: 12,
        fontWeight: '700',
        color: 'white'
    },
    inputText: {
        color: 'white'
    },
    textInputPair: {
        height: 60,
        marginBottom: 30
    },
    topRightButtonText: {
        fontWeight: '700',
        fontSize: 18,
        //color: 'white'
    },
    day: {
        backgroundColor: 'red'
    },
    lightText: {
        color: colors.lightTextColor
    },
    darkText: {
        color: colors.darkTextColor
    }
});
export default AddFriends