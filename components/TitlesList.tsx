import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

import colors from "@/constants/colors";
import { useUserData } from "@/contexts/UserContext";
import calcEXP from "@/utils/calcEXP";

// Types for Title object
export type charTitle = {
  id: number;
  catagory: string;
  title: string;
  unlockLevel: number;
  progress: number;
};

export const charTitlesData: charTitle[] = [
  {
    id: 0,
    catagory: "default",
    title: "- None -",
    unlockLevel: 0,
    progress: 0,
  },
  {
    id: 1,
    catagory: "default",
    title: "Plebeian",
    unlockLevel: 0,
    progress: 0,
  },
  // CHARACTER ACHIEVEMENTS
  {
    id: 2,
    catagory: "character",
    title: "Novice",
    unlockLevel: 5,
    progress: 0,
  },
  {
    id: 3,
    catagory: "character",
    title: "Adventurer",
    unlockLevel: 10,
    progress: 0,
  },
  {
    id: 4,
    catagory: "character",
    title: "Adept",
    unlockLevel: 15,
    progress: 0,
  },
  {
    id: 5,
    catagory: "character",
    title: "Heroic",
    unlockLevel: 20,
    progress: 0,
  },
  {
    id: 6,
    catagory: "character",
    title: "Master",
    unlockLevel: 25,
    progress: 0,
  },
  {
    id: 7,
    catagory: "character",
    title: "Lord",
    unlockLevel: 30,
    progress: 0,
  },
  {
    id: 8,
    catagory: "character",
    title: "Grandmaster",
    unlockLevel: 35,
    progress: 0,
  },
  {
    id: 9,
    catagory: "character",
    title: "Overlord",
    unlockLevel: 40,
    progress: 0,
  },
  {
    id: 10,
    catagory: "character",
    title: "Emperor",
    unlockLevel: 45,
    progress: 0,
  },
  {
    id: 11,
    catagory: "character",
    title: "Demigod",
    unlockLevel: 50,
    progress: 0,
  },
  // STRENGTH ACHIEVEMENTS
  {
    id: 12,
    catagory: "strength",
    title: "Squire",
    unlockLevel: 1,
    progress: 0,
  },
  {
    id: 13,
    catagory: "strength",
    title: "Legionary",
    unlockLevel: 10,
    progress: 0,
  },
  {
    id: 14,
    catagory: "strength",
    title: "Knight",
    unlockLevel: 20,
    progress: 0,
  },
  {
    id: 15,
    catagory: "strength",
    title: "Paladin",
    unlockLevel: 30,
    progress: 0,
  },
  // VITALITY ACHIEVEMENTS
  {
    id: 16,
    catagory: "vitality",
    title: "Disciple",
    unlockLevel: 1,
    progress: 0,
  },
  {
    id: 17,
    catagory: "vitality",
    title: "Pugilist",
    unlockLevel: 10,
    progress: 0,
  },
  {
    id: 18,
    catagory: "vitality",
    title: "Monk",
    unlockLevel: 20,
    progress: 0,
  },
  {
    id: 19,
    catagory: "vitality",
    title: "Buddha",
    unlockLevel: 30,
    progress: 0,
  },
  // AGILITY ACHIEVEMENTS
  {
    id: 20,
    catagory: "agility",
    title: "Scout",
    unlockLevel: 1,
    progress: 0,
  },
  {
    id: 21,
    catagory: "agility",
    title: "Ranger",
    unlockLevel: 10,
    progress: 0,
  },
  {
    id: 22,
    catagory: "agility",
    title: "Strider",
    unlockLevel: 20,
    progress: 0,
  },
  {
    id: 23,
    catagory: "agility",
    title: "Assassin",
    unlockLevel: 30,
    progress: 0,
  },
  // INTELLIGENCE ACHIEVEMENTS
  {
    id: 24,
    catagory: "intelligence",
    title: "Apprentice",
    unlockLevel: 1,
    progress: 0,
  },
  {
    id: 25,
    catagory: "intelligence",
    title: "Mage",
    unlockLevel: 10,
    progress: 0,
  },
  {
    id: 26,
    catagory: "intelligence",
    title: "Archmage",
    unlockLevel: 20,
    progress: 0,
  },
  {
    id: 27,
    catagory: "intelligence",
    title: "Wise One",
    unlockLevel: 30,
    progress: 0,
  },
  // CHARISMA ACHIEVEMENTS
  {
    id: 28,
    catagory: "charisma",
    title: "Storyteller",
    unlockLevel: 1,
    progress: 0,
  },
  {
    id: 29,
    catagory: "charisma",
    title: "Bard",
    unlockLevel: 10,
    progress: 0,
  },
  {
    id: 30,
    catagory: "charisma",
    title: "Socialite",
    unlockLevel: 20,
    progress: 0,
  },
  {
    id: 31,
    catagory: "charisma",
    title: "Silver-tongued",
    unlockLevel: 30,
    progress: 0,
  },
];

const TitlesList = () => {
  // GET USER LEVEL DATA
  const userData = useUserData();
  const [levelOverall, setLevelOverall] = useState(0);
  const [levelSTR, setLevelSTR] = useState(0);
  const [levelVIT, setLevelVIT] = useState(0);
  const [levelAGI, setLevelAGI] = useState(0);
  const [levelINT, setLevelINT] = useState(0);
  const [levelCHR, setLevelCHR] = useState(0);

  const [isVisible, setIsVisible] = useState(false);

  // TITLES OBJECT ARRAY
  const [characterTitles, setCharacterTitles] =
    useState<charTitle[]>(charTitlesData);

  // Calculate levels on load
  useEffect(() => {
    const user = userData.userData;
    setLevelOverall(calcEXP(user?.exp || 0).level);
    setLevelSTR(calcEXP(user?.strengthEXP || 0).level);
    setLevelVIT(calcEXP(user?.vitalityEXP || 0).level);
    setLevelAGI(calcEXP(user?.agilityEXP || 0).level);
    setLevelINT(calcEXP(user?.intelligenceEXP || 0).level);
    setLevelCHR(calcEXP(user?.charismaEXP || 0).level);
  }, [userData.userData]);

  // Update progress when levels change
  useEffect(() => {
    setCharacterTitles((prevCharTitles) =>
      prevCharTitles.map((title) => {
        let progress = levelOverall;
        switch (title.catagory) {
          case "character":
            progress = levelOverall;
            break;
          case "strength":
            progress = levelSTR;
            break;
          case "vitality":
            progress = levelVIT;
            break;
          case "agility":
            progress = levelAGI;
            break;
          case "intelligence":
            progress = levelINT;
            break;
          case "charisma":
            progress = levelCHR;
            break;
        }
        return { ...title, progress };
      })
    );
  }, [levelOverall, levelSTR, levelVIT, levelAGI, levelINT, levelCHR]);

  // FLATLIST DISPLAY TITLES
  const renderCharTitleItem = ({ item }: { item: charTitle }) => {
    const isUnlocked = item.progress >= item.unlockLevel;
    return (
      <TouchableOpacity
        onPress={() =>
          isUnlocked
            ? userData.setCharacterTitle(item.title)
            : alert("You haven't unlocked this yet!")
        }
        style={isUnlocked ? undefined : styles.lockedCharTitleContainer}
      >
        <View style={styles.pickCharTitleContainer}>
          <Text
            style={
              isUnlocked ? styles.pickCharTitle : styles.pickCharTitleLocked
            }
          >
            {item.title}
          </Text>
          {/* set icon to lock, checked or unchecked */}
          {!isUnlocked && <Text style={styles.iconPick}>lock</Text>}
          {isUnlocked && userData.userData?.characterTitle === item.title && (
            <Text style={styles.iconPick}>radio_button_checked</Text>
          )}
          {isUnlocked && userData.userData?.characterTitle !== item.title && (
            <Text style={styles.iconPick}>radio_button_unchecked</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.listContainer}>
      <TouchableOpacity
        onPress={() => setIsVisible(!isVisible)}
        style={styles.section}
      >
        <View style={styles.splitRowContainer}>
          <Text style={styles.sectionTitle}>Titles</Text>
          <Text style={styles.icon}>
            {isVisible ? "arrow_drop_down" : "arrow_right"}
          </Text>
        </View>
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.charTitleListContainer}>
          <FlatList
            data={characterTitles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCharTitleItem}
            contentContainerStyle={styles.charTitleList}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginBottom: 20,
    position: "relative",
    // top: -50,
    // marginBottom: -50,
    zIndex: -1,
    borderRadius: 8,
    width: "100%",
    // paddingTop: 50,
    backgroundColor: colors.bgDropdown,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  splitRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  section: {
    backgroundColor: colors.bgTertiary,
    padding: 10,
    borderRadius: 8,
    height: 50,
  },
  sectionTitle: {
    width: "100%",
    fontFamily: "Metamorphous_400Regular",
    fontSize: 24,
    color: colors.text,
  },
  charTitleListContainer: {
    // not needed
  },
  charTitleList: {
    padding: 10,
  },
  pickCharTitle: {
    fontFamily: "Alegreya_500Medium",
    fontSize: 18,
    color: colors.text,
  },
  pickCharTitleLocked: {
    fontFamily: "Alegreya_500Medium",
    fontSize: 18,
    color: colors.text,
    opacity: 0.5,
  },
  icon: {
    fontFamily: "MaterialIconsRound_400Regular",
    fontSize: 50,
    color: colors.text,
    position: "absolute",
    right: 0,
  },
  lockedCharTitleContainer: {
    // alignItems: "center",
    // justifyContent: "center",
  },
  iconPick: {
    borderColor: colors.borderInput,
    fontFamily: "MaterialIconsRound_400Regular",
    fontSize: 32,
    color: colors.text,
  },
  pickCharTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: colors.bgSecondary,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 5,
    margin: 3,
    borderWidth: 2,
    borderColor: colors.borderInput,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
});

export default TitlesList;
