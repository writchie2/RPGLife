import { router } from "expo-router";
import React, { useState } from "react";
import {Text, StyleSheet, TextInput, Button, TouchableOpacity, SafeAreaView, ScrollView, Pressable, View, Modal, TouchableWithoutFeedback} from "react-native";
import DatePickerComponent from "../components/DatePickerComponent";

import colors from "@/constants/colors";

// import Fonts
import { useFonts } from "expo-font";
import { Metamorphous_400Regular } from "@expo-google-fonts/metamorphous";
import { Alegreya_400Regular } from "@expo-google-fonts/alegreya";


import { useEffect } from "react";
import { BackHandler, Alert } from "react-native";
import { useUserData } from "@/contexts/UserContext";

interface CreateQuestModalProps {
  visible: boolean;
  onModalHide?: () => void;
  onClose: () => void;
}

const CreateQuestModal: React.FC<CreateQuestModalProps> = ({
  visible,
  onClose,
}) => {
  const [questName, setQuestName] = useState("");
  const [questDescription, setQuestDescription] = useState("");
  const [dueDate, setDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);

  // TODO: Set correct datatypes for these fields. Using "" as default for now
  const [difficulty, setDifficulty] = useState("");
  const [primarySkill, setPrimarySkill] = useState("");
  const [secondarySkill, setSecondarySkill] = useState("");
  const [repeatable, setRepeatable] = useState("");
  const [completionReward, setCompletionReward] = useState("");

  const userData = useUserData();
  
  const createQuest = () => {
        // Check to ensure quest has a name, description, and due date for now
        // TODO: add more checks for difficulty, primarySkill, and completionReward
        // other fields should be optional(?) so don't need to check for them 
    let error = false;
    let errors = [];

    if (questName.trim().length === 0 || questDescription.trim().length === 0 || !dateSelected) {
      error = true;
    }
    
    if (error) {
      Alert.alert("Error creating quest, please ensure every field is filled out correctly!");
      return;
    }
    
    userData.addQuest(questName, questDescription, dueDate, difficulty, primarySkill, secondarySkill, repeatable, completionReward);
  }

  return (
    <Modal
    animationType="none"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
    >
        
    <TouchableWithoutFeedback onPress={onClose}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Create Quest</Text>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Quest Name:</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Quest name..."
              placeholderTextColor={colors.textPlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
              value={questName}
              onChangeText={setQuestName}
            />
          </View>
                

        <View style={styles.inputGroup}>
        <View style={styles.inputGroupRowLeft}>
        <Text style={styles.inputLabel}>Description:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Description..."
            placeholderTextColor={colors.textPlaceholder}
            autoCapitalize="none"
            value={questDescription}
            onChangeText={setQuestDescription}
          />
        </View>
            
        <View style={styles.inputGroupRowRight}>
            <Text style={styles.inputLabel}>Due Date:</Text>
            <DatePickerComponent
              style={styles.inputDate}
              label="MM/DD/YYYY"
              dateSelected={dateSelected}
              onDateChange={(date: Date) => {
                setDate(date);
                setDateSelected(true);
              }}
            />
        </View>
        </View>
            
        <View style={styles.fitToText}>
        <Text style={styles.inputLabel}>Difficulty:</Text>
          {/* Buttons likely best method to establish difficulty. They don't do anything yet */}
          <TouchableOpacity style={styles.difficultyButton} onPress={() => Alert.alert('Congrats! You pressed the button! It doesnt do anything yet :)')}>
            <Text style={styles.difficultyButtonText}>Easy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.difficultyButton} onPress={() => Alert.alert('Congrats! You pressed the button! It doesnt do anything yet :)')}>
            <Text style={styles.difficultyButtonText}>Normal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.difficultyButton} onPress={() => Alert.alert('Congrats! You pressed the button! It doesnt do anything yet :)')}>
            <Text style={styles.difficultyButtonText}>Hard</Text>
          </TouchableOpacity>
        </View>
            
        <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Primary Skill:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Primary Skill..."
            placeholderTextColor={colors.textPlaceholder}
            value={primarySkill}
            onChangeText={setPrimarySkill}
          />
        </View>

        <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Secondary Skill:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Secondary Skill..."
            placeholderTextColor={colors.textPlaceholder}
            value={secondarySkill}
            onChangeText={setSecondarySkill}
          />
        </View>
                      
        <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Secondary Skill:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Secondary Skill..."
            placeholderTextColor={colors.textPlaceholder}
            value={secondarySkill}
            onChangeText={setSecondarySkill}
          />
        </View>

        <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Completion Reward:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Completion reawrd..."
            placeholderTextColor={colors.textPlaceholder}
            value={completionReward}
            onChangeText={setCompletionReward}
          />
        </View>

        </View>

        <TouchableOpacity style={styles.button} onPress={createQuest}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>

        </SafeAreaView>
    </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgPrimary, // main background color
    padding: 20,
  },
  title: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 36,
    color: colors.text,
  },
  logo: {
    height: 80,
    aspectRatio: 4.75, // maintains correct image width -> aspectRation = width/height
    marginTop: 36,
    marginBottom: 32,
  },
  form: {
    backgroundColor: colors.bgSecondary,
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    width: "90%",
    shadowColor: colors.shadowLight, // Shadow color
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  inputRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputGroupRowLeft: {
    width: "60%",
  },
  inputGroupRowRight: {
    width: "35%",
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
    // width: "35%", // handled by inputGroupRowRight style
  },
  button: {
    width: "56%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgSecondary,
    borderRadius: 100, // full rounded corners
    marginTop: 5,
    padding: 5,
    shadowColor: colors.shadow, // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  difficultyButton: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgSecondary,
    borderRadius: 100, // full rounded corners
    marginTop: 0,
    padding: 5,
    shadowColor: colors.shadow, // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  fitToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  buttonText: {
    fontFamily: "Metamorphous_400Regular",
    color: colors.textDark, // match title color, slightly darker due to being on darker bg
    fontSize: 20, // Slightly larger for emphasis
  },
  difficultyButtonText: {
    fontFamily: "Metamorphous_400Regular",
    color: colors.textDark, // match title color, slightly darker due to being on darker bg
    fontSize: 10, // Slightly larger for emphasis
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#c2c8a0",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a503d",
  },
});

export default CreateQuestModal;