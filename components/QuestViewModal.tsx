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
  const { userData, deleteQuest, completeQuest } = useUserData();

  const quest = userData?.quests?.find((quest) => quest.id === id);
  const [questEditVisible, setQuestEditVisible] = useState(false);
  const [questID, setQuestID] = useState("");

  const deleteHandler = () => {
    if (userData && quest) {
      Alert.alert("Confirm Delete:", quest.name, [
        {
          text: "Confirm",
          onPress: () => {
            onClose();
            if (quest.active) {
              deleteQuest(quest.id);
            } else {
              // Should be something we can add later once game design is figured out.
              alert("Only active quests can be deleted, not finished quests!");
            }
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
      // TODO
      // First check checkpoints are completed
      // If not, return alert error

      completeQuest(quest.id);

      // Alert message for now
      // A popup graphic would be cool in the future
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
      Alert.alert("Quest Complete!", message.join(""));

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

                  {/* TODO Implement Checkpoints */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldText}>Checkpoints 0/2:</Text>
                    <Text style={styles.fieldText}>Checkpoints 1</Text>
                    <Text style={styles.fieldText}>Checkpoints 2</Text>
                  </View>

                  {quest?.repeatable && (
                    <TouchableOpacity
                      style={styles.repeatButton}
                      onPress={() => alert("You selected repeat")}
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
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => completeHandler()}
                  >
                    <Text style={styles.buttonText}>Complete Quest</Text>
                  </TouchableOpacity>

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
                  </TouchableOpacity>
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
  // CONTAINERS ===============================
  pageTitle: {
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
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
  },
  closeButtonContainer: {
    alignItems: "center",
    padding: 20,
  },
  questContainer: {
    // NOTE: parent of titleContainer, questDetailsContainer, questButtonsContainer for flex
    // flex: 1,
    // width: "100%",
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
