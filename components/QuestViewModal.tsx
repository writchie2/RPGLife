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
import EditQuestModal from "./EditQuestModal";
import QuestRewardModal from "./QuestRewardModal";
import { Checkpoint } from "@/utils/types";
import CheckPointsList from "./CheckpointsList";


interface QuestViewModalProps {
  visible: boolean;
  onModalHide?: () => void;
  onClose: () => void;
  id: string;
  onReward: () => void;
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
  onReward,
}) => {
  const { userData, deleteQuest, completeQuest, repeatQuest } = useUserData();

  const quest = userData?.quests?.find((quest) => quest.id === id);
  const [questEditVisible, setQuestEditVisible] = useState(false);
  const [questID, setQuestID] = useState("");
  const [checkpointListVisible, setCheckpointListVisible] = useState(false);
  const [questRewardVisible, setQuestRewardVisible] = useState(false);
  

  const deleteHandler = () => {
    if (userData && quest) {
      Alert.alert("Confirm Delete:", quest.name, [
        {
          text: "Confirm",
          onPress: () => {
            deleteQuest(quest.id);
            onClose();
          },
        },
        {
          text: "Cancel",
          onPress: () => {},
        },
      ]);
    }
  };

  const completeHandler = () => {
    if (userData && quest) {
      
      
      // If the quest is not repeatable, then it might have checkpoints to check
      if (!quest.repeatable){

        // Get the count of active checkpoints
        // If there are no checkpoints, activeCount will be undefined
        const activeCount = quest?.checkpoints?.filter(checkpoints => checkpoints.active).length;

        // If there are checkpoints and at least one is active, show alert 
        // This will not show if there are either no checkpoints, or all are completed
        if (activeCount && activeCount != 0){
          Alert.alert("Not Quite!", "You have " + activeCount + (activeCount > 1? " checkpoints left to finish!" : " checkpoint left to finish!") );
          return;
        }
        // If checkpoints are completed, show confirmation mesage
        else{
          Alert.alert("Confirm Complete", quest.name, [
            {
              text: "Confirm",
              onPress: () => {
                completeQuest(quest.id);
                let message = [];
                message.push("You completed:\n" + quest.name + "\n");
                if (quest.difficulty === "Easy") {
                  message.push("You gained 150 XP!\n");
                } else if (quest.difficulty === "Normal") {
                  message.push("You gained 300 XP!\n");
                } else {
                  message.push("You gained 450 XP!\n");
                }
                message.push("We'll make the graphic look cooler later!");
                // Alert.alert("Quest Complete!", message.join(""));
                //setQuestID(quest.id);
                //setQuestRewardVisible(true);
                onReward();
                onClose();
              },
            },
            {
              text: "Cancel",
              onPress: () => {},
            },
          ]);
        }
      }
      // Quest is repeatable, no checkpoints to check
      else{

        // Completing will set a quest to inactive, where repeating will keep it active. Confirmation message explains the difference to user
        Alert.alert("Confirm Complete", "This quest is repeatable. Did you want to repeat it?\nCompleting it will make it no longer active.", [
          {
            text: "Confirm",
            onPress: () => {
              completeQuest(quest.id);
              let message = [];
              message.push("You completed:\n" + quest.name + "\n");
              if (quest.difficulty === "Easy") {
                message.push("You gained 150 XP!\n");
              } else if (quest.difficulty === "Normal") {
                message.push("You gained 300 XP!\n");
              } else {
                message.push("You gained 450 XP!\n");
              }
              message.push("We'll make the graphic look cooler later!");
              // Alert.alert("Quest Complete!", message.join(""));
              onClose();
            },
          },
          {
            text: "Cancel",
            onPress: () => {},
          },
        ]);
      }
      
    }
  };

  const repeatHandler = () => {
    if (userData && quest) {
      Alert.alert("Confirm Repeat:", quest.name, [
        {
          text: "Confirm",
          onPress: () => {
            repeatQuest(quest.id);
            let message = [];
            message.push("You completed:\n" + quest.name + "\n");
            if (quest.difficulty === "Easy") {
              message.push("You gained 150 XP!\n");
            } else if (quest.difficulty === "Normal") {
              message.push("You gained 300 XP!\n");
            } else {
              message.push("You gained 450 XP!\n");
            }
            message.push("We'll make the graphic look cooler later!");
            Alert.alert("Quest Repeated!", message.join(""));
          },
        },
        {
          text: "Cancel",
          onPress: () => {},
        },
      ]);
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
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.pageTitle}>
            <Text style={styles.pageTitleText}>- Quest Details -</Text>
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
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>
                      {quest?.description ? quest?.description : "Overview"}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldText}>
                      Due:{" "}
                      <Text style={styles.contentText}>
                        {quest?.dueDate.toDateString()}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldText}>
                      Difficulty:{" "}
                      <Text style={styles.contentText}>
                        {quest?.difficulty}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldText}>
                      Skills:{" "}
                      <Text style={styles.contentText}>
                        {quest?.primarySkill}
                        {quest?.secondarySkill && `, ${quest?.secondarySkill}`}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldText}>
                      Reward:{" "}
                      <Text style={styles.contentText}>
                        {quest?.reward ? quest?.reward : "none"}
                      </Text>
                    </Text>
                  </View>

              {!quest?.repeatable && (
              <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.section}
                    onPress={() => setCheckpointListVisible(!checkpointListVisible)}
                  >
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>
                      {checkpointListVisible ? "Hide Checkpoints" : ("Checkpoints " + quest?.checkpoints?.filter(checkpoints => !checkpoints.active).length) + "/" + quest?.checkpoints?.length }
                    </Text>
                    <Text style={styles.sectionTitle}>
                      {checkpointListVisible ? "▲" : "▼"}
                    </Text>
                  </View>
                  </TouchableOpacity>
                
                
                {checkpointListVisible && (
                  <CheckPointsList
                    checkpoints={quest?.checkpoints || []}
                    questID={quest?.id || ""}
                  />
                )}
              </View>)}

                  {quest?.repeatable && quest?.active && (
                    <TouchableOpacity
                      style={styles.repeatButton}
                      onPress={() => repeatHandler()}
                    >
                      <Text style={styles.icons}>repeat</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {/* Delete | Complete | Edit -> Buttons */}
                <View style={styles.questButtonsContainer}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteHandler()}
                  >
                    <Text style={styles.icons}>delete</Text>
                  </TouchableOpacity>
                  {quest?.active &&
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => {
                      setQuestID(quest.id);
                      setQuestRewardVisible(true);
                      completeHandler(); 
                      
                    }}
                  >
                    <Text style={styles.buttonText}>Complete Quest</Text>
                  </TouchableOpacity>}
                  

                  {quest?.active &&
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      if (quest?.active) {
                        setQuestID(quest.id);
                        setQuestEditVisible(true);
                      } else {
                        alert("Only active quests can be edited!");
                      }
                    }}
                  >
                    <Text style={styles.icons}>edit</Text>
                  </TouchableOpacity>}
                  <EditQuestModal
                    visible={questEditVisible}
                    id={questID}
                    onClose={() => {
                      setQuestEditVisible(false);
                      setQuestID("");
                    }}
                  ></EditQuestModal>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
          {/* Close Button */}
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setCheckpointListVisible(false);
                onClose();
              }}
            >
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

export default QuestViewModal;
