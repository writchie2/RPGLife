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
  Platform,
} from "react-native";
import colors from "@/constants/colors";

import { useEffect } from "react";
import { useUserData } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import calcEXP from "@/utils/calcEXP";
import { achievementList } from "@/utils/AchievementList";

interface LevelUpModalProps {
  visible: boolean;
  onModalHide?: () => void;
  onClose: () => void;
  leveledUp: string[];
}

const traits = ["Strength", "Vitality", "Agility", "Intelligence", "Charisma"];

const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  onClose,
  leveledUp,
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
      // Platform used changes size of modal
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
      // padding: 20,
      justifyContent: "space-between",
    },
    titleContainer: {
      // backgroundColor: colors.bgPrimary,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      // borderRadius: 10,
      // marginBottom: "2%",
      marginBottom: 20,
    },
    contentTitleContainer: {
      backgroundColor: colors.bgSecondary,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      // padding: "3%",
      padding: "4%",
      borderRadius: 10,
      marginBottom: "2%",
    },
    title: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 36,
      color: colors.text,
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

    contentText: {
      // fontFamily: "Alegreya_400Regular",
      // fontSize: 30,
      fontFamily: "Metamorphous_400Regular",
      fontSize: 26,
      color: colors.text,
    },
    levelUpText: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 24,
      color: colors.text,
      textAlign: "center",
      paddingHorizontal: "10%",
    },
    rewardMessageText: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 20,
      color: colors.text,
      textAlign: "center",
    },
    rewardText: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 28,
      color: colors.text,
      textAlign: "center",
    },
    // CONTAINERS ===============================

    closeButtonContainer: {
      alignItems: "center",
      padding: 20,
    },
    contentContainer: {
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
      paddingBottom: 20,
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

  const { userData } = useUserData();
  const traitLevels = leveledUp.filter((item) => traits.includes(item));
  const skillLevels = leveledUp.filter(
    (item) => !traits.includes(item) && item !== "Character"
  );
  const characterLeveled = leveledUp.includes("Character");

  /*
  const traitLevels = ["Strength", "Charisma"]
  const skillLevels = ["Strength/Charisma"];
  const characterLeveled = true;
  */

  const renderCharacterLevel = () => {
    if (!characterLeveled) return null;

    const currentLevel = calcEXP(userData?.exp || 0).level;

    // Find the "Character" category
    const characterAchievements =
      achievementList.find((cat) => cat.catagory === "Character")
        ?.achievements || [];

    // Find the reward for the *exact* level the user just reached
    const rewardAtLevel = characterAchievements.find(
      (achievement) => achievement.level === currentLevel
    );

    return (
      <View style={styles.contentContainer}>
        <View style={styles.contentTitleContainer}>
          <Text style={styles.contentText}>Character Level Up!</Text>
        </View>
        <Text style={styles.levelUpText}>
          Your overall level increased to {calcEXP(userData?.exp || 0).level}!
        </Text>

        {rewardAtLevel && (
          <View>
            <Text style={styles.rewardMessageText}>
              - Reward{rewardAtLevel?.reward2 ? "s" : ""} Unlocked -
            </Text>
            <Text style={styles.rewardText}>{rewardAtLevel.reward}</Text>
            {rewardAtLevel?.reward2 && (
              <Text style={styles.rewardText}>{rewardAtLevel.reward2}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderSkillLevels = () => {
    if (skillLevels.length === 0 || !userData?.skills) return null;

    return skillLevels.map((skillName, index) => {
      // Look up the skill's current level from userData
      const skillData = userData.skills?.find((s) => s.name === skillName);
      const level = calcEXP(skillData?.exp || 0).level;

      return (
        <View key={skillName} style={styles.contentContainer}>
          <View style={styles.contentTitleContainer}>
            <Text style={styles.contentText}>Skill Level Up!</Text>
          </View>
          <Text style={styles.levelUpText}>
            {skillName} level increased to {level}!
          </Text>
        </View>
      );
    });
  };

  const renderTraitLevels = () => {
    if (traitLevels.length === 0) return null;

    return traitLevels.map((traitName, index) => {
      // Look up the trait's current level from userData

      let level = 0;
      switch (traitName) {
        case "Strength":
          level = calcEXP(userData?.strengthEXP || 0).level || 0;
          break;
        case "Vitality":
          level = calcEXP(userData?.vitalityEXP || 0).level || 0;
          break;
        case "Agility":
          level = calcEXP(userData?.agilityEXP || 0).level || 0;
          break;
        case "Stamina":
          level = calcEXP(userData?.staminaEXP || 0).level || 0;
          break;
        case "Intelligence":
          level = calcEXP(userData?.intelligenceEXP || 0).level || 0;
          break;
        case "Charisma":
          level = calcEXP(userData?.charismaEXP || 0).level || 0;
          break;
      }

      const category = achievementList.find(
        (cat) => cat.catagory === traitName
      );

      // Try to find the reward at the current level (if any)
      const rewardAtLevel = category?.achievements.find(
        (achievement) => achievement.level === level
      );

      return (
        <View key={traitName} style={styles.contentContainer}>
          <View style={styles.contentTitleContainer}>
            <Text style={styles.contentText}>Trait Level Up!</Text>
          </View>
          <Text style={styles.levelUpText}>
            {traitName} level increased to {level}!
          </Text>
          {rewardAtLevel && (
            <View>
              <Text style={styles.rewardMessageText}>- Reward Unlocked -</Text>
              <Text style={styles.rewardText}>{rewardAtLevel.reward}</Text>
              {rewardAtLevel?.reward2 && (
                <Text style={styles.rewardText}>{rewardAtLevel.reward2}</Text>
              )}
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}> - Level Up! - </Text>
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
            {renderCharacterLevel()}
            {renderSkillLevels()}
            {renderTraitLevels()}
          </ScrollView>

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

export default LevelUpModal;
