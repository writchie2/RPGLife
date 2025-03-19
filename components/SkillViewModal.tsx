
import React, { useState } from "react";
import {Text, StyleSheet, TouchableOpacity, ScrollView, View, Modal, TouchableWithoutFeedback, Keyboard, Alert} from "react-native";
import calcEXP from "@/utils/calcEXP";
import colors from "@/constants/colors";


import { useEffect } from "react";

import { useUserData } from "@/contexts/UserContext";
import EditSkillModal from "./EditSkillModal";

interface SkillViewModalProps {
    visible: boolean;
    onModalHide?: () => void;
    onClose: () => void;
    id: string;
  }

/*
TODO:
Implement archive skill button functionality
styling
*/
const SkillViewModal: React.FC<SkillViewModalProps> = ({
visible,
onClose,
id,
}) => {

    const { userData, archiveSkill, activateSkill } = useUserData();
    const skill = userData?.skills?.find(skill => skill.id === id);
    const [skillEditVisible, setSkillEditVisible] = useState(false);
    const [skillID, setSkillID] = useState("");
    

    const archiveHandler = () => {
        const matchingQuests = userData?.quests ? userData.quests.filter(
            (quest) => (quest.primarySkill === skill?.name && quest.active)|| (quest.secondarySkill === skill?.name && quest.active)
        ): [];
        if (matchingQuests.length > 0) {
            let activeQuests = [];
            activeQuests.push("There are quests active with this skill:\n\n");
            matchingQuests.map((quest, index) => (
                activeQuests.push(`${index + 1}: ${quest.name}\n`)
            ));
            activeQuests.push("\nPlease complete these quests or delete them.");
            const questMessage = activeQuests.join("");
            Alert.alert("Error!", questMessage);
        } else {
            if(skill){
                archiveSkill(skill.id);
                onClose();
            }
                
        }
    };
    const activateHandler = () => {
        if(skill){
            activateSkill(skill.id);
            onClose();
        }
    };

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
                                <View style={styles.questContainer}>
                                    {/* Title */}
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.titleText}>{skill?.name}</Text>
                                    </View>
                                    <View style={styles.descriptionContainer}>
                                        <Text style={styles.descriptionText}>{skill?.description}</Text>
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.fieldText}>Traits: {skill?.primaryTrait}{skill?.secondaryTrait && `, ${skill?.secondaryTrait}`}</Text>
                                    </View>
                                    <View style={styles.expBar}>
                                        <View
                                        style={{
                                            height: "100%",
                                            width: `${
                                            (calcEXP(skill?.exp || 0).progressEXP / calcEXP(skill?.exp || 1).neededEXP) *
                                            100
                                            }%`,
                                            backgroundColor: colors.text,
                                            borderRadius: 99,
                                        }}
                                        ></View>
                                    </View>
                                    <Text style={styles.expTrait}>
                                    Level {calcEXP(skill?.exp || 0).level}
                                    </Text>
                                    <Text style={styles.expTrait}>
                                    {calcEXP(skill?.exp || 0).progressEXP}/{calcEXP(skill?.exp || 1).neededEXP} exp
                                    </Text>

                                    {/* TODO Implement Achievements */}
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.fieldText}>Achievements 0/2:</Text>
                                        <Text style={styles.fieldText}>Achievement 1</Text>
                                        <Text style={styles.fieldText}>Achievement 2</Text>
                                    </View>
                                    {skill?.active && (
                                    <TouchableOpacity style={styles.archiveButton} onPress={() => archiveHandler()}>
                                        <Text style={styles.buttonText}>Archive Skill</Text>
                                    </TouchableOpacity>)}

                                    {!skill?.active && (
                                    <TouchableOpacity style={styles.archiveButton} onPress={() => activateHandler()}>
                                        <Text style={styles.buttonText}>Re Activate Skill</Text>
                                    </TouchableOpacity>)}

                                </View>    
                            </ScrollView>
                            {/* Create and Cancel Buttons */}
                            <View style={styles.endButtons}>
                                <View style={styles.editCloseContainer}>
                                    <TouchableOpacity 
                                        style={ styles.closeButton} 
                                        onPress={() =>{
                                            onClose();
                                        }}
                                    >
                                    <Text style={styles.buttonText}>Close</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={styles.editButton} onPress={() =>{
                                        setSkillID(skill?.id || "0");
                                        setSkillEditVisible(true);
                                    }}>
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <EditSkillModal visible={skillEditVisible} id={skillID} onClose={() => {setSkillEditVisible(false); setSkillID("");}}></EditSkillModal>
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
    questContainer: {
        width: "100%",
        backgroundColor: colors.bgSecondary,
        borderRadius: 10,
        paddingBottom: 50,
        flexShrink: 1,
      },
    titleText: {
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
    descriptionContainer: {
        width: "100%",
        justifyContent: "center",
        //alignItems: "center",
        padding: "2%",
        //marginBottom:"2%"
    },
    descriptionText: {
        fontFamily: "Metamorphous_400Regular",
        fontSize: 22,
        color: colors.text,
    },
    fieldContainer: {
        width: "100%",
        justifyContent: "center",
        //alignItems: "center",
        padding: "2%",
        //marginBottom:"2%"
    },
    fieldText: {
        fontFamily: "Metamorphous_400Regular",
        fontSize: 20,
        color: colors.text,
    },
    expBar: {
        marginTop: 5,
        height: 12,
        backgroundColor: colors.bgPrimary,
        borderWidth: 1,
        borderColor: colors.borderInput,
        borderRadius: 99,
        justifyContent: "center",
        overflow: "hidden",
    },
    expTrait: {
        // fontFamily: "Alegreya_400Regular",
        fontFamily: "Alegreya_500Medium",
        marginTop: 2,
        fontSize: 14,
        color: colors.textLight,
    },
    endButtons:{
        justifyContent: "flex-end",
         
    },
    editCloseContainer: {
        flexDirection: 'row',
        justifyContent: "space-between", 
    },
    buttonText: {
        fontFamily: "Metamorphous_400Regular",
        color: colors.textDark, 
        fontSize: 20,
    },
    editButton: {
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
    closeButton: {
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
    
    archiveButton: {
        width: "70%",
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
});

export default SkillViewModal;
