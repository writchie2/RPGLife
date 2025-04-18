import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";

// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import { useUserData } from "@/contexts/UserContext";
import calcEXP from "@/utils/calcEXP";

// Types for achievement and section
type Achievement = {
  title: string;
  reward: string;
  level: number;
  progress: number;
};

type Section = {
  catagory: string;
  isVisible: boolean;
  achievements: Achievement[];
};

const AchievementsList = () => {
  const colors = useTheme(); // used for themes, replaces colors import

  const styles = StyleSheet.create({
    listContainer: {
      marginBottom: 20,
    },
    splitRowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionContainer: {
      marginBottom: 20,
    },
    section: {
      backgroundColor: colors.bgTertiary,
      padding: 10,
      borderRadius: 8,
      height: 50,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    sectionTitle: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 24,
      color: colors.text,
    },
    achievementListContainer: {
      position: "relative",
      top: -50,
      marginBottom: -50,
      zIndex: -1,
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
    achievement: {
      marginHorizontal: 10,
      marginBottom: 5,
      paddingHorizontal: 5,
      paddingVertical: 10,
      borderColor: colors.borderLight,
      borderBottomWidth: 1,
    },
    achievementTitle: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 18,
      color: colors.textLight,
    },
    achievementTextContainer: {
      paddingLeft: 5,
      // paddingTop: 2,
      borderColor: colors.borderLight,
      borderLeftWidth: 0.5,
    },
    achievementText: {
      // marginTop: 5,
      marginTop: 2,
      fontSize: 16,
      color: colors.textLight,
    },
    textFont1: {
      fontFamily: "Alegreya_400Regular",
    },
    textFont2: {
      fontFamily: "Alegreya_500Medium",
    },
    icon: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 50,
      color: colors.text,
      position: "absolute",
      right: 0,
    },
    icon2: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 24,
      color: colors.text,
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

  // When page loads, run the function to calculate the user's Level, neededEXP, and progressEXP
  useEffect(() => {
    const { level } = calcEXP(userData.userData?.exp || 0);
    setLevelOverall(level);
  }, [userData.userData?.exp]);

  useEffect(() => {
    const { level } = calcEXP(userData.userData?.strengthEXP || 0);
    setLevelSTR(level);
  }, [userData.userData?.strengthEXP]);

  useEffect(() => {
    const { level } = calcEXP(userData.userData?.vitalityEXP || 0);
    setLevelVIT(level);
  }, [userData.userData?.vitalityEXP]);

  useEffect(() => {
    const { level } = calcEXP(userData.userData?.agilityEXP || 0);
    setLevelAGI(level);
  }, [userData.userData?.agilityEXP]);

  useEffect(() => {
    const { level } = calcEXP(userData.userData?.intelligenceEXP || 0);
    setLevelINT(level);
  }, [userData.userData?.intelligenceEXP]);

  useEffect(() => {
    const { level } = calcEXP(userData.userData?.charismaEXP || 0);
    setLevelCHR(level);
  }, [userData.userData?.charismaEXP]);

  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});

  // ACHEIVEMENTS OBJECT ARRAY
  const [achievementData, setAchievementData] = useState<Section[]>([
    {
      catagory: "Character",
      isVisible: false, // tracks if section is open or closed
      achievements: [
        {
          title: "Reach lv.5",
          reward: "Novice Title",
          level: 5,
          progress: levelOverall,
        },
        {
          title: "Reach lv.10",
          reward: "Adventurer Title",
          level: 10,
          progress: levelOverall,
        },
        {
          title: "Reach lv.15",
          reward: "Adept Title",
          level: 15,
          progress: levelOverall,
        },
        {
          title: "Reach lv.20",
          reward: "Heroic Title",
          level: 20,
          progress: levelOverall,
        },
        {
          title: "Reach lv.25",
          reward: "Master Title",
          level: 25,
          progress: levelOverall,
        },
        {
          title: "Reach lv.30",
          reward: "Lord Title",
          level: 30,
          progress: levelOverall,
        },
        {
          title: "Reach lv.35",
          reward: "Grandmaster Title",
          level: 35,
          progress: levelOverall,
        },
        {
          title: "Reach lv.40",
          reward: "Overlord Title",
          level: 40,
          progress: levelOverall,
        },
        {
          title: "Reach lv.45",
          reward: "Emperor Title",
          level: 45,
          progress: levelOverall,
        },
        {
          title: "Reach lv.50",
          reward: "Demigod Title",
          level: 50,
          progress: levelOverall,
        },
      ],
    },
    {
      catagory: "Strength",
      isVisible: false, // tracks if section is open or closed
      achievements: [
        {
          title: "Reach lv.1 in Strength",
          reward: "Squire Title",
          level: 1,
          progress: levelSTR,
        },
        {
          title: "Reach lv.5 in Strength",
          reward: "Squire Avatar",
          level: 5,
          progress: levelSTR,
        },
        {
          title: "Reach lv.10 in Strength",
          reward: "Legionary Title",
          level: 10,
          progress: levelSTR,
        },
        {
          title: "Reach lv.15 in Strength",
          reward: "Legionary Avatar",
          level: 15,
          progress: levelSTR,
        },
        {
          title: "Reach lv.20 in Strength",
          reward: "Knight Title",
          level: 20,
          progress: levelSTR,
        },
        {
          title: "Reach lv.25 in Strength",
          reward: "Knight Avatar",
          level: 25,
          progress: levelSTR,
        },
        {
          title: "Reach lv.30 in Strength",
          reward: "Strength Theme & Paladin Title",
          level: 30,
          progress: levelSTR,
        },
      ],
    },
    {
      catagory: "Vitality",
      isVisible: false, // tracks if section is open or closed
      achievements: [
        {
          title: "Reach lv.1 in Vitality",
          reward: "Disciple Title",
          level: 1,
          progress: levelVIT,
        },
        {
          title: "Reach lv.5 in Vitality",
          reward: "Disciple Avatar",
          level: 5,
          progress: levelVIT,
        },
        {
          title: "Reach lv.10 in Vitality",
          reward: "Pugilist Title",
          level: 10,
          progress: levelVIT,
        },
        {
          title: "Reach lv.15 in Vitality",
          reward: "Pugilist Avatar",
          level: 15,
          progress: levelVIT,
        },
        {
          title: "Reach lv.20 in Vitality",
          reward: "Monk Title",
          level: 20,
          progress: levelVIT,
        },
        {
          title: "Reach lv.25 in Vitality",
          reward: "Monk Avatar",
          level: 25,
          progress: levelVIT,
        },
        {
          title: "Reach lv.30 in Vitality",
          reward: "Vitality Theme & Buddha Title",
          level: 30,
          progress: levelVIT,
        },
      ],
    },
    {
      catagory: "Agility",
      isVisible: false, // tracks if section is open or closed
      achievements: [
        {
          title: "Reach lv.1 in Agility",
          reward: "Scout Title",
          level: 1,
          progress: levelAGI,
        },
        {
          title: "Reach lv.5 in Agility",
          reward: "Scout Avatar",
          level: 5,
          progress: levelAGI,
        },
        {
          title: "Reach lv.10 in Agility",
          reward: "Ranger Title",
          level: 10,
          progress: levelAGI,
        },
        {
          title: "Reach lv.15 in Agility",
          reward: "Ranger Avatar",
          level: 15,
          progress: levelAGI,
        },
        {
          title: "Reach lv.20 in Agility",
          reward: "Strider Title",
          level: 20,
          progress: levelAGI,
        },
        {
          title: "Reach lv.25 in Agility",
          reward: "Strider Avatar",
          level: 25,
          progress: levelAGI,
        },
        {
          title: "Reach lv.30 in Agility",
          reward: "Agility Theme & Assassin Title",
          level: 30,
          progress: levelAGI,
        },
      ],
    },
    {
      catagory: "Intelligence",
      isVisible: false, // tracks if section is open or closed
      achievements: [
        {
          title: "Reach lv.1 in Intelligence",
          reward: "Apprentice Title",
          level: 1,
          progress: levelINT,
        },
        {
          title: "Reach lv.5 in Intelligence",
          reward: "Apprentice Avatar",
          level: 5,
          progress: levelINT,
        },
        {
          title: "Reach lv.10 in Intelligence",
          reward: "Mage Title",
          level: 10,
          progress: levelINT,
        },
        {
          title: "Reach lv.15 in Intelligence",
          reward: "Mage Avatar",
          level: 15,
          progress: levelINT,
        },
        {
          title: "Reach lv.20 in Intelligence",
          reward: "Archmage Title",
          level: 20,
          progress: levelINT,
        },
        {
          title: "Reach lv.25 in Intelligence",
          reward: "Archmage Avatar",
          level: 25,
          progress: levelINT,
        },
        {
          title: "Reach lv.30 in Intelligence",
          reward: "Intelligence Theme & Wise One Title",
          level: 30,
          progress: levelINT,
        },
      ],
    },
    {
      catagory: "Charisma",
      isVisible: false, // tracks if section is open or closed
      achievements: [
        {
          title: "Reach lv.1 in Charisma",
          reward: "Storyteller Title",
          level: 1,
          progress: levelCHR,
        },
        {
          title: "Reach lv.5 in Charisma",
          reward: "Storyteller Avatar",
          level: 5,
          progress: levelCHR,
        },
        {
          title: "Reach lv.10 in Charisma",
          reward: "Bard Title",
          level: 10,
          progress: levelCHR,
        },
        {
          title: "Reach lv.15 in Charisma",
          reward: "Bard Avatar",
          level: 15,
          progress: levelCHR,
        },
        {
          title: "Reach lv.20 in Charisma",
          reward: "Socialite Title",
          level: 20,
          progress: levelCHR,
        },
        {
          title: "Reach lv.25 in Charisma",
          reward: "Socialite Avatar",
          level: 25,
          progress: levelCHR,
        },
        {
          title: "Reach lv.30 in Charisma",
          reward: "Charisma Theme & Silver-tongued Title",
          level: 30,
          progress: levelCHR,
        },
      ],
    },
  ]);

  // FLATLIST SETUP
  const toggleSection = (index: number) => {
    setAchievementData((prevData) =>
      prevData.map((section, i) =>
        i === index ? { ...section, isVisible: !section.isVisible } : section
      )
    );
  };

  // FLATLIST DISPLAY
  const renderItem = ({ item }: { item: Achievement }) => (
    <View style={styles.achievement}>
      <Text style={styles.achievementTitle}>{item.title}</Text>
      <View style={styles.achievementTextContainer}>
        <Text style={[styles.achievementText, styles.textFont2]}>
          Reward: <Text style={styles.textFont1}>{item.reward}</Text>
        </Text>
        {/* <Text style={styles.achievementText}>Level: {item.level}</Text> */}
        <Text style={[styles.achievementText, styles.textFont2]}>
          Progress:{" "}
          <Text style={styles.textFont1}>
            {item.progress / item.level >= 1
              ? "Complete"
              : `${Math.ceil((item.progress / item.level) * 100)}%`}
          </Text>
        </Text>
      </View>
    </View>
  );

  // Dynamically updating the progress based on user level data
  const updateAchievementProgress = (section: Section): Achievement[] => {
    return section.achievements.map((achievement) => {
      // Update the progress based on the category's specific level
      if (section.catagory === "Character") {
        achievement.progress = levelOverall;
      } else if (section.catagory === "Strength") {
        achievement.progress = levelSTR;
      } else if (section.catagory === "Vitality") {
        achievement.progress = levelVIT;
      } else if (section.catagory === "Agility") {
        achievement.progress = levelAGI;
      } else if (section.catagory === "Intelligence") {
        achievement.progress = levelINT;
      } else if (section.catagory === "Charisma") {
        achievement.progress = levelCHR;
      }
      return achievement;
    });
  };

  return (
    <View style={styles.listContainer}>
      {achievementData.map((section, index) => {
        // Dynamically updating the progress based on user level data
        const updatedAchievements = updateAchievementProgress(section);
        return (
          <View key={index} style={styles.sectionContainer}>
            <TouchableOpacity
              onPress={() => toggleSection(index)}
              style={styles.section}
            >
              <View style={styles.splitRowContainer}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.icon2}>bookmark_border</Text>
                  <Text style={styles.sectionTitle}>{section.catagory}</Text>
                </View>
                {section.isVisible ? (
                  <Text style={styles.icon}>arrow_drop_down</Text>
                ) : (
                  <Text style={styles.icon}>arrow_right</Text>
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.achievementListContainer}>
              {section.isVisible && (
                <FlatList
                  data={section.achievements}
                  keyExtractor={(item, idx) => item.title + idx}
                  renderItem={renderItem}
                  scrollEnabled={false}
                />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default AchievementsList;
