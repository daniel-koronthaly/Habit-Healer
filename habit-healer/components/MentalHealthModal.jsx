import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../colors/colors';
import { getDatabase, getAuth, child, set, get, ref } from '../firebase/firebaseConfig';

const auth = getAuth();

const MentalHealthLogModal = ({ visible, onClose, onSendData, currentDate }) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [rating, setRating] = useState(3); // Default rating
  
  const handleRating = (value) => {
    setRating(value);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleLog = () => {
    const dbRef = getDatabase();
    adjustedDate = currentDate.replace(/\//g, '-');
    console.log(adjustedDate)
    console.log("Logged mental health rating:", rating);
    set(ref(dbRef, "mentalHealth/" + auth.currentUser.uid + "/" + adjustedDate), rating)
    onSendData();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Log Your Mental Health</Text>
          <Text style={styles.subtitle}>How are you feeling right now?</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>Low</Text>
            {[1, 2, 3, 4, 5].map((value, index) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.ratingButton,
                  value === rating && styles.selectedRatingButton,
                  index !== 0 && { marginLeft: 10 } // Adding space between buttons
                ]}
                onPress={() => handleRating(value)}
              >
                <Text style={styles.ratingButtonText}>{value}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.rating}>High</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logButton]}
              onPress={handleLog}
            >
              <Text style={styles.buttonText}>Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#252525',
    padding: 40,
    borderRadius: 20,
    width: '90%',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#404040',
  },
  selectedRatingButton: {
    backgroundColor: colors.darkLoginButtonColor,
  },
  ratingButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 50,
  },
  cancelButton: {
    backgroundColor: '#404040',
  },
  logButton: {
    backgroundColor: colors.darkLoginButtonColor,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  rating: {
    fontSize: 10,
    marginHorizontal: 8,
    textAlign: 'center',
    color: '#BBB',
  }
});

export default MentalHealthLogModal;
