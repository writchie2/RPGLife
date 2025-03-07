import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, TextInput, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import colors from "@/constants/colors";
import { router } from "expo-router";
import { auth } from '../FirebaseConfig';
import { useState } from "react";
import { useUserData } from '@/contexts/UserContext';

interface CreateSkillModalProps {
    visible: boolean
    onModalHide?: () => void
    onClose: () => void
}

const traits = [
    { label: 'Strength', value: 'strength' },
    { label: 'Vitality', value: 'vitality' },
    { label: 'Agility', value: 'agility' },
    { label: 'Stamina', value: 'stamina' },
    { label: 'Intelligence', value: 'intelligence' },
    { label: 'Charisma', value: 'charisma' },
  ];

const CreateSkillModal: React.FC<CreateSkillModalProps> = ({
    visible,
    onClose,

}) => {
    const [skillName, setSkillName] = useState("");
    const [description, setDescription] = useState("");
    const [primaryTrait, setPrimaryTrait] = useState("");
    const [secondaryTrait, setSecondaryTrait] = useState("");
    const [experience, setExperience] = useState("");

    const [isFocus, setIsFocus] = useState(false);
    const userData = useUserData();

    const createSkill = () => {

        let error = false;
        let errors = [];
        if (skillName === "")
        {
            errors.push("Skill Name cannot be blank");
            error = true;
        }
        if (primaryTrait === "")
        {
            errors.push("Must choose a primary trait");
            error = true;
        }
        if (experience === "")
        {
            errors.push("Must choose your starting experience");
            error = true;
        }
        if (error){
            const errorMessage = errors.join(",\n") + ".";
            Alert.alert("Please fill out all fields!", errorMessage);
            return;
        }
        
        userData.addSkill(skillName, description, primaryTrait, secondaryTrait, experience);
    }


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
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    
                    {/* Close Button */}
                
                    <Text style={styles.title}>Create Skill</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Skill Name:</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder="Skill name..."
                            placeholderTextColor={colors.textPlaceholder}
                            autoCorrect={false}
                            value={skillName}
                            onChangeText={setSkillName}
                        />
                        <TextInput
                            style={styles.inputField}
                            placeholder="Description (optional)..."
                            placeholderTextColor={colors.textPlaceholder}
                            autoCorrect={true}
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                        />
                        
                        <Text style={styles.inputLabel}>Primary Trait</Text>
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={traits}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select trait"  // Ensure the placeholder stays visible
                            value={primaryTrait}  // Allow it to be null initially
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setPrimaryTrait(item.value);
                                setIsFocus(false);
                            }}
                        />

                        <Text style={styles.inputLabel}>Secondary Trait (Optional)</Text>
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={traits}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Select trait' : '...'}
                            value={secondaryTrait}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setSecondaryTrait(item.value);
                                setIsFocus(false);
                            }}
                            />

                        <TouchableOpacity 
                            style={ experience ==="novice"?  styles.experienceButton: styles.experienceButtonPressed} 
                            onPress={() => { 
                            setExperience("novice");
                            }}
                        >
                            <Text>Novice</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={ experience ==="adept"?  styles.experienceButton: styles.experienceButtonPressed} 
                            onPress={() => { 
                            setExperience("adept");
                            }}
                        >
                            <Text>Adept</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={ experience ==="master"?  styles.experienceButton: styles.experienceButtonPressed} 
                            onPress={() => { 
                            setExperience("master");
                            }}
                        >
                            <Text>Master</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={ styles.createButton} 
                            onPress={() => {
                                createSkill();
                                onClose();
                            }}
                        >
                            <Text>Create</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={ styles.cancelButton} 
                            onPress={() =>{
                                setSkillName("");
                                setDescription("");
                                setPrimaryTrait("");
                                setSecondaryTrait("");
                                setExperience("");
                                onClose();
                            }}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={ styles.createButton} 
                            onPress={() => alert("name: " + skillName + " description: " + description + " primary: " + primaryTrait + " secondary: " + secondaryTrait + " exp: " + experience)}
                        >
                            <Text>Test</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.bgPrimary,
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    // Copied
    iconImage: {
        height: "60%",
        width: "60%",
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },

      //

    title: {
        fontFamily: "Metamorphous_400Regular",
        fontSize: 36,
        color: colors.text,
        margin: "10%",
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
    traitPicker: { 
        height: 50, 
        width: 200 
    },
    closeButton: {
        position: "absolute",
        top: 50,
        right: 50,
        backgroundColor: colors.bgSecondary,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: colors.shadow, 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButtonText: {
        //fontFamily: "Metamorphous_400Regular",
        color: colors.textDark, 
        fontSize: 20,
        //fontWeight: "bold",
    },
    experienceButton: {
        width: 200,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.bgSecondary,
        borderRadius: 100,
        shadowColor: colors.shadow, 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        height: 30,
        margin:"2%"   
    },
    experienceButtonPressed: {
        width: 200,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.bgPrimary,
        borderRadius: 100,
        shadowColor: colors.shadow, 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        height: 30,  
        margin:"2%" 
    },
    createButton: {
        width: 200,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.bgPrimary,
        borderRadius: 100,
        shadowColor: colors.shadow, 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        height: 30,  
        margin:"2%" 
    },
    cancelButton: {
        width: 200,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
        borderRadius: 100,
        shadowColor: colors.shadow, 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        height: 30,
        margin:"2%"  
    },
    
  });
  
export default CreateSkillModal;