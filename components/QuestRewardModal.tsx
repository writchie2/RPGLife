// TODO: Create a visual modal that appears on quest completion showing it's rewards
// god help us all

import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Pressable,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { auth } from "../FirebaseConfig";
import DatePickerComponent from "../components/DatePickerComponent";
import { Dropdown } from "react-native-element-dropdown";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import { useUserData } from "@/contexts/UserContext";
import calcEXP from "@/utils/calcEXP";

interface QuestRewardModalProps {
  visible: boolean;
  onModalHide?: () => void;
  onClose: () => void;
  id: string;
  onLevelUp: () => void
  complete: boolean
}

const QuestRewardModal: React.FC<QuestRewardModalProps> = ({
  visible,
  onClose,
  id,
  onLevelUp,
  complete
}) => {
  const colors = useTheme(); // used for themes, replaces colors import

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
      flex: 0.92,
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
      paddingRight: "2%",
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
      borderRadius: 10,
      marginBottom: "2%",
    },
    title: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 36,
      color: colors.text,
    },
    dropdown: {
      height: 50,
      borderColor: "gray",
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      flex: 1,
      backgroundColor: colors.textInput,
    },
    rowGroup: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: "1%",
      width: "100%",
      justifyContent: "space-between",
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
    endButtons: {
      justifyContent: "flex-end",
    },
    createCancelContainer: {
      flexDirection: "row",
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
      margin: "2%",
      padding: "3%",
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
      padding: "3%",
      margin: "2%",
    },
    difficultyButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    difficultyLabel: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 18,
      color: colors.text,
      width: "40%",
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
      margin: "2%",
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
      margin: "2%",
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
    fieldContainer: {
      marginBottom: "4%",
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
    titleText: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 36,
      color: colors.text,
    },
    scrollLine: {
      // marginHorizontal: 15,
      borderBottomWidth: 1,
      borderColor: colors.borderLight,
    },
    icons: {
        // fontFamily: "MaterialIcons_400Regular",
        fontFamily: "MaterialIconsRound_400Regular",
        fontSize: 30,
        color: colors.text,
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
});

 

  if (!auth.currentUser) {
        return;
    }

    const userData = useUserData();
    const {completeQuest, repeatQuest} = useUserData();
    const quest = userData.userData?.quests?.find(quest => quest.id === id);

    const [completionReward, setCompletionReward] = useState("");

    const questReward = async () => {
        if ((userData && quest) && auth.currentUser) {
            
            const neededEXP = calcEXP(userData.userData?.exp || 0).neededEXP;
            const progressEXP = calcEXP(userData.userData?.exp || 0).progressEXP
            console.log("calc neededEXP: ", neededEXP)
            console.log("calc progressEXP: ", progressEXP)
            console.log(quest.difficulty);
            if(complete){
              repeatQuest(quest.id);
            }
            else{
              completeQuest(quest.id);
            }
            

           // Calculating level states for before and after was a bust
           // Only way to get the level up modal to appear momentarily is by taking the difference
           // between needed and progress EXP.
            if (quest.difficulty === "Hard" && (neededEXP - progressEXP) <= 450) {
                onLevelUp();
            } else if (quest.difficulty === "Normal" && (neededEXP - progressEXP) <= 300) {
                onLevelUp();
            } else if (quest.difficulty === "Easy" && (neededEXP - progressEXP) <= 150) {
                onLevelUp();
            } else {
                onClose();
            }
        }
    }

    useEffect(() => {
        if (quest) {
            // add quest title bozo
            setCompletionReward(quest.reward);
        } }, [quest]);

    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={questReward}
        >
        
        <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={questReward}> 
            {/* Title */}
            <View style={styles.titleContainer}>
            <Text style={styles.title}>Quest {complete? "Complete!" : "Repeated!"}</Text>
            </View>
        </TouchableWithoutFeedback>            

        <View style={styles.modalContainer}>
          <View style={styles.scrollLine}></View>
          {/* ScrollView makes the form scrollable if it does not fit fully on a small screen */}
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.questContainer}>
                {/* Title */}
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>{quest?.name}</Text>
                </View>
                <View style={styles.questDetailsContainer}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldText}>
                      Reward:{" "}
                      <Text style={styles.contentText}>
                        {completionReward}
                      </Text>
                    </Text>
                  </View>
                </View>

              </View>
            </TouchableWithoutFeedback>
          </ScrollView>

          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                    questReward();
                }}
            >
            <Text style={styles.icons}>close</Text>
            </TouchableOpacity>
          </View>
        </View>
             
        </View>
        </Modal>
    )
}


export default QuestRewardModal;
