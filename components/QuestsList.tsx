import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Timestamp } from "firebase/firestore";

import { Quest } from "../utils/types";
import colors from "@/constants/colors";
import QuestViewModal from "./QuestViewModal";

interface QuestsListProps {
  quests: Quest[];
  mode: string;
}

//Component that returns a Flat List with quests from a given quest array
const QuestsList: React.FC<QuestsListProps> = ({
  quests, // Array of quests from UserData interface
  mode, // "active", "inactive", or "all"
}) => {
  //Item that will be rendered for each quest
  //TO DO: styling
  //TO DO: change press action to route to quest page

  const [questsModalVisible, setQuestsModalVisible] = useState(false);
  const [questID, setQuestID] = useState("");
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
        <Text style={styles.questName}>{item.name}</Text>
        <View style={styles.questDetailsContainer}>
          <Text style={styles.questDescription}>
            {item.description ? item.description : "Quest Details"}
          </Text>
          <View style={styles.questDetailsContainer2}>
            <Text style={styles.questDetails}>
              Difficulty: {item.difficulty} | Due: {item.dueDate.toDateString()}
            </Text>
            <Text style={styles.questSkills}>
              Primary Skill: {item.primarySkill}{" "}
              {item.secondarySkill
                ? "| Secondary Skill: " + item.secondarySkill
                : ""}
            </Text>
            <Text style={styles.questRepeatability}>
              Repeatable: {item.repeatable ? "Yes" : "No"}
            </Text>
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
    <View style={styles.list}>
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
        }}
      ></QuestViewModal>
    </View>
  );
};

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

export default QuestsList;
