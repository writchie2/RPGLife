// TODO: Create a visual modal that appears on quest completion showing it's rewards
// god help us all

import React, { useEffect, useState } from "react";
    import {Text, StyleSheet, TextInput, Button, TouchableOpacity, SafeAreaView, ScrollView, Pressable, View, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert} from "react-native";
    import { auth } from "../FirebaseConfig"
    import DatePickerComponent from "../components/DatePickerComponent";

    import { Dropdown } from 'react-native-element-dropdown';
    import colors from "@/constants/colors";
    import { useUserData } from "@/contexts/UserContext";

interface QuestRewardModalProps {
    visible: boolean;
    onModalHide?: () => void;
    onClose: () => void;
    id: string;
}

const QuestRewardModal: React.FC<QuestRewardModalProps> = ({
    visible,
    onClose,
    id,
}) => {
    if (!auth.currentUser) {
        return;
    }
    const {userData} = useUserData();
    const quest = userData?.quests?.find(quest => quest.id === id);
    
    const [completionReward, setCompletionReward] = useState("");

    useEffect(() => {
        if (quest) {
            setCompletionReward(quest.reward);
        }
    }, [quest]);

    return (
        <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        >
        
        <TouchableWithoutFeedback onPress={onClose}>
            
        </TouchableWithoutFeedback>

        </Modal>
    )
}