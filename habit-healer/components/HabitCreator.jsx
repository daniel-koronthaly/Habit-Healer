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
    Switch
} from 'react-native';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';
import { colors } from '../colors/colors';
import Autocomplete from 'react-native-autocomplete-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DaySelector from './DaySelector';
import SubpageHeader from './SubpageHeader';
import { weekdays } from 'moment';
const auth = getAuth();

const HabitCreator = () => {
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [isFocused, setIsFocused] = useState(false)

    const [habitName, setHabitName] = useState('')

    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);

    const [shareWithFriends, setShareWithFriends] = useState(false)
    const toggleSwitch = () => setShareWithFriends(previousState => !previousState);
    const [weekdays, setWeekdays] = React.useState([])

    const uid = auth.currentUser.uid;


    useEffect(() => {
        const dbRef = ref(getDatabase());


        get(child(dbRef, "habits/" + auth.currentUser.uid))
            .then(snapshot => {
                const data = snapshot.val()
                if (data && Object.keys(data).length > 0) {
                    const categories = Object.keys(data);
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
        setCategory(category);
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
        // set screen to habit overview
    }

    function checkSavable() {
        let savable = true;
        let errorMessage = '';
        if (category === '') {
            savable = false;
            errorMessage += "You must give a category for this habit.\n"
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

    async function saveHabit() {
        if (checkSavable()) {
            setWeekdays(weekdays.sort())
            const dbRef = getDatabase();
            const habit = {
                "notificationTime": selectedTime,
                "weekdays": weekdays,
                "sharesWithFriends": shareWithFriends
            }
            set(ref(dbRef, "habits/" + auth.currentUser.uid + "/" + category), habit).then(() => {
                Alert.alert(
                    "Added new habit",
                    [
                        {
                            text: "OK",
                        },
                    ]
                );
            }).catch((error) => {
                console.log("Failed to write habit to database " + error);
            });
        }
    }

    return (
        <View>
            {loadingCategories ? (
                // Render a loading indicator or temporary screen while waiting for data
                <View style={[styles.loadingContainer, styles.loadingContainerHorizontal]}>
                    <ActivityIndicator size="large" color={colors.headerColor} />
                </View>
            ) : (
                // Render actual content once data is loaded
                <>
                    <SubpageHeader
                        title={'Add Habit'}
                        backButtonFunction={cancel}
                        rightSideButtonArray={
                            [
                                <TouchableOpacity onPress={cancel}>
                                    <Text style={styles.topRightButtonText}>Cancel</Text>
                                </TouchableOpacity>,

                                <TouchableOpacity onPress={saveHabit}>
                                    <Text style={[styles.topRightButtonText, { color: colors.headerColor }]}>Done</Text>
                                </TouchableOpacity>
                            ]
                        }
                    />
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container} pointerEvents='box-none'>
                            <View zIndex={1} style={styles.textInputPair}>
                                <Text style={styles.labelText}>Habit Category</Text>
                                <View style={styles.containerCenter}>
                                    <View style={styles.autocompleteContainer}>
                                        <Autocomplete
                                            data={findCategory(category)}
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
                                            containerStyle={flex = 1}
                                            listContainerStyle={styles.listContainer}
                                            renderTextInput={() => (
                                                <TextInput
                                                    defaultValue={category}
                                                    style={styles.input}
                                                    placeholder="Select a category"
                                                    onFocus={() => setIsFocused(true)}
                                                    onBlur={() => setIsFocused(false)}
                                                    onTextInput={() => setIsFocused(true)}
                                                    onChangeText={(text) => setCategory(text)}
                                                    value={category}
                                                />
                                            )}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.textInputPair}>
                                <Text style={styles.labelText}>Habit Name</Text>
                                <View style={styles.containerCenter}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Set Habit Name"
                                        onChangeText={setHabitName}
                                        value={habitName}
                                    />
                                </View>
                            </View>
                            <View style={styles.textInputPair}>
                                <Text style={styles.labelText}>Set Time</Text>
                                <View style={styles.containerCenter}>
                                    <TouchableOpacity style={styles.input} onPress={showTimePicker}>
                                        <View style={styles.rowContainer}>
                                            <Text style={styles.inputText}>Set Time</Text>
                                            {selectedTime && <Text style={styles.inputText}>{selectedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePickerModal
                                    isVisible={isTimePickerVisible}
                                    mode="time"
                                    onConfirm={handleTimeConfirm}
                                    onCancel={hideTimePicker}
                                />

                            </View>
                            <View style={styles.textInputPair}>
                                <Text style={styles.labelText}>Make Public</Text>
                                <View style={styles.containerCenter}>
                                    <TouchableOpacity style={styles.input} onPress={toggleSwitch}>
                                        <View style={styles.rowContainer}>
                                            <Text style={styles.inputText}>Make Habit Public</Text>
                                            <View justifyContent={'center'}>
                                                <Switch
                                                    value={shareWithFriends}
                                                    trackColor={{ true: colors.headerColor }}
                                                    disabled={true}
                                                />
                                            </View>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.textInputPair}>
                                <Text style={styles.labelText}>Choose Days</Text>
                                <View style={styles.containerCenter}>
                                    <DaySelector
                                        weekdays={weekdays}
                                        setWeekdays={setWeekdays}
                                        activeColor={colors.headerColor}
                                        textColor='white'
                                        inactiveColor='grey'
                                    />
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
        width: 330,
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
        color: 'white'
    },
    day: {
        backgroundColor: 'red'
    }
});
export default HabitCreator