import React, { useState, useEffect } from "react";
import { Alert, View, Text, TextInput, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../colors/colors";
import moment from "moment";
import "moment-timezone";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAuth } from "firebase/auth";

const JournalEntry = ({ selectedDate }) => {
  const [journalText, setJournalText] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedSelectedDate = moment(selectedDate).tz(userTimezone).format("YYYY-MM-DD");
  const theme = useColorScheme();
  const uid = getAuth().currentUser.uid;

  const handleChange = (text) => {
    setJournalText(text);
  };

  const handleSave = async () => {
    try {
      const currentDate = moment().tz(userTimezone).format("YYYY-MM-DD");
      if (formattedSelectedDate != currentDate) {
        Alert.alert(
          "Error creating journal entry",
          "You can only create new journal entries for the current day.",
          [
            {
              text: "OK",
            },
          ]
        );
        console.log("Cannot create a journal entry for the current date.");
        return;
      }

      const newEntry = {
        id: `${Date.now()}-${Math.random()}`,
        text: journalText,
      };
      const entryDate = moment(new Date(parseInt(newEntry.id))).tz(userTimezone).format("YYYY-MM-DD");

      const storedEntries = await AsyncStorage.getItem("journalEntries" + uid);
      let entries = storedEntries ? JSON.parse(storedEntries) : {};

      if (!entries[entryDate]) {
        entries[entryDate] = [];
      }

      entries[entryDate].push(newEntry);

      await AsyncStorage.setItem("journalEntries" + uid, JSON.stringify(entries));
      setJournalEntries(entries);

      setJournalText("");
      console.log(JSON.stringify(entries));
      console.log("Selected Date:", formattedSelectedDate);
      console.log("entry Date:", entryDate);
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  const handleDelete = async (entryId) => {
    Alert.alert(
      "Do you want to delete this journal entry?",
      "You cannot undo this action.",
      [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const storedEntries = await AsyncStorage.getItem("journalEntries" + uid);
              let entries = storedEntries ? JSON.parse(storedEntries) : {};

              entries[formattedSelectedDate] = entries[formattedSelectedDate].filter(
                (entry) => entry.id !== entryId
              );

              await AsyncStorage.setItem("journalEntries" + uid, JSON.stringify(entries));
              setJournalEntries(entries);
            } catch (error) {
              console.error("Error deleting journal entry:", error);
            }
          },
          style: 'destructive'
        },
      ]
    );

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem("journalEntries" + uid);
        if (storedEntries) {
          setJournalEntries(JSON.parse(storedEntries));
        }
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[theme == "light" ? styles.lightTheme : styles.darkTheme, styles.heading,]}>
          Daily Journal
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        multiline
        placeholder="What's going on today?"
        onChangeText={handleChange}
        value={journalText}
        style={styles.textInput}
      />

      <View style={styles.subheaderContainer}>
        <Text style={[theme == "light" ? styles.lightTheme : styles.darkTheme, styles.label,]}>
          Journal Entries:
        </Text>
      </View>

      <View>
        {journalEntries[formattedSelectedDate]?.map((entry) => (
          <View style={styles.entry} key={entry.id}>
            <Text style={[theme == "light" ? styles.lightTheme : styles.darkTheme, styles.entryText,]}>
              {entry.text}
            </Text>
            <View style={styles.entryDetails}>
              <Text style={[theme == "light" ? styles.lightTheme : styles.darkTheme, styles.dateText,]}>
                {new Date(parseInt(entry.id)).toLocaleTimeString()}
              </Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(entry.id)}>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  style={[theme == "light" ? styles.lightTheme : styles.darkTheme, styles.buttonText,]} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  subheaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    paddingTop: 15,
  },
  button: {
    backgroundColor: colors.specialButtonColor,
    padding: 10,
    borderRadius: 5,
    textAlign: "right",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  textInput: {
    height: 250,
    borderColor: colors.defaultButtonColor,
    backgroundColor: colors.defaultButtonColor,
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
  },
  entry: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderTopColor: "#ccc",
    marginBottom: 10,
    padding: 10,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryText: {
    fontSize: 16,
    width: 250,
  },
  dateText: {
    fontSize: 11,
    color: "gray",
    marginBottom: 4,
  },
  entryDetails: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: colors.specialButtonColor,
    padding: 5,
    borderRadius: 5,
  },
  lightTheme: {
    // backgroundColor: colors.appBackgroundColor,
    color: colors.darkBackgroundColor,
  },
  darkTheme: {
    // backgroundColor: colors.darkBackgroundColor,
    color: colors.appBackgroundColor,
  },
});

export default JournalEntry;
