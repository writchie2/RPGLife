import React from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import colors from "@/constants/colors";
import { useUserData } from '@/contexts/UserContext';

interface WelcomeModalProps {
    visible: boolean;
    onClose: () => void; 
  }

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  visible,
  onClose,
}) => {
const { userData} = useUserData();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.scrollContainer}>
            <Text style={styles.titleText}>Welcome to RPGLife!</Text>
            <Text style={styles.contentText}>We appreciate you making an account, {userData?.username}!</Text>
            <Text style={styles.contentText}>This is the Capstone Project for Group 7 for CS at UWM 2025</Text>
            <Text style={styles.contentText}>Created by: Conor Brhely, Magan Greenfield, Ishika Patel, Henry Ritchie, Dillan Smith</Text>
          </View>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.icons}>close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Darkened background for modal
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: .35,
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
export default WelcomeModal;