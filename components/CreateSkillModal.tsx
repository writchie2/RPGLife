import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, TextInput, Alert, Keyboard, ScrollView } from 'react-native';
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
    { label: 'Strength', value: 'Strength' },
    { label: 'Vitality', value: 'Vitality' },
    { label: 'Agility', value: 'Agility' },
    { label: 'Stamina', value: 'Stamina' },
    { label: 'Intelligence', value: 'Intelligence' },
    { label: 'Charisma', value: 'Charisma' },
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

    const [isFocusPrimary, setIsFocusPrimary] = useState(false);
    const [isFocusSecondary, setIsFocusSecondary] = useState(false);
    const userData = useUserData();

    // Function validates input and will call the "addSkill" function that exists in UserContext.tsx
    // Errors will appear if name is blank, name is not unique, a primary trait isn't selected,
    // or if starting exp isn't selected
    const createSkill = () => {

        let error = false;
        let errors = [];
        if (skillName.trim() === "")
        {
            errors.push("Skill name cannot be blank");
            error = true;
        }
        const skillExists = userData.userData?.skills?.some(skill => skill.name.toLowerCase() === skillName.trim().toLowerCase());
        if (skillExists)
        {
            errors.push("A skill with that name already exists");
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
            Alert.alert("Error!", errorMessage);
            return;
        }
        
        userData.addSkill(skillName.trim(), description.trim(), primaryTrait, secondaryTrait, experience);
        setSkillName("");
        setDescription("");
        setPrimaryTrait("");
        setSecondaryTrait("");
        setExperience("");
        onClose();
    }


    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          {/* TouchableWithoutFeedback to detect taps outside the modal. Also somewhat simulates slide to cancel for iOS. */}
          <TouchableWithoutFeedback  onPress={onClose}>
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
                                <Text style={styles.title}>Create Skill</Text>
                            </View>

                            {/* Input */}
                            <View style={styles.inputContainer}>
                                
                                {/* Skill Name */}
                                <Text style={styles.inputLabel}>Skill Name:</Text>
                                <TextInput
                                    style={styles.inputFieldName}
                                    placeholder="Skill name..."
                                    placeholderTextColor={colors.textPlaceholder}
                                    autoCorrect={false}
                                    value={skillName}
                                    onChangeText={setSkillName}
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

                                {/* Primary Trait */}
                                <View style={styles.traitGroup}>
                                    <View style={styles.traitLeft}>
                                        <Text style={styles.traitLabel}>Primary Trait:</Text>
                                    </View>
                                    <View style={styles.traitRight}>
                                        <Dropdown
                                            style={[
                                                styles.dropdown,
                                                isFocusPrimary
                                                ? { borderColor: colors.borderInput, backgroundColor: colors.bgQuaternary } // Color when focused
                                                : { backgroundColor: colors.bgPrimary }, // Color when not focused
                                            ]}
                                            placeholderStyle={styles.placeholderStyle}
                                            containerStyle={{ backgroundColor: colors.bgPrimary }}
                                            itemTextStyle={{ fontFamily: "Metamorphous_400Regular", }}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={traits}
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select trait"  
                                            value={primaryTrait}
                                            onFocus={() => setIsFocusPrimary(true)}
                                            onBlur={() => setIsFocusPrimary(false)}
                                            onChange={item => {
                                                setPrimaryTrait(item.value);
                                                setIsFocusPrimary(false);
                                            }}
                                        />
                                    </View>
                                </View>
                                
                                {/* Secondary Trait */}
                                <View style={styles.traitGroup}>
                                    <View style={styles.traitLeft}>
                                        <Text style={styles.traitLabel}>Secondary Trait:</Text>
                                    </View>
                                    <View style={styles.traitRight}>
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
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={traits}
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={'(Optional)'}
                                            value={secondaryTrait}
                                            onFocus={() => setIsFocusSecondary(true)}
                                            onBlur={() => setIsFocusSecondary(false)}
                                            onChange={item => {
                                                setSecondaryTrait(item.value);
                                                setIsFocusSecondary(false);
                                            }}
                                            />
                                        </View>
                                </View>

                                {/* Expereicne Buttons */}
                                <View style={styles.experienceButtonContainer}>
                                    <Text style={styles.expereinceLabel}>Experience:</Text>
                                    <TouchableOpacity 
                                        style={ experience ==="novice"?  styles.experienceButtonPressed : styles.experienceButton} 
                                        onPress={() => { 
                                        setExperience("novice");
                                        }}
                                    >
                                        <Text>Novice</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={ experience ==="adept"?  styles.experienceButtonPressed : styles.experienceButton} 
                                        onPress={() => { 
                                        setExperience("adept");
                                        }}
                                    >
                                        <Text>Adept</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={ experience ==="master"?  styles.experienceButtonPressed : styles.experienceButton} 
                                        onPress={() => { 
                                        setExperience("master");
                                        }}
                                    >
                                        <Text>Master</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>

                        
                    </ScrollView>
                    {/* Create and Cancel Buttons */}
                    <View style={styles.endButtons}>
                        <View style={styles.createCancelContainer}>
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
                                <Text style={styles.createCancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={ styles.createButton} 
                                onPress={() => {
                                    createSkill();
                                }}
                            >
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
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.bgPrimary, 
        justifyContent: "flex-end",
        alignItems: "center",
    },
    modalContainer: {
        width: "100%",
        flex: .92,
        backgroundColor: colors.bgPrimary,
        padding: 20,
        borderRadius: 10,
    },
    formContainer: {
        backgroundColor:colors.bgSecondary,
        width: "100%",
        borderRadius:10,
        paddingBottom:0,
        flexShrink: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
      },

    traitGroup: {
        flexDirection: 'row',  
        alignItems: 'center',  
        marginTop: "1%",
      },
    traitLeft: {
        justifyContent: "flex-start",
        flex: 1, 
    },
    traitRight: {
        justifyContent: "flex-end",
        flex: 1,
        flexDirection: "row",
    },
    traitLabel: {
        fontFamily: "Metamorphous_400Regular",
        fontSize: 18,
        color: colors.text,
        marginRight: 10,  
        
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
      icon: {
        marginRight: 5,
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
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
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
        borderRadius:10,
        marginBottom:"2%"
    },
    inputContainer: {
        paddingLeft: "2%",
        paddingRight: "2%"
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
        height: "12%",
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
        height: "24%",
        borderColor: colors.borderInput,
        borderWidth: 2,
        borderRadius: 6,
    },
    traitPicker: { 
        height: 50, 
        width: 200 
    },
    experienceButtonContainer: {
        flexDirection: 'row',  
        alignItems: 'center',
    },
    expereinceLabel: {
        fontFamily: "Metamorphous_400Regular",
        fontSize: 18,
        color: colors.text,
        width: "40%"
        
    },
    experienceButton: {
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
    experienceButtonPressed: {
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
        padding:"3%",  
        margin:"2%" 
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
    
  });
  
export default CreateSkillModal;