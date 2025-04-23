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
  onLevelUp: () => void;
}

const QuestRewardModal: React.FC<QuestRewardModalProps> = ({
  visible,
  onClose,
  id,
  onLevelUp,
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
      // changes size of modal
      // iOS gets more space at top
      ...Platform.select({
        ios: {
          flex: 0.92,
        },
        android: {
          flex: 0.95,
        },
        default: {
          flex: 0.92,
        },
      }),
      width: "100%",
      backgroundColor: colors.bgPrimary,
      borderRadius: 10,
      // paddingHorizontal: 10,
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
    pageTitleContainer: {
      // backgroundColor: colors.bgQuaternary,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      // padding: "5%",
      // marginBottom: "2%",
      // borderRadius: 10,
      marginBottom: 20,
    },
    titleContainer: {
      backgroundColor: colors.bgSecondary,
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
      // marginBottom: "4%",
      // marginVertical: 8,
      marginTop: 5,
      marginBottom: 10,
    },
    fieldText: {
      // fontFamily: "Metamorphous_400Regular",
      // fontSize: 20,
      fontFamily: "Alegreya_500Medium",
      fontSize: 22,
      color: colors.textLight,
    },
    contentText: {
      fontFamily: "Alegreya_400Regular",
      color: colors.textLight,
      fontSize: 20,
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
      width: "90%",
      marginHorizontal: 20,
      marginTop: 20,
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
      marginTop: 5,
      marginBottom: 15,
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
    // EXP REWARD STYLES ==========================
    expRewardContainer: {
      // not used atm
    },
    expRewardSectionTitleContainer: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    line: {
      flex: 1,
      borderBottomWidth: 0.5,
      borderColor: colors.borderLight,
    },
    expRewardSectionTitle: {
      fontFamily: "Alegreya_500Medium",
      fontSize: 22,
      color: colors.textLight,
    },
    expRewardBorder: {
      marginLeft: 2,
      paddingLeft: 5,
      borderLeftWidth: 0.5,
      borderColor: colors.borderLight,
    },
    expRewardSplitRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // alignItems: "flex-start",
    },
    expRewardCatagory: {
      fontFamily: "Alegreya_500Medium",
      fontSize: 22,
      color: colors.textLight,
      marginTop: 10,
    },
    expRewardCatagory2: {
      fontFamily: "Alegreya_500Medium",
      fontSize: 20,
      color: colors.textLight,

      marginTop: 3,
    },
    expRewardText: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.textLight,
      // set maxWidth
      // needed for long skill names
      // forces it go to next line instead
      // of pushing exp out of container
      maxWidth: "70%",
    },
  });

  if (!auth.currentUser) {
    return;
  }

  const userData = useUserData();
  const { completeQuest } = useUserData();
  const quest = userData.userData?.quests?.find((quest) => quest.id === id);

  // CALCULATE EXP REWARDS for Character, Skills, Traits
  const expRewards = () => {
    let exp = 0;
    if (quest?.difficulty === "Easy") {
      exp = 150;
    } else if (quest?.difficulty === "Normal") {
      exp = 300;
    } else {
      exp = 450;
    }

    const primarySkill = userData.userData?.skills?.find(
      (skill) => skill.name === quest?.primarySkill
    );
    const primSkillTraitOne = primarySkill?.primaryTrait;
    const primSkillTraitTwo = primarySkill?.secondaryTrait;

    const secondarySkill = userData.userData?.skills?.find(
      (skill) => skill.name === quest?.secondarySkill
    );
    const secSkillTraitOne = secondarySkill?.primaryTrait;
    const secSkillTraitTwo = secondarySkill?.secondaryTrait;

    let primarySkillXP = 0;
    let primSkillTraitOneXP = 0;
    let primSkillTraitTwoXP = 0;

    let secondarySkillXP = 0;
    let secSkillTraitOneXP = 0;
    let secSkillTraitTwoXP = 0;

    if (secondarySkill) {
      // Set primary and secondary skill exp
      primarySkillXP = Math.floor(exp * 0.75);
      secondarySkillXP = Math.ceil(exp * 0.25);

      // set primary skill trait exp
      if (primSkillTraitTwo) {
        primSkillTraitOneXP = Math.floor(primarySkillXP * 0.75);
        primSkillTraitTwoXP = Math.ceil(primarySkillXP * 0.25);
      } else {
        primSkillTraitOneXP = primarySkillXP;
      }

      // set secondary skill trait exp
      if (secSkillTraitTwo) {
        secSkillTraitOneXP = Math.floor(secondarySkillXP * 0.75);
        secSkillTraitTwoXP = Math.ceil(secondarySkillXP * 0.25);
      } else {
        secSkillTraitOneXP = secondarySkillXP;
      }
    } else {
      // if no secondary skill, just set primary skill exp
      primarySkillXP = exp;

      // set primary skill trait exp
      if (primSkillTraitTwo) {
        primSkillTraitOneXP = Math.floor(primarySkillXP * 0.75);
        primSkillTraitTwoXP = Math.ceil(primarySkillXP * 0.25);
      } else {
        primSkillTraitOneXP = primarySkillXP;
      }
    }

    return {
      charXP: exp,

      primarySkill: primarySkill?.name,
      primarySkillXP: primarySkillXP,

      primSkillTraitOne: primSkillTraitOne,
      primSkillTraitOneXP: primSkillTraitOneXP,

      primSkillTraitTwo: primSkillTraitTwo,
      primSkillTraitTwoXP: primSkillTraitTwoXP,

      secondarySkill: secondarySkill?.name,
      secondarySkillXP: secondarySkillXP,

      secSkillTraitOne: secSkillTraitOne,
      secSkillTraitOneXP: secSkillTraitOneXP,

      secSkillTraitTwo: secSkillTraitTwo,
      secSkillTraitTwoXP: secSkillTraitTwoXP,
    };
  };

  const [completionReward, setCompletionReward] = useState("");

  const questReward = async () => {
    if (userData && quest && auth.currentUser) {
      const neededEXP = calcEXP(userData.userData?.exp || 0).neededEXP;
      const progressEXP = calcEXP(userData.userData?.exp || 0).progressEXP;
      console.log("calc neededEXP: ", neededEXP);
      console.log("calc progressEXP: ", progressEXP);
      console.log(quest.difficulty);
      completeQuest(quest.id);

      // Calculating level states for before and after was a bust
      // Only way to get the level up modal to appear momentarily is by taking the difference
      // between needed and progress EXP.
      if (quest.difficulty === "Hard" && neededEXP - progressEXP <= 450) {
        onLevelUp();
      } else if (
        quest.difficulty === "Normal" &&
        neededEXP - progressEXP <= 300
      ) {
        onLevelUp();
      } else if (
        quest.difficulty === "Easy" &&
        neededEXP - progressEXP <= 150
      ) {
        onLevelUp();
      } else {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (quest) {
      // add quest title bozo
      setCompletionReward(quest.reward);
    }
  }, [quest]);

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
          <View style={styles.pageTitleContainer}>
            <Text style={styles.title}>Quest Complete!</Text>
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
                        {completionReward ? completionReward : "none"}
                      </Text>
                    </Text>
                    {/* Different reward style */}
                    {/* <View style={styles.expRewardSectionTitleContainer}>
                      <View style={styles.line}></View>
                      <Text style={styles.expRewardSectionTitle}>
                        Quest Reward
                      </Text>
                      <View style={styles.line}></View>
                    </View>
                    <Text style={styles.contentText}>
                      {completionReward ? completionReward : "none"}
                    </Text> */}
                  </View>
                  <View style={styles.expRewardSectionTitleContainer}>
                    <View style={styles.line}></View>
                    <Text style={styles.expRewardSectionTitle}>
                      Experience Gained
                    </Text>
                    <View style={styles.line}></View>
                  </View>
                  {/* TRAITS w/ Skills */}
                  <View style={styles.expRewardContainer}>
                    {expRewards().secondarySkill ? (
                      // Primary and Secondary SKills
                      <View>
                        <Text style={styles.expRewardCatagory}>Character:</Text>
                        <View style={styles.expRewardBorder}>
                          <View style={styles.expRewardSplitRow}>
                            <Text style={styles.expRewardText}>
                              Overall level
                            </Text>
                            <Text style={styles.expRewardText}>
                              + {expRewards().charXP} xp
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.expRewardCatagory}>
                          Primary Skill:
                        </Text>
                        <View style={styles.expRewardBorder}>
                          <View style={styles.expRewardSplitRow}>
                            <Text style={styles.expRewardText}>
                              {expRewards().primarySkill}
                            </Text>
                            <Text style={styles.expRewardText}>
                              + {expRewards().primarySkillXP} xp
                            </Text>
                          </View>

                          <Text style={styles.expRewardCatagory2}>Traits:</Text>
                          {expRewards().primSkillTraitTwo ? (
                            <View style={styles.expRewardBorder}>
                              <View style={styles.expRewardSplitRow}>
                                <Text style={styles.expRewardText}>
                                  {expRewards().primSkillTraitOne}
                                </Text>
                                <Text style={styles.expRewardText}>
                                  + {expRewards().primSkillTraitOneXP} xp
                                </Text>
                              </View>
                              <View style={styles.expRewardSplitRow}>
                                <Text style={styles.expRewardText}>
                                  {expRewards().primSkillTraitTwo}
                                </Text>
                                <Text style={styles.expRewardText}>
                                  + {expRewards().primSkillTraitTwoXP} xp
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <View style={styles.expRewardBorder}>
                              <View style={styles.expRewardSplitRow}>
                                <Text style={styles.expRewardText}>
                                  {expRewards().primSkillTraitOne}
                                </Text>
                                <Text style={styles.expRewardText}>
                                  + {expRewards().primSkillTraitOneXP} xp
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>

                        <Text style={styles.expRewardCatagory}>
                          Secondary Skill:
                        </Text>
                        <View style={styles.expRewardBorder}>
                          <View style={styles.expRewardSplitRow}>
                            <Text style={styles.expRewardText}>
                              {expRewards().secondarySkill}
                            </Text>
                            <Text style={styles.expRewardText}>
                              + {expRewards().secondarySkillXP} xp
                            </Text>
                          </View>

                          <Text style={styles.expRewardCatagory2}>Traits:</Text>
                          {expRewards().secSkillTraitTwo ? (
                            <View style={styles.expRewardBorder}>
                              <View style={styles.expRewardSplitRow}>
                                <Text style={styles.expRewardText}>
                                  {expRewards().secSkillTraitOne}
                                </Text>
                                <Text style={styles.expRewardText}>
                                  + {expRewards().secSkillTraitOneXP} xp
                                </Text>
                              </View>
                              <View style={styles.expRewardSplitRow}>
                                <Text style={styles.expRewardText}>
                                  {expRewards().secSkillTraitTwo}
                                </Text>
                                <Text style={styles.expRewardText}>
                                  + {expRewards().secSkillTraitTwoXP} xp
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <View style={styles.expRewardBorder}>
                              <View style={styles.expRewardSplitRow}>
                                <Text style={styles.expRewardText}>
                                  {expRewards().secSkillTraitOne}
                                </Text>
                                <Text style={styles.expRewardText}>
                                  + {expRewards().secSkillTraitOneXP} xp
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    ) : (
                      // Only Primary Skill
                      <View>
                        <Text style={styles.expRewardCatagory}>Character:</Text>
                        <View style={styles.expRewardBorder}>
                          <Text style={styles.expRewardText}>
                            + {expRewards().charXP} xp
                          </Text>
                        </View>

                        <Text style={styles.expRewardCatagory}>
                          Primary Skill:
                        </Text>
                        <View style={styles.expRewardBorder}>
                          <View style={styles.expRewardSplitRow}>
                            <Text style={styles.expRewardText}>
                              {expRewards().primarySkill}
                            </Text>
                            <Text style={styles.expRewardText}>
                              + {expRewards().primarySkillXP} xp
                            </Text>
                          </View>

                          <Text style={styles.expRewardCatagory2}>Traits:</Text>
                          {expRewards().primSkillTraitTwo ? (
                            <View style={styles.expRewardBorder}>
                              <View style={styles.expRewardSplitRow}>
                                <Text style={styles.expRewardText}>
                                  {expRewards().primSkillTraitOne}
                                </Text>
                                <Text style={styles.expRewardText}>
                                  + {expRewards().primSkillTraitOneXP} xp
                                </Text>
                              </View>
                              <View style={styles.expRewardSplitRow}>
                                <Text style={styles.expRewardText}>
                                  {expRewards().primSkillTraitTwo}
                                </Text>
                                <Text style={styles.expRewardText}>
                                  + {expRewards().primSkillTraitTwoXP} xp
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <View style={styles.expRewardBorder}>
                              <View style={styles.expRewardSplitRow}>
                                <Text style={styles.expRewardText}>
                                  {expRewards().primSkillTraitOne}
                                </Text>
                                <Text style={styles.expRewardText}>
                                  + {expRewards().primSkillTraitOneXP} xp
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
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
  );
};

export default QuestRewardModal;
