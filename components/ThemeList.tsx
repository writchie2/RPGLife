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

// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import { useUserData } from "@/contexts/UserContext";
import calcEXP from "@/utils/calcEXP";

// Types for Title object
export type theme = {
  id: number;
  catagory: string;
  title: string;
  unlockLevel: number;
  progress: number;
  preview: any;
  message: string;
};

//preview:
// bgPrimary, bgSecondary, borderInput, textDark
export const themeData: theme[] = [
  {
    id: 0,
    catagory: "default",
    title: "Default",
    unlockLevel: 0,
    progress: 0,
    preview: ["#f1f3de", "#C2CFA0", "#656E4A", "#394022"],
    message: "Unlocked at Character level 0!",
  },
  {
    id: 1,
    catagory: "dark",
    title: "Dark",
    unlockLevel: 0,
    progress: 0,
    preview: ["#2E3224", "#3E4431", "#8a9772", "#f1f3de"],
    message: "Unlocked at Character level 0!",
  },
  {
    id: 2,
    catagory: "strength",
    title: "Strength",
    unlockLevel: 30,
    progress: 0,
    preview: ["#262629", "#b5b5b9", "#833134", "#962427"],
    message: "Unlocked at Strength level 30!",
  },
  {
    id: 3,
    catagory: "vitality",
    title: "Vitality",
    unlockLevel: 30,
    progress: 0,
    preview: ["#262629", "#b5b5b9", "#2b6881", "#247d9a"],
    message: "Unlocked at Vitality level 30!",
  },
  {
    id: 4,
    catagory: "agility",
    title: "Agility",
    unlockLevel: 30,
    progress: 0,
    preview: ["#262629", "#b5b5b9", "#48642d", "#456d00"],
    message: "Unlocked at Agility level 30!",
  },
  {
    id: 5,
    catagory: "intelligence",
    title: "Intelligence",
    unlockLevel: 30,
    progress: 0,
    preview: ["#262629", "#b5b5b9", "#673273", "#824092"],
    message: "Unlocked at Intelligence level 30!",
  },
  {
    id: 6,
    catagory: "charisma",
    title: "Charisma",
    unlockLevel: 30,
    progress: 0,
    preview: ["#262629", "#b5b5b9", "#60522b", "#816c2f"],
    message: "Unlocked at Charisma level 30!",
  },
  {
    id: 7,
    catagory: "adventurer",
    title: "Adventurer",
    unlockLevel: 10,
    progress: 0,
    preview: ["#eaf3fb", "#bfd7ea", "#5e7897", "#2b3c50"],
    message: "Unlocked at Character level 10!",
  },
  {
    id: 8,
    catagory: "heroic",
    title: "Heroic",
    unlockLevel: 20,
    progress: 0,
    preview: ["#fbeeee", "#e7b6b6", "#7e4b4b", "#4d2e2e"],
    message: "Unlocked at Character level 20!",
  },
  {
    id: 9,
    catagory: "lord",
    title: "Lord",
    unlockLevel: 30,
    progress: 0,
    preview: ["#f3efff", "#c8b7e6", "#715c99", "#3b2f4f"],
    message: "Unlocked at Character level 30!",
  },
  {
    id: 10,
    catagory: "overlord",
    title: "Overlord",
    unlockLevel: 40,
    progress: 0,
    preview: ["#FF6F61", "#FF9E2C", "#94A3B8", "#0F172A"],
    message: "Unlocked at Character level 40!",
  },
  {
    id: 11,
    catagory: "demigod",
    title: "Demigod",
    unlockLevel: 50,
    progress: 0,
    preview: ["#0D0B1F", "#1C1B3A", "#FF9F43", "#1F1A17"],
    message: "Unlocked at Character level 50!",
  },
];
//preview:
// bgPrimary, bgSecondary, borderInput, textDark

const ThemeList = () => {
  const colors = useTheme(); // used for themes, replaces colors import
  // styles needs to be inside to use with the themes
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
    themeListContainer: {
      // not needed
    },
    themeList: {
      padding: 10,
    },
    pickTheme: {
      fontFamily: "Alegreya_500Medium",
      fontSize: 18,
      color: colors.text,
    },
    pickThemeLocked: {
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
    lockedThemeContainer: {
      // alignItems: "center",
      // justifyContent: "center",
    },
    iconPick: {
      borderColor: colors.borderInput,
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 32,
      color: colors.text,
    },
    pickThemeContainer: {
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
    colorPreviewContainer: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.borderLight,

      position: "absolute",
      right: "35%",
    },
    colorPreviewContainerLocked: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.borderLight,
      opacity: 0.5,

      position: "absolute",
      right: "35%",
    },
    colorPreview: {
      height: 20,
      width: 20,
    },
  });

  // GET USER LEVEL DATA
  const userData = useUserData();
  const [levelOverall, setLevelOverall] = useState(0);
  const [levelSTR, setLevelSTR] = useState(0);
  const [levelVIT, setLevelVIT] = useState(0);
  const [levelAGI, setLevelAGI] = useState(0);
  const [levelINT, setLevelINT] = useState(0);
  const [levelCHR, setLevelCHR] = useState(0);

  const [isVisible, setIsVisible] = useState(false);

  // THEMES OBJECT ARRAY
  const [themes, setThemes] = useState<theme[]>(themeData);

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
    setThemes((prevTheme) =>
      prevTheme.map((theme) => {
        let progress = levelOverall;
        switch (theme.catagory) {
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
        return { ...theme, progress };
      })
    );
  }, [levelOverall, levelSTR, levelVIT, levelAGI, levelINT, levelCHR]);

  // FLATLIST DISPLAY THEMES
  const renderThemeItem = ({ item }: { item: theme }) => {
    let isUnlocked = item.progress >= item.unlockLevel;
    if(userData.userData?.testerMode){
      isUnlocked = true;
    }
    return (
      <TouchableOpacity
        onPress={() =>
          isUnlocked ? userData.setTheme(item.title) : alert(item.message)
        }
        style={isUnlocked ? undefined : styles.lockedThemeContainer}
      >
        <View style={styles.pickThemeContainer}>
          <Text style={isUnlocked ? styles.pickTheme : styles.pickThemeLocked}>
            {item.title}
          </Text>
          <View
            style={
              isUnlocked
                ? styles.colorPreviewContainer
                : styles.colorPreviewContainerLocked
            }
          >
            <View
              style={[
                styles.colorPreview,
                { backgroundColor: item.preview[0] },
              ]}
            ></View>
            <View
              style={[
                styles.colorPreview,
                { backgroundColor: item.preview[1] },
              ]}
            ></View>
            <View
              style={[
                styles.colorPreview,
                { backgroundColor: item.preview[2] },
              ]}
            ></View>
            <View
              style={[
                styles.colorPreview,
                { backgroundColor: item.preview[3] },
              ]}
            ></View>
          </View>
          {/* set icon to lock, checked or unchecked */}
          {!isUnlocked && <Text style={styles.iconPick}>lock</Text>}
          {isUnlocked && userData.userData?.theme === item.title && (
            <Text style={styles.iconPick}>radio_button_checked</Text>
          )}
          {isUnlocked && userData.userData?.theme !== item.title && (
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
          <Text style={styles.sectionTitle}>Themes</Text>
          <Text style={styles.icon}>
            {isVisible ? "arrow_drop_down" : "arrow_right"}
          </Text>
        </View>
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.themeListContainer}>
          <FlatList
            data={themes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderThemeItem}
            contentContainerStyle={styles.themeList}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

export default ThemeList;
