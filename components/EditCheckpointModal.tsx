import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Alert,
  Keyboard,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import { router } from "expo-router";
import { auth } from "../FirebaseConfig";
import { useState } from "react";
import { useUserData } from "@/contexts/UserContext";

interface EditCheckpointModalProps {
  visible: boolean;
  onModalHide?: () => void;
  onClose: () => void;
  questID: string;
  checkpointID: string;
}

const EditCheckpointModal: React.FC<EditCheckpointModalProps> = ({
  visible,
  onClose,
  questID,
  checkpointID,
}) => {
  const colors = useTheme(); // used for themes, replaces colors import

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      width: "100%",
      flex: 0.92,
      backgroundColor: colors.bgPrimary,
      padding: 20,
      borderRadius: 10,
    },
    formContainer: {
      backgroundColor: colors.bgSecondary,
      width: "100%",
      borderRadius: 10,
      paddingBottom: 0,
      flexShrink: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: "center",
    },

    title: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 36,
      color: colors.text,
    },
    titleContainer: {
      backgroundColor: colors.bgQuaternary,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: "5%",
      borderRadius: 10,
      marginBottom: "2%",
    },
    inputContainer: {
      paddingLeft: "2%",
      paddingRight: "2%",
    },
    inputGroup: {
      marginBottom: 12,
    },
    inputLabel: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 18,
      color: colors.text,
      marginBottom: 2,
    },
    inputFieldName: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.textInput,
      paddingHorizontal: 10,
      backgroundColor: colors.bgPrimary,
      height: "14%",
      borderColor: colors.borderInput,
      borderWidth: 2,
      borderRadius: 6,
    },
    inputFieldDescription: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.textInput,
      paddingHorizontal: 10,
      backgroundColor: colors.bgPrimary,
      height: "36%",
      borderColor: colors.borderInput,
      borderWidth: 2,
      borderRadius: 6,
    },

    endButtons: {
      justifyContent: "flex-end",
    },
    createCancelContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    createCancelText: {
      fontFamily: "Metamorphous_400Regular",
      color: colors.textDark,
      fontSize: 20,
    },
    createButton: {
      width: "40%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgSecondary,
      borderRadius: 100,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
      padding: "3%",
      margin: "2%",
    },
    cancelButton: {
      width: "40%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.cancel,
      borderRadius: 100,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
      padding: "3%",
      margin: "2%",
    },
  });

  const { userData, editCheckpointDescription, editCheckpointName } =
    useUserData();
  const quest = userData?.quests?.find((quest) => quest.id === questID);
  const checkpoint = quest?.checkpoints?.find(
    (checkpoint) => checkpoint.id === checkpointID
  );
  const [checkpointName, setCheckpointName] = useState("");
  const [description, setDescription] = useState("");

  const editCheckpoint = () => {
    if (!checkpoint) {
      return;
    }
    // Check for that all fields are filled out properly.
    let error = false;
    let errors = [];

    if (checkpointName.trim() === "") {
      errors.push("Quest name cannot be blank");
      error = true;
    }
    const checkpointExists = quest?.checkpoints?.some(
      (checkpoint) =>
        checkpoint.name.toLowerCase() === checkpointName.trim().toLowerCase()
    );
    if (checkpointExists && checkpointName.trim() !== checkpoint.name) {
      errors.push("A Checkpoint with that name already exists");
      error = true;
    }

    if (error) {
      const errorMessage = errors.join(",\n") + ".";
      Alert.alert("Error!", errorMessage);
      return;
    }

    let edit = false;
    let edits = [];
    if (checkpointName.trim() !== checkpoint.name) {
      editCheckpointName(quest?.id || "", checkpoint.id, checkpointName.trim());

      edits.push('Name changed to "' + checkpointName.trim() + '"\n');
      edit = true;
    }
    if (description.trim() !== checkpoint.description) {
      editCheckpointDescription(
        quest?.id || "",
        checkpoint.id,
        description.trim()
      );

      if (description.trim() === "") {
        edits.push("Description was removed\n");
      } else {
        edits.push('Description changed to "' + description.trim() + '"\n');
      }
      edit = true;
    }
    if (edit) {
      const editMessage = edits.join("");
      Alert.alert("Sucess!", editMessage);
      onClose();
    } else {
      Alert.alert("Error!", "No edits were made.");
      return;
    }
  };

  useEffect(() => {
    if (checkpoint) {
      setCheckpointName(checkpoint.name);
      setDescription(checkpoint.description || "");
    }
  }, [checkpoint]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* TouchableWithoutFeedback to detect taps outside the modal. Also somewhat simulates slide to cancel for iOS. */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalContainer}>
              {/* ScrollView makes the form scrollable if it does not fit fully on a small screen */}
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.formContainer}>
                  {/* Title */}
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Edit Checkpoint</Text>
                  </View>

                  {/* Input */}
                  <View style={styles.inputContainer}>
                    {/* Checkpoint Name */}
                    <Text style={styles.inputLabel}>Checkpoint Name:</Text>
                    <TextInput
                      style={styles.inputFieldName}
                      placeholder="Checkpoint name..."
                      placeholderTextColor={colors.textPlaceholder}
                      autoCorrect={false}
                      value={checkpointName}
                      onChangeText={setCheckpointName}
                    />

                    {/* Description */}
                    <Text style={styles.inputLabel}>Description:</Text>
                    <TextInput
                      style={styles.inputFieldDescription}
                      placeholder="Description (optional)..."
                      placeholderTextColor={colors.textPlaceholder}
                      autoCorrect={true}
                      value={description}
                      onChangeText={setDescription}
                      multiline={true}
                    />
                  </View>
                </View>
              </ScrollView>
              {/* Create and Cancel Buttons */}
              <View style={styles.endButtons}>
                <View style={styles.createCancelContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setCheckpointName("");
                      setDescription("");
                      onClose();
                    }}
                  >
                    <Text style={styles.createCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => {
                      editCheckpoint();
                    }}
                  >
                    <Text style={styles.createCancelText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditCheckpointModal;
