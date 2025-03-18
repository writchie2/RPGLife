import React, { useState } from "react";
import {Text, StyleSheet, TouchableOpacity, ScrollView, View, Modal, TouchableWithoutFeedback, Keyboard} from "react-native";
import colors from "@/constants/colors";

import { useEffect } from "react";
import { useUserData } from "@/contexts/UserContext";
import EditQuestModal from "./EditQuestModal";


interface QuestViewModalProps {
    visible: boolean;
    onModalHide?: () => void;
    onClose: () => void;
    id: string;
  }

/*
TODO:
Implement quest complete button functionality
Implement quest repeat button functionality
styling
*/
const QuestViewModal: React.FC<QuestViewModalProps> = ({
visible,
onClose,
id,
}) => {

    const quest = useUserData().userData?.quests?.find(quest => quest.id === id);
    const [questEditVisible, setQuestEditVisible] = useState(false);
    const [questID, setQuestID] = useState("");
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
                                        <Text style={styles.titleText}>{quest?.name}</Text>
                                    </View>
                                    <View style={styles.descriptionContainer}>
                                        <Text style={styles.descriptionText}>{quest?.description}</Text>
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.fieldText}>Due: {quest?.dueDate.toDateString()}</Text>
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.fieldText}>Difficulty: {quest?.difficulty}</Text>
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.fieldText}>Skills: {quest?.primarySkill}{quest?.secondarySkill && `, ${quest?.secondarySkill}`}</Text>
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.fieldText}>Reward: {quest?.reward}</Text>
                                    </View>

                                    {/* TODO Implement Checkpoints */}
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.fieldText}>Checkpoints 0/2:</Text>
                                        <Text style={styles.fieldText}>Checkpoints 1</Text>
                                        <Text style={styles.fieldText}>Checkpoints 2</Text>
                                    </View>

                                    {quest?.repeatable && (
                                        <TouchableOpacity style={styles.repeatButton} onPress={() =>alert("You selected repeat")}>
                                            <Text style={styles.buttonText}>Repeat</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity style={styles.completeButton} onPress={() =>alert("You selected complete")}>
                                        <Text style={styles.buttonText}>Complete Quest</Text>
                                    </TouchableOpacity>

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
                                        setQuestID(quest?.id || "0");
                                        setQuestEditVisible(true);
                                        }}>
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <EditQuestModal visible={questEditVisible} id={questID} onClose={() => {setQuestEditVisible(false); setQuestID("");}}></EditQuestModal>
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
        backgroundColor: 'blue', 
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
    repeatButton: {
        width: "40%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "blue",
        borderRadius: 100,
        shadowColor: colors.shadow, 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        padding:"3%",
        margin:"2%"  
    },
    completeButton: {
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

export default QuestViewModal;