import { router } from "expo-router";
import React, { useState } from "react";
import {Text, StyleSheet, TextInput, Button, TouchableOpacity, SafeAreaView, ScrollView, Pressable, View, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform} from "react-native";
import { doc, updateDoc, onSnapshot, collection, query, addDoc } from 'firebase/firestore';
import {getDoc, getDocs} from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { auth } from "../FirebaseConfig"

import { fetchUserData } from "@/utils/firestoreUtils";
import DatePickerComponent from "../components/DatePickerComponent";

import { Dropdown } from 'react-native-element-dropdown';
import colors from "@/constants/colors";

// import Fonts
import { useFonts } from "expo-font";
import { Metamorphous_400Regular } from "@expo-google-fonts/metamorphous";
import { Alegreya_400Regular } from "@expo-google-fonts/alegreya";


import { useEffect } from "react";
import { BackHandler, Alert } from "react-native";
import { useUserData } from "@/contexts/UserContext";
import SkillsList from "./SkillsList";

interface CreateQuestModalProps {
  visible: boolean;
  onModalHide?: () => void;
  onClose: () => void;
}


const CreateQuestModal: React.FC<CreateQuestModalProps> = ({
  visible,
  onClose,
}) => {
  if (!auth.currentUser) {
        return;
      }

  const [questName, setQuestName] = useState("");
  const [questDescription, setQuestDescription] = useState("");
  const [dueDate, setDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);

  // TODO: Set correct datatypes for these fields. Using "" as default for now
  const [difficulty, setDifficulty] = useState("");
  const [primarySkill, setPrimarySkill] = useState("");
  const [secondarySkill, setSecondarySkill] = useState("");
  const [repeatable, setRepeatable] = useState(false);
  const [completionReward, setCompletionReward] = useState("");
  const [isFocusPrimary, setIsFocusPrimary] = useState(false);
  const [isFocusSecondary, setIsFocusSecondary] = useState(false);
  const userData = useUserData();
  const skills = userData.userData?.skills || []
  
  
  const createQuest = async () => {
        // Check to ensure quest has a name, description, and due date for now
        // TODO: add more checks for difficulty, primarySkill, and completionReward
        // other fields should be optional(?) so don't need to check for them 
    let error = false;
    let errors = [];
    
    if (questName.trim() === "")
    {
        errors.push("Quest name cannot be blank");
        error = true;
    }
    const questExists = userData.userData?.quests?.some(quest => quest.name.toLowerCase() === questName.trim().toLowerCase());
    if (questExists)
    {
        errors.push("A quest with that name already exists");
        error = true;
    }
    if (primarySkill === "")
    {
        errors.push("Must choose a primary skill");
        error = true;
    }
    if (difficulty === "")
    {
        errors.push("Must choose the difficulty");
        error = true;
    }
    if (completionReward.trim() === "")
    {
        errors.push("Must choose a completion reward");
        error = true;
    }
    if (error){
        const errorMessage = errors.join(",\n") + ".";
        Alert.alert("Error!", errorMessage);
        return;
    }
    
    userData.addQuest(questName, questDescription, dueDate, difficulty, primarySkill, secondarySkill, repeatable, completionReward);
    setQuestName("");
    setQuestDescription("");
    setPrimarySkill("");
    setSecondarySkill("");
    setDateSelected(false);
    setDifficulty("");
    setRepeatable(false);
    setCompletionReward("")
    onClose();
  }

  return (
    <Modal
    animationType="none"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
    >
    {/* TouchableWithoutFeedback to detect taps outside the modal. Also somewhat simulates slide to cancel for iOS. */}    
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay} >
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
                  <Text style={styles.title}>Create Quest</Text>
                </View>

                {/* Input */}
                <View style={styles.inputContainer}>

                    {/* Quest Name */}
                    <Text style={styles.inputLabel}>Quest Name:</Text>
                      <TextInput
                        style={styles.inputFieldName}
                        placeholder="Quest name..."
                        placeholderTextColor={colors.textPlaceholder}
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
                  <View style={styles.rowGroup}>
                    <View style={styles.rowLeft}>
                      <Text style={styles.rowLabel}>Due Date:</Text>
                    </View>
                    <View style={styles.rowRight}>
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

                {/* Difficulty Selector */}  
                <View style={styles.difficultyButtonContainer}>
                  <Text style={styles.difficultyLabel}>Difficulty:</Text>
                  {/* Buttons likely best method to establish difficulty */}
                  <TouchableOpacity style={ difficulty === "Easy"? styles.difficultyButtonPressed : styles.difficultyButton} onPress={() => 
                    setDifficulty("Easy")
                    }>
                    <Text style={styles.difficultyButtonText}>Easy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={ difficulty === "Normal"? styles.difficultyButtonPressed : styles.difficultyButton} onPress={() => 
                    setDifficulty("Normal")
                    }>
                    <Text style={styles.difficultyButtonText}>Normal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={ difficulty === "Hard"? styles.difficultyButtonPressed : styles.difficultyButton} onPress={() => 
                    setDifficulty("Hard")
                    }>
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
                          ? { borderColor: colors.borderInput, backgroundColor: colors.bgQuaternary } // Color when focused
                          : { backgroundColor: colors.bgPrimary }, // Color when not focused
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      containerStyle={{ backgroundColor: colors.bgPrimary }}
                      itemTextStyle={{ fontFamily: "Metamorphous_400Regular", }}
                      iconStyle={styles.iconStyle}
                      data={skills}
                      maxHeight={300}
                      labelField="name"
                      valueField="name"
                      placeholder="Select Skill"  
                      value={primarySkill} 
                      onFocus={() => setIsFocusPrimary(true)}
                      onBlur={() => setIsFocusPrimary(false)}
                      onChange={item => {
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
                          ? { borderColor: colors.borderInput, backgroundColor: colors.bgQuaternary } // Color when focused
                          : { backgroundColor: colors.bgPrimary }, // Color when not focused
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      containerStyle={{ backgroundColor: colors.bgPrimary }}
                      itemTextStyle={{ fontFamily: "Metamorphous_400Regular", }}
                      iconStyle={styles.iconStyle}
                      data={skills}
                      maxHeight={300}
                      labelField="name"
                      valueField="name"
                      placeholder="(Optional)"  
                      value={secondarySkill} 
                      onFocus={() => setIsFocusSecondary(true)}
                      onBlur={() => setIsFocusSecondary(false)}
                      onChange={item => {
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
                    <TouchableOpacity style={ repeatable === true? styles.difficultyButtonPressed : styles.difficultyButton} onPress={() => {
                      if (repeatable){
                        setRepeatable(false);
                      }
                      else{
                        setRepeatable(true);
                      }
                      }}>
                      <Text style={styles.difficultyButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Checkpoint Button */} 
                <View style={styles.rowGroup}>
                  <View style={styles.rowLeft}> 
                    <Text style={styles.rowLabel}>CheckPoint</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <TouchableOpacity style={styles.difficultyButton} onPress={() => {
                      alert("This button will make checkpoints once implemented");
                      }}>
                      <Text style={styles.difficultyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Completion Reward */}  
                <Text style={[styles.inputLabel, {borderTopWidth : 1, marginTop: 10, paddingTop: 10}]}>Completion Reward:</Text>
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
                style={ styles.cancelButton} 
                onPress={() =>{
                    setQuestName("");
                    setQuestDescription("");
                    setPrimarySkill("");
                    setSecondarySkill("");
                    setDateSelected(false);
                    setDifficulty("");
                    setRepeatable(false);
                    setCompletionReward("")
                    onClose();
                }}
              >
                <Text style={styles.createCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.createButton} onPress={createQuest}>
                <Text style={styles.createCancelText}>Create</Text>
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
    flex: .92,
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
    paddingRight: "2%"
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
    borderRadius:10,
    marginBottom:"2%"
    },
  title: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 36,
    color: colors.text,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    flex: 1,
    backgroundColor: colors.textInput,        
  },
  rowGroup: {
    flexDirection: 'row',  
    alignItems: 'center',  
    marginTop: "1%",
    width:"100%",
    justifyContent: 'space-between',
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
  endButtons:{
    justifyContent: "flex-end",
     
  },
  createCancelContainer: {
    flexDirection: 'row',
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
    margin:"2%",
    padding:"3%", 
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
    padding:"3%",
    margin:"2%"  
  },
  difficultyButtonContainer: {
    flexDirection: 'row',  
    alignItems: 'center',
  },
  difficultyLabel: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 18,
    color: colors.text,
    width: "40%"
    
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
    margin:"2%"   
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
    margin:"2%" 
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

export default CreateQuestModal;