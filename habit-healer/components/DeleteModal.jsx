import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../colors/colors';
import { getDatabase, auth, child, set, get, ref } from '../firebase/firebaseConfig';

const DeleteModal = ({ visible, onClose, onDelete, selectedHabit }) => {
  console.log(selectedHabit)
  const handleCancel = () => {
    onClose();
  };

  async function handleDelete() {
    try {
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, "habits/" + auth.currentUser.uid + "/" + selectedHabit.category + "/habitList/"))
      if (snapshot.exists()) {
        const numChildren = Object.keys(snapshot.val()).length;
        if (numChildren === 1) {
          await set(child(dbRef, "habits/" + auth.currentUser.uid + "/" + selectedHabit.category), null)
        }
        else {
          await set(child(dbRef, "habits/" + auth.currentUser.uid + "/" + selectedHabit.category + "/habitList/" + selectedHabit.habitName), null)
        }
      }


      console.log("Deleted:", selectedHabit.habitName);
      onDelete();
    }
    catch (error) {
      console.error("An error occurred while deleting: ", error);
    }
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
          <Text style={styles.title}>Delete {selectedHabit.habitName}</Text>
          <Text style={styles.subtitle}>Are you sure you want to delete this habit?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Delete</Text>
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
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default DeleteModal;
