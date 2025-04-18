// components/EditUsernameModal.tsx
import React, { useState } from "react";
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../FirebaseConfig";
import colors from "@/constants/colors";

export default function EditUsernameModal({ visible, onClose, currentUsername }: any) {
  const [newUsername, setNewUsername] = useState(currentUsername);

  const handleUpdateUsername = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: newUsername,
      });

      // Update Firestore if you store usernames there
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { username: newUsername });

      Alert.alert("Success", "Username updated!");
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert("Error", "Could not update username.");
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Edit Username</Text>
          <TextInput
            style={styles.input}
            value={newUsername}
            onChangeText={setNewUsername}
            placeholder="Enter new username"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdateUsername} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.bgPrimary,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    elevation: 10,
  },
  title: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 20,
    marginBottom: 10,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderInput,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: colors.text,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: colors.bgTertiary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "bold",
  },
});
