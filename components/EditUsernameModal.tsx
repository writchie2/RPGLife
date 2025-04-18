import React, { useState } from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native';
import colors from "@/constants/colors";
import { useUserData } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';

interface EditUsernameModalProps {
    visible: boolean;
    onClose: () => void; 
  }

const EditUsernameModal: React.FC<EditUsernameModalProps> = ({
  visible,
  onClose,
}) => {

const colors = useTheme(); // used for themes, replaces colors import
const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Darkened background for modal
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: .25,
      width: '90%',
      backgroundColor: colors.bgPrimary,
      borderRadius: 10,
      justifyContent: 'space-between',
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    scrollContainer: {
      marginBottom: 20,
      alignItems: 'center',
    },
    titleContainer: {
        backgroundColor: colors.bgTertiary,
        //width: "100%",
        //justifyContent: "center",
        alignItems: "center",
        padding: 18,
        borderRadius:10,
        //marginBottom:"2%"
    },
    input: {
        marginTop: 20,
        padding: 12,
        backgroundColor: colors.bgDropdown,
        borderRadius: 10,
        fontSize: 18,
        fontFamily: "Alegreya_400Regular",
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.borderInput,
    },
    titleText: {
      fontFamily: 'Metamorphous_400Regular',
      fontSize: 30,
      color: colors.text,
    },
    contentText: {
      fontFamily: 'Alegreya_400Regular',
      fontSize: 18,
      color: colors.text,
      marginTop: 10,
      textAlign: 'center',
    },
    closeButtonContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    closeButton: {
        width: 53,
        height: 53,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.bgSecondary,
        borderRadius: 100,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
      },
    icons: {
        fontFamily: "MaterialIconsRound_400Regular",
        fontSize: 30,
        color: colors.text,
    },
  });

const { userData, editUsername} = useUserData();
const [username, setUsername] = useState("");

const saveHandler = () => {
    if (username.trim() === "") {
        alert("Username cannot be blank!")
        return;
    } else if (username.trim() === userData?.username) {
        // The username is the same, don't need to query database
        setUsername("");
        onClose();
    }
    else{
        editUsername(username);
        setUsername("");
        onClose();
    }
}
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={() => {setUsername(""); onClose()}}>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                    
                        
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>Change Username</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor={colors.textPlaceholder}
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={username}
                            onChangeText={setUsername}
                        />
                    
                        <View style={styles.closeButtonContainer}>
                            <TouchableOpacity onPress={saveHandler} style={styles.closeButton}>
                            <Text style={styles.icons}>save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>   
                </TouchableWithoutFeedback>
                
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditUsernameModal;