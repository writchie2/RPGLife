import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Pressable,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { auth } from "../FirebaseConfig";
import DatePickerComponent from "../components/DatePickerComponent";

import { Dropdown } from "react-native-element-dropdown";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import { useUserData } from "@/contexts/UserContext";

interface EditQuestModalProps {
  visible: boolean;
  onModalHide?: () => void;
  onClose: () => void;
  id: string;
}
/*
    TODO:
    Implement edit quest functionality
    styling?
    */

const EditQuestModal: React.FC<EditQuestModalProps> = ({
  visible,
  onClose,
  id,
}) => {
  const colors = useTheme(); // used for themes, replaces colors import

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    modalContainer: {
      flex: 0.92,
      width: "100%",
      backgroundColor: colors.bgPrimary,
      borderRadius: 10,
      padding: 20,
      justifyContent: "space-between",
    },
    formContainer: {
      width: "100%",
      backgroundColor: colors.bgSecondary,
      borderRadius: 10,
      paddingBottom: 50,
      flexShrink: 1,
    },
    inputContainer: {
      paddingLeft: "2%",
      paddingRight: "2%",
    },
    inputFieldName: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.textInput,
      paddingHorizontal: 10,
      backgroundColor: colors.bgPrimary,
      height: "8%",
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
      height: "16%",
      borderColor: colors.borderInput,
      borderWidth: 2,
      borderRadius: 6,
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
    title: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 36,
      color: colors.text,
    },
    dropdown: {
      height: 50,
      borderColor: "gray",
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      flex: 1,
      backgroundColor: colors.textInput,
    },
    rowGroup: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: "1%",
      width: "100%",
      justifyContent: "space-between",
    },
    rowLeft: {
      justifyContent: "flex-start",
      flex: 1,
    },
    rowRight: {
      justifyContent: "flex-end",
      flex: 1,
      flexDirection: "row",
    },
    rowLabel: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 18,
      color: colors.text,
      marginRight: 10,
    },

    inputLabel: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 18,
      color: colors.text,
      marginBottom: 2,
    },
    inputField: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.textInput,
      paddingHorizontal: 10,
      backgroundColor: colors.bgPrimary,
      height: 48,
      borderColor: colors.borderInput,
      borderWidth: 2,
      borderRadius: 6,
    },
    inputDate: {
      // DONE INSIDE DATE-PICKER-COMPONENT
      // fontFamily: "Alegreya_400Regular",
      // fontSize: 18,
      // color: colors.textInput,
      backgroundColor: colors.bgPrimary,
      height: 48,
      borderColor: colors.borderInput,
      borderWidth: 2,
      borderRadius: 6,
      paddingHorizontal: 10,
      alignItems: "center",
      width: "100%",
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
      margin: "2%",
      padding: "3%",
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
    difficultyButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    difficultyLabel: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 18,
      color: colors.text,
      width: "40%",
    },
    difficultyButton: {
      width: "15%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgPrimary,
      borderRadius: 5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
      height: 30,
      margin: "2%",
    },
    difficultyButtonPressed: {
      width: "15%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgQuaternary,
      borderRadius: 5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
      height: 30,
      margin: "2%",
    },
    difficultyButtonText: {
      fontFamily: "Metamorphous_400Regular",
      color: colors.textDark, // match title color, slightly darker due to being on darker bg
      fontSize: 10, // Slightly larger for emphasis
    },
    placeholderStyle: {
      fontSize: 16,
      color: colors.textInput,
      fontFamily: "Metamorphous_400Regular",
    },
    selectedTextStyle: {
      fontSize: 16,
      color: colors.textInput,
      fontFamily: "Metamorphous_400Regular",
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
  });

  if (!auth.currentUser) {
    return;
  }
  const {
    userData,
    editQuestName,
    editQuestDescription,
    editQuestSkills,
    editQuestRepeatable,
  } = useUserData();
  const quest = userData?.quests?.find((quest) => quest.id === id);

  const [questName, setQuestName] = useState("");
  const [questDescription, setQuestDescription] = useState("");
  const [dueDate, setDate] = useState<Date>(new Date());
  const [dateSelected, setDateSelected] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [primarySkill, setPrimarySkill] = useState("");
  const [secondarySkill, setSecondarySkill] = useState("");
  const [repeatable, setRepeatable] = useState(false);
  const [completionReward, setCompletionReward] = useState("");
  const [isFocusPrimary, setIsFocusPrimary] = useState(false);
  const [isFocusSecondary, setIsFocusSecondary] = useState(false);

  const skills = userData?.skills || [];

  const editQuest = () => {
    // Check to make sure the quest actually exists
    if (!quest) {
      return;
    }

    // Set up error handling to make sure every necessary field is filled out
    let error = false;
    let errors = [];

    if (questName.trim() === "") {
      errors.push("Quest name must not be blank");
      error = true;
    }

    if (primarySkill === "") {
      errors.push("Quest needs to have a primary skill selected");
      error = true;
    }

    if (primarySkill === secondarySkill && primarySkill !== "") {
      errors.push("Primary skill cannot be the same as secondary skill");
      error = true;
    }

    const questExists = userData?.quests?.some(
      (quest) => quest.name.toLowerCase() === questName.trim().toLowerCase()
    );
    if (questExists && questName.trim() !== quest.name) {
      errors.push("A quest with that name already exists");
      error = true;
    }

    // Set up edit handling in case a field is changed
    let edit = false;
    let edits = [];

    if (questName.trim() !== quest.name) {
      editQuestName(quest.id, questName.trim());

      edits.push('Quest name changed to "' + questName.trim() + '"\n');
      edit = true;
    }

    if (questDescription.trim() !== quest.description) {
      editQuestDescription(quest.id, questDescription.trim());

      // This might be a bad alert on account of potentially long quest descriptions
      if (questDescription.trim() === "") {
        edits.push("Description was removed\n");
      } else {
        edits.push(
          'Description changed to "' + questDescription.trim() + '"\n'
        );
      }
      edit = true;
    }

    if (
      primarySkill !== quest.primarySkill ||
      secondarySkill !== quest.secondarySkill
    ) {
      editQuestSkills(quest.id, primarySkill, secondarySkill);

      edits.push("Skills changed to " + primarySkill);
      if (secondarySkill !== "") {
        edits.push(" and " + secondarySkill);
      }
      edits.push("\n");
      edit = true;
    }

    if (repeatable !== quest.repeatable) {
      editQuestRepeatable(quest.id, repeatable);
      if (repeatable) {
        edits.push("Quest was made repeatable\n");
      } else {
        edits.push("Quest was made not repeatable\n");
      }

      edit = true;
    }

    if (edit) {
      const editMessage = edits.join("");
      Alert.alert("Quest has been edited", editMessage);
      onClose();
    } else {
      Alert.alert("No edits were made");
      return;
    }
  };

  useEffect(() => {
    if (quest) {
      setQuestName(quest.name);
      setQuestDescription(quest.description || "");
      setDate(quest.dueDate);
      setDifficulty(quest.difficulty);
      setPrimarySkill(quest.primarySkill);
      setSecondarySkill(quest.secondarySkill || "");
      setRepeatable(quest.repeatable);
      setCompletionReward(quest.reward);
    }
  }, [quest]);

  useEffect(() => {
    if (primarySkill == null) {
      setPrimarySkill("");
    }
  }, [primarySkill]);

  useEffect(() => {
    if (secondarySkill == null) {
      setSecondarySkill("");
    }
  }, [secondarySkill]);

  return (
    <Modal
      animationType="none"
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
                    <Text style={styles.title}>Edit Quest</Text>
                  </View>

                  {/* Input */}
                  <View style={styles.inputContainer}>
                    {/* Quest Name */}
                    <Text style={styles.inputLabel}>Quest Name:</Text>
                    <TextInput
                      style={styles.inputFieldName}
                      //placeholder="Quest name..."
                      //placeholderTextColor={colors.textPlaceholder}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={questName}
                      onChangeText={setQuestName}
                    />

                    {/* Description */}
                    <Text style={styles.inputLabel}>Description:</Text>
                    <TextInput
                      style={styles.inputFieldDescription}
                      placeholder="Description (optional)..."
                      placeholderTextColor={colors.textPlaceholder}
                      autoCorrect={true}
                      value={questDescription}
                      onChangeText={setQuestDescription}
                      multiline={true}
                    />

                    {/* Due Date */}
                    {/* Maybe delete this field since we don't want people to be able to edit dueDate? */}
                    <View style={styles.rowGroup}>
                      <View style={styles.rowLeft}>
                        <Text style={styles.rowLabel}>Due Date:</Text>
                      </View>
                      <View style={styles.rowRight} pointerEvents="none">
                        <DatePickerComponent
                          style={styles.inputDate}
                          label={dueDate.toDateString()}
                          dateSelected={dateSelected}
                          onDateChange={(date: Date) => {
                            setDate(date);
                            setDateSelected(true);
                          }}
                        />
                      </View>
                    </View>

                    {/* Difficulty Selector */}
                    {/* Also maybe delete this field since we don't want people to be able to edit difficulty either? */}
                    <View style={styles.difficultyButtonContainer}>
                      <Text style={styles.difficultyLabel}>Difficulty:</Text>
                      {/* Buttons likely best method to establish difficulty */}
                      <TouchableOpacity
                        style={
                          difficulty === "Easy"
                            ? styles.difficultyButtonPressed
                            : styles.difficultyButton
                        }
                        onPress={() => setDifficulty("Easy")}
                      >
                        <Text style={styles.difficultyButtonText}>Easy</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={
                          difficulty === "Normal"
                            ? styles.difficultyButtonPressed
                            : styles.difficultyButton
                        }
                        onPress={() => setDifficulty("Normal")}
                      >
                        <Text style={styles.difficultyButtonText}>Normal</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={
                          difficulty === "Hard"
                            ? styles.difficultyButtonPressed
                            : styles.difficultyButton
                        }
                        onPress={() => setDifficulty("Hard")}
                      >
                        <Text style={styles.difficultyButtonText}>Hard</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Primary Skill */}
                    <View style={styles.rowGroup}>
                      <View style={styles.rowLeft}>
                        <Text style={styles.rowLabel}>Primary Skill:</Text>
                      </View>
                      <View style={styles.rowRight}>
                        <Dropdown
                          style={[
                            styles.dropdown,
                            isFocusPrimary
                              ? {
                                  borderColor: colors.borderInput,
                                  backgroundColor: colors.bgQuaternary,
                                } // Color when focused
                              : { backgroundColor: colors.bgPrimary }, // Color when not focused
                          ]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          containerStyle={{ backgroundColor: colors.bgPrimary }}
                          itemTextStyle={{
                            fontFamily: "Metamorphous_400Regular",
                            color: colors.textInput
                          }}
                          iconStyle={styles.iconStyle}
                          data={[{ label: "None", value: null }, ...skills]}
                          maxHeight={300}
                          labelField="name"
                          valueField="name"
                          placeholder="Select Skill"
                          value={primarySkill}
                          onFocus={() => setIsFocusPrimary(true)}
                          onBlur={() => setIsFocusPrimary(false)}
                          onChange={(item) => {
                            setPrimarySkill(item.name);
                            setIsFocusPrimary(false);
                          }}
                        />
                      </View>
                    </View>

                    {/* Secondary Skill */}
                    <View style={styles.rowGroup}>
                      <View style={styles.rowLeft}>
                        <Text style={styles.rowLabel}>Secondary Skill:</Text>
                      </View>
                      <View style={styles.rowRight}>
                        <Dropdown
                          style={[
                            styles.dropdown,
                            isFocusSecondary
                              ? {
                                  borderColor: colors.borderInput,
                                  backgroundColor: colors.bgQuaternary,
                                } // Color when focused
                              : { backgroundColor: colors.bgPrimary }, // Color when not focused
                          ]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          containerStyle={{ backgroundColor: colors.bgPrimary }}
                          itemTextStyle={{
                            fontFamily: "Metamorphous_400Regular",
                            color: colors.textInput
                          }}
                          iconStyle={styles.iconStyle}
                          data={[{ label: "None", value: null }, ...skills]}
                          maxHeight={300}
                          labelField="name"
                          valueField="name"
                          placeholder="(Optional)"
                          value={secondarySkill}
                          onFocus={() => setIsFocusSecondary(true)}
                          onBlur={() => setIsFocusSecondary(false)}
                          onChange={(item) => {
                            setSecondarySkill(item.name);
                            setIsFocusSecondary(false);
                          }}
                        />
                      </View>
                    </View>

                    {/* Repeatable Button */}
                    <View style={styles.rowGroup}>
                      <View style={styles.rowLeft}>
                        <Text style={styles.rowLabel}>Repeatable</Text>
                      </View>
                      <View style={styles.rowRight}>
                        <TouchableOpacity
                          style={
                            repeatable === true
                              ? styles.difficultyButtonPressed
                              : styles.difficultyButton
                          }
                          onPress={() => {
                            if (repeatable) {
                              setRepeatable(false);
                            } else {
                              setRepeatable(true);
                            }
                          }}
                        >
                          <Text style={styles.difficultyButtonText}>X</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Completion Reward */}
                    <Text
                      style={[
                        styles.inputLabel,
                        { borderTopWidth: 1, marginTop: 10, paddingTop: 10 },
                      ]}
                    >
                      Completion Reward:
                    </Text>
                    <TextInput
                      style={styles.inputField}
                      placeholder="Completion reward..."
                      placeholderTextColor={colors.textPlaceholder}
                      value={completionReward}
                      onChangeText={setCompletionReward}
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
                      onClose();
                    }}
                  >
                    <Text style={styles.createCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => {
                      editQuest();
                      //alert("You chose edit quest");
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

export default EditQuestModal;
