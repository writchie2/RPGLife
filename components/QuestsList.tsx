import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Timestamp } from "firebase/firestore";

import { Quest } from "../utils/types";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import QuestViewModal from "./QuestViewModal";
import QuestRewardModal from "./QuestRewardModal";

import LevelUpModal from "./LevelUpModal";
import { useUserData } from "@/contexts/UserContext";
import { toMidnight } from "@/utils/toMidnight";


interface QuestsListProps {
  quests: Quest[];
  mode: string;
}

//Component that returns a Flat List with quests from a given quest array
const QuestsList: React.FC<QuestsListProps> = ({
  quests, // Array of quests from UserData interface
  mode, // "active", "inactive", or "all"
}) => {
  const colors = useTheme(); // used for themes, replaces colors import

  const styles = StyleSheet.create({
    list: {
      position: "relative",
      top: -60,
      marginBottom: -60,
      zIndex: 0,
      borderRadius: 8,
      width: "100%",
      paddingTop: 50,
      backgroundColor: colors.bgDropdown,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    listContainer: {
      padding: 16,
      paddingBottom: 12,
    },
    questDetailsContainer: {
      // borderLeftWidth: 0.5,
      // paddingLeft: 6,
      // marginLeft: 2.5,
      // borderColor: colors.borderLight,
      // borderBottomWidth: 1,
      // paddingBottom: 6,
      // marginLeft: 2,
      // marginTop: 5,
    },
    questDetailsContainer2: {
      borderLeftWidth: 0.5,
      paddingLeft: 6,
      marginLeft: 2.5,
      marginTop: 4,
      borderColor: colors.borderLight,
      // borderBottomWidth: 1,
      // paddingLeft: 5,
      // paddingBottom: 6,
    },
    questItem: {
      // padding: 10,
      // marginBottom: 12,
      paddingVertical: 10,
      paddingHorizontal: 6,
      marginBottom: 10,
      backgroundColor: "transparent",
      // borderBottomWidth: 1,
      borderBottomWidth: 0.5,
      borderColor: colors.borderLight,
    },
    questName: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 20,
      color: colors.text,
    },
    questDescription: {
      // fontFamily: "Alegreya_400Regular",
      fontFamily: "Alegreya_500Medium",
      // marginTop: 5,
      marginTop: 4,
      fontSize: 16,
      color: colors.textLight,
    },
    questDetails: {
      // fontFamily: "Alegreya_400Regular",
      fontFamily: "Alegreya_500Medium",
      // marginTop: 5,
      marginTop: 2,
      fontSize: 14,
      color: colors.textLight,
    },
    questSkills: {
      // fontFamily: "Alegreya_400Regular",
      fontFamily: "Alegreya_500Medium",
      marginTop: 5,
      fontSize: 14,
      color: colors.textLight,
    },
    questRepeatability: {
      // fontFamily: "Alegreya_400Regular",
      fontFamily: "Alegreya_500Medium",
      marginTop: 5,
      fontSize: 14,
      color: colors.textLight,
    },
  });

  //Item that will be rendered for each quest
  //TO DO: styling
  //TO DO: change press action to route to quest page

  const [questsModalVisible, setQuestsModalVisible] = useState(false);
  const [questID, setQuestID] = useState("");
  const [rewardID, setRewardID] = useState("");
  const [questRewardVisible, setQuestRewardVisible] = useState(false);

  const [levelUpModalVisible, setLevelUpModalVisible] = useState(false);
  const { userData } = useUserData();

  const calcExpLoss = (quest: Quest): number => {
    const now = toMidnight(new Date());
    let totalOverdueDays = 0;

    const dueDate = quest.dueDate;
    if (!userData?.lastLogin) return -1;
    if (userData.lastLogin.getTime() > dueDate.getTime()) {
      const overdueTime = now.getTime() - userData.lastLogin.getTime();
      const overdueDays = Math.floor(overdueTime / (1000 * 3600 * 24));
      if (overdueDays > 0) {
        totalOverdueDays += overdueDays;
      }
    } else {
      const overdueTime = now.getTime() - dueDate.getTime();
      const overdueDays = Math.floor(overdueTime / (1000 * 3600 * 24));
      if (overdueDays > 0) {
        totalOverdueDays += overdueDays;
      }
    }

    return totalOverdueDays * 100;
  };


  const renderItem = ({ item }: { item: Quest }) => {
    // const time = new Timestamp(item.dueDate.getSeconds(), item.dueDate.getMilliseconds())
    return (
      <TouchableOpacity
        style={styles.questItem}
        onPress={() => {
          setQuestID(item.id);
          setQuestsModalVisible(true);
        }}
      >
        <Text style={styles.questName}>
          {item.name}{" "}
          {mode === "overdue" ? "  -" + calcExpLoss(item) + " exp" : ""}
        </Text>
        <View style={styles.questDetailsContainer}>
          <Text style={styles.questDescription}>
            {item.description ? item.description : "Quest Details"}
          </Text>
          <View style={styles.questDetailsContainer2}>
            <Text style={styles.questDetails}>
              Difficulty: {item.difficulty} |{" "}
              {!item.repeatable
                ? "Due: " + item.dueDate.toDateString()
                : "Repeatable"}
            </Text>
            <Text style={styles.questSkills}>
              Primary Skill: {item.primarySkill}{" "}
              {item.secondarySkill
                ? "| Secondary Skill: " + item.secondarySkill
                : ""}
            </Text>
            {/*<Text style={styles.questRepeatability}>
              Repeatable: {item.repeatable ? "Yes" : "No"}
            </Text>*/}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  let chosenQuests: Quest[] = quests;
  if (mode === "active") {
    chosenQuests = quests.filter((quest) => quest.active);
  } else if (mode === "inactive") {
    chosenQuests = quests.filter((quest) => !quest.active);
  } else if (mode === "overdue") {
    const now = new Date();
    chosenQuests = quests.filter((quest) => {
      const dueDate = quest.dueDate;
      return (
        quest.active &&
        dueDate instanceof Date &&
        dueDate.getTime() < now.setHours(0, 0, 0, 0) &&
        !quest.repeatable
      );
    });
  }

  //If no quests are chosen, output text.
  if (chosenQuests.length == 0) {
    return (
      <View style={styles.questItem}>
        <Text>No quests available</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.list,
        {
          backgroundColor:
            mode === "overdue" ? colors.cancel : colors.bgDropdown,
        },
      ]}
    >
      <FlatList
        data={chosenQuests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
      <QuestViewModal
        visible={questsModalVisible}
        id={questID}
        onClose={() => {
          setQuestsModalVisible(false);
          setQuestID("");
          //console.log("closing quest view")
        }}
        onReward={() => {
          setQuestsModalVisible(false);
          setRewardID(questID);
          setQuestID("");
          setQuestRewardVisible(true);
          //console.log("reward triggered trigger")
        }}
      ></QuestViewModal>

      <QuestRewardModal
        visible={questRewardVisible}
        id={rewardID}
        onClose={() => {
          setRewardID("");
          setQuestRewardVisible(false);
        }}
        onLevelUp={() => {
          setQuestRewardVisible(false);
          //setQuestID("");
          setRewardID("");
          setLevelUpModalVisible(true);
          console.log("quest triggered level up")
        }}
      ></QuestRewardModal>
      <LevelUpModal
        visible={levelUpModalVisible}
        onClose={() => {
          setLevelUpModalVisible(false)
        }}
      ></LevelUpModal>


    </View>
  );
};

export default QuestsList;
