import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  ScrollViewBase,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { Skill } from "../utils/types";
import colors from "@/constants/colors";
import calcEXP from "@/utils/calcEXP";
import SkillViewModal from "./SkillViewModal";

interface SkillsListProps {
  skills: Skill[];
  mode: string;
}
//Component that returns a Flat List with skills from a given skill array
const SkillsList: React.FC<SkillsListProps> = ({
  skills, // Array of skills from UserData interface
  mode, // "active", "inactive", or "all"
}) => {
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [skillID, setSkillID] = useState("");
  //Item that will be rendered for each skill
  //TO DO: styling
  //TO DO: change press action to route to quest page
  const renderItem = ({ item }: { item: Skill }) => (
    <TouchableOpacity
      style={styles.skillItem}
      onPress={() => {
        setSkillID(item.id);
        setSkillModalVisible(true);
      }}
    >
      {/* <View style={styles.splitRowContainer}> */}
      <Text style={styles.skillName}>{item.name}</Text>
      {/* </View> */}
      <View style={styles.skillDetailsContainer}>
        <Text style={styles.skillDescription}>
          {item.description ? item.description : "Skill Details"}
        </Text>
        <View style={styles.skillDetailsContainer2}>
          <Text style={styles.skillTrait}>
            Traits: {item.primaryTrait}
            {item.secondaryTrait ? ` + ${item.secondaryTrait}` : ""}
          </Text>
          {/* exp bar */}
          <View style={styles.expBar}>
            <View
              style={{
                height: "100%",
                width: `${
                  (calcEXP(item.exp).progressEXP /
                    calcEXP(item.exp).neededEXP) *
                  100
                }%`,
                backgroundColor: colors.text,
                borderRadius: 99,
              }}
            ></View>
          </View>
          <View style={styles.splitRowContainer}>
            <Text style={styles.expTrait}>
              {/* Level {Math.floor((item.exp || 1) / 100)} {(item.exp || 0) % 100} exp */}
              Level {calcEXP(item.exp).level}
            </Text>
            <Text style={styles.expTrait}>
              {calcEXP(item.exp).progressEXP}/{calcEXP(item.exp).neededEXP} exp
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  let chosenSkills: Skill[] = skills;
  if (mode === "active") {
    chosenSkills = chosenSkills.filter((skill) => skill.active);
  } else if (mode === "inactive") {
    chosenSkills = chosenSkills.filter((skill) => !skill.active);
  }

  //If no skills are chosen, output text.
  if (chosenSkills.length == 0) {
    return (
      <View style={styles.skillItem}>
        <Text>No skills available</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      <FlatList
        data={chosenSkills}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
      <SkillViewModal
        visible={skillModalVisible}
        id={skillID}
        onClose={() => {
          setSkillModalVisible(false);
          setSkillID("");
        }}
      ></SkillViewModal>
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
    // backgroundColor: colors.bgSecondary,
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
  skillDetailsContainer: {
    // borderLeftWidth: 0.5,
    // paddingLeft: 6,
    // marginLeft: 2.5,
    // borderColor: colors.borderLight,
    // borderBottomWidth: 1,
    // paddingBottom: 6,
    // marginLeft: 2,
  },
  skillDetailsContainer2: {
    borderLeftWidth: 0.5,
    paddingLeft: 6,
    marginLeft: 2.5,
    marginTop: 4,
    borderColor: colors.borderLight,
    // borderBottomWidth: 1,
    // paddingLeft: 5,
    // paddingBottom: 6,
    // paddingTop: 2,
  },
  skillItem: {
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
  splitRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skillName: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 20,
    color: colors.text,
  },
  skillDescription: {
    // fontFamily: "Alegreya_400Regular",
    fontFamily: "Alegreya_500Medium",
    // marginTop: 5,
    marginTop: 4,
    fontSize: 16,
    color: colors.textLight,
  },
  skillTrait: {
    // fontFamily: "Alegreya_400Regular",
    fontFamily: "Alegreya_500Medium",
    // marginTop: 5,
    marginTop: 2,
    fontSize: 14,
    color: colors.textLight,
  },
  expBar: {
    marginTop: 5,
    height: 14,
    backgroundColor: colors.bgPrimary,
    borderWidth: 2,
    borderColor: colors.borderInput,
    borderRadius: 99,
    justifyContent: "center",
  },
  // expProgressBar: {
  //   height: "100%",
  //   // width: "50%",
  //   // width: `${(progressEXP / neededEXP) * 100}%`,
  //   backgroundColor: colors.text,
  //   borderRadius: 99,
  // },
  expTrait: {
    // fontFamily: "Alegreya_400Regular",
    fontFamily: "Alegreya_500Medium",
    marginTop: 2,
    fontSize: 14,
    color: colors.textLight,
  },
});

export default SkillsList;
