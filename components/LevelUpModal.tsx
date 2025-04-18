import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import colors from "@/constants/colors";


import { useEffect } from "react";
import { useUserData } from "@/contexts/UserContext";


interface LevelUpModalProps {
  visible: boolean;
  onModalHide?: () => void;
  onClose: () => void; 
}


const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  onClose,
  
}) => {
  
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* TouchableWithoutFeedback to detect taps outside the modal. Also somewhat simulates slide to cancel for iOS. */}
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.pageTitle}>
            <Text style={styles.pageTitleText}>- Level Up! -</Text>
          </View>


        {/* Styling ripped from QuestReward modal. TODO: update fields to make sense and look nice :^) */}
        <View style={styles.questDetailsContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>
              Unlocks:{" "}
            <Text style={styles.contentText}></Text>
            </Text>
          </View>
        </View>


        </TouchableWithoutFeedback>
      </View>
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
  dropdownContainer: {
    position: "relative",
    // marginBottom: 20,
    marginBottom: 40, // need to increase to compensate for scrollContainer Top Padding, also looks better?
  },
  section: {
    zIndex: 1,
    backgroundColor: colors.bgTertiary,
    padding: 10,
    borderRadius: 8,
    height: 60,
    justifyContent: "center",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    
  },
  checkpointRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    
  },
  sectionTitle: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 24,
    color: colors.text,
  },
  // CONTAINERS ===============================
  pageTitle: {
    width: "100%",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    // backgroundColor: colors.bgTertiary,
    // borderBottomWidth: 1,
    // borderColor: colors.borderLight,
  },
  modalContainer: {
    // NOTE: parent of scrollContainer & closeButtonContainer for flex
    flex: 1,
    width: "100%",
    backgroundColor: colors.bgPrimary,
    borderRadius: 10,
    justifyContent: "space-between",
  },
  scrollLine: {
    // marginHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  scrollContainer: {
    // flex: 1,
    // flexShrink: 1,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    //width: "90%"
  },
  closeButtonContainer: {
    alignItems: "center",
    padding: 20,
  },
  questContainer: {
    // NOTE: parent of titleContainer, questDetailsContainer, questButtonsContainer for flex
    // flex: 1,
    width: "85%",
    marginHorizontal: 20,
    marginBottom: 10, // needed so if scrolling required doesnt cut off shadow
    borderRadius: 10,
    backgroundColor: colors.bgDropdown,
    // Shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  titleContainer: {
    backgroundColor: colors.bgTertiary,
    // width: "100%",
    // justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 10,
  },
  questDetailsContainer: {
    flexGrow: 1,
    marginHorizontal: 10,
  },
  descriptionContainer: {
    marginVertical: 20,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: colors.borderLight,
  },
  fieldContainer: {
    marginBottom: "4%",
  },
  questButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
    borderTopWidth: 0.5,
    borderColor: colors.borderLight,
    marginHorizontal: 10,
    paddingVertical: 20,
  },
  // BUTTONS ==================================
  repeatButton: {
    width: 53,
    height: 53,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.button3,
    borderRadius: 100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteButton: {
    width: 53,
    height: 53,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cancel,
    borderRadius: 100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  completeButton: {
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
    paddingVertical: "3%",
    paddingHorizontal: 20,
  },
  editButton: {
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
  // TEXT & ICONS =============================
  pageTitleText: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 30,
    color: colors.text,
  },
  titleText: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 36,
    color: colors.text,
  },
  descriptionText: {
    // fontFamily: "Metamorphous_400Regular",
    // fontSize: 22,
    fontFamily: "Alegreya_400Regular",
    fontSize: 24,
    color: colors.text,
  },
  fieldText: {
    // fontFamily: "Metamorphous_400Regular",
    // fontSize: 20,
    fontFamily: "Alegreya_500Medium",
    fontSize: 22,
    color: colors.text,
  },
  contentText: {
    fontFamily: "Alegreya_400Regular",
    // fontSize: 24,
  },
  buttonText: {
    fontFamily: "Metamorphous_400Regular",
    color: colors.textDark,
    fontSize: 20,
  },
  icons: {
    // fontFamily: "MaterialIcons_400Regular",
    fontFamily: "MaterialIconsRound_400Regular",
    fontSize: 30,
    color: colors.text,
  },
});

export default LevelUpModal;
