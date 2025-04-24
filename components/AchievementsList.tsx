import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Image,
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
  previewType: string;
  preview: any;
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

    // PREVIEW MODAL STYLES =========================
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent background
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "90%",
      height: "65%",
      backgroundColor: colors.bgPrimary,
      // padding: 20,
      borderRadius: 10,
      // alignItems: "center",
      justifyContent: "space-between",
    },
    previewTextContainer: {
      marginTop: 10,
      marginHorizontal: 10,
      padding: 10,
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: colors.borderLight,
    },
    previewText: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 30,
      color: colors.text,
    },
    previewTextReward: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.text,
      marginTop: 5,
    },
    closeButtonContainer: {
      paddingVertical: 20,
      alignItems: "center",
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
    icons: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 30,
      color: colors.text,
    },
    previewContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    // Avatar Preview
    avatarPreview: {
      height: "60%",
      aspectRatio: 1,

      borderWidth: 3,
      borderRadius: 99,
      borderColor: colors.borderInput,
    },
    // Title Banner Preview
    bannerContainer: {
      // width: "50%",
      width: 185,
    },
    banner: {
      backgroundColor: colors.bgPrimary,
      borderWidth: 1,
      borderColor: colors.borderInput,
      justifyContent: "center",
      alignItems: "center",

      height: 36,
      // position: "absolute",
      bottom: -5,
      width: "100%",
      zIndex: 2,
    },
    characterTitle: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 18,
      // padding: 2,
      color: colors.textDark,
    },

    triangleLeft: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",

      borderRightWidth: 18,
      borderTopWidth: 18,
      borderBottomWidth: 18,

      borderRightColor: colors.borderInput,
      borderTopColor: "transparent",
      borderBottomColor: "transparent",

      position: "absolute",
      bottom: -5,
      left: -10,
      zIndex: 0,
    },
    triangleRight: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",

      borderLeftWidth: 18,
      borderTopWidth: 18,
      borderBottomWidth: 18,

      borderLeftColor: colors.borderInput,
      borderTopColor: "transparent",
      borderBottomColor: "transparent",

      position: "absolute",
      bottom: -5,
      right: -10,
      zIndex: 0,
    },
    // Theme Preview
    titleThemeContainer: {
      alignItems: "center",
      justifyContent: "center",
      gap: 30,
      // needed if set bannerContainer width to %
      // width: "100%",
      // Used if set background color for preview[2]
      // padding: 25,
      // borderRadius: 10,
    },
    colorPreviewContainer: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.borderLight,

      // position: "absolute",
      // right: "35%",
    },
    colorPreview: {
      height: 30,
      width: 30,
    },
  });

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewReward, setPreviewReward] = useState("Title");
  const [previewType, setPreviewType] = useState("none");
  const [preview, setPreview] = useState(
    require("../assets/images/iconDefault.webp")
  );

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
          previewType: "title",
          preview: "Novice",
        },
        {
          title: "Reach lv.10",
          reward: "Adventurer Title & Adventurer Theme",
          level: 10,
          progress: levelOverall,
          previewType: "titleTheme",
          preview: ["Adventurer", "#eaf3fb", "#bfd7ea", "#5e7897", "#2b3c50"],
          // Preview Colors: bgPrimary, bgSecondary, borderInput, textDark
        },
        {
          title: "Reach lv.15",
          reward: "Adept Title",
          level: 15,
          progress: levelOverall,
          previewType: "title",
          preview: "Adept",
        },
        {
          title: "Reach lv.20",
          reward: "Heroic Title & Heroic Theme",
          level: 20,
          progress: levelOverall,
          previewType: "titleTheme",
          preview: ["Heroic", "#fbeeee", "#e7b6b6", "#7e4b4b", "#4d2e2e"],
        },
        {
          title: "Reach lv.25",
          reward: "Master Title",
          level: 25,
          progress: levelOverall,
          previewType: "title",
          preview: "Master",
        },
        {
          title: "Reach lv.30",
          reward: "Lord Title & Lord Theme",
          level: 30,
          progress: levelOverall,
          previewType: "titleTheme",
          preview: ["Lord", "#f3efff", "#c8b7e6", "#715c99", "#3b2f4f"],
        },
        {
          title: "Reach lv.35",
          reward: "Grandmaster Title",
          level: 35,
          progress: levelOverall,
          previewType: "title",
          preview: "Grandmaster",
        },
        {
          title: "Reach lv.40",
          reward: "Overlord Title & Overlord Theme",
          level: 40,
          progress: levelOverall,
          previewType: "titleTheme",
          preview: ["Overlord", "#FF6F61", "#FF9E2C", "#94A3B8", "#0F172A"],
        },
        {
          title: "Reach lv.45",
          reward: "Emperor Title",
          level: 45,
          progress: levelOverall,
          previewType: "title",
          preview: "Emperor",
        },
        {
          title: "Reach lv.50",
          reward: "Demigod Title & Demigod Theme",
          level: 50,
          progress: levelOverall,
          previewType: "titleTheme",
          preview: ["Demigod", "#0D1A1F", "#3A2D6F", "#6A4C8C", "#D78C4E"],
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
          previewType: "title",
          preview: "Squire",
        },
        {
          title: "Reach lv.5 in Strength",
          reward: "Squire Avatar",
          level: 5,
          progress: levelSTR,
          previewType: "avatar",
          preview: require("../assets/images/iconSTR-v2.webp"),
        },
        {
          title: "Reach lv.10 in Strength",
          reward: "Legionary Title",
          level: 10,
          progress: levelSTR,
          previewType: "title",
          preview: "Legionary",
        },
        {
          title: "Reach lv.15 in Strength",
          reward: "Legionary Avatar",
          level: 15,
          progress: levelSTR,
          previewType: "avatar",
          preview: require("../assets/images/avatarSTR-v1.webp"),
        },
        {
          title: "Reach lv.20 in Strength",
          reward: "Knight Title",
          level: 20,
          progress: levelSTR,
          previewType: "title",
          preview: "Knight",
        },
        {
          title: "Reach lv.25 in Strength",
          reward: "Knight Avatar",
          level: 25,
          progress: levelSTR,
          previewType: "avatar",
          preview: require("../assets/images/avatarSTR-v2.webp"),
        },
        {
          title: "Reach lv.30 in Strength",
          reward: "Paladin Title & Strength Theme",
          level: 30,
          progress: levelSTR,
          previewType: "titleTheme",
          preview: ["Paladin", "#262629", "#b5b5b9", "#833134", "#962427"],
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
          previewType: "title",
          preview: "Disciple",
        },
        {
          title: "Reach lv.5 in Vitality",
          reward: "Disciple Avatar",
          level: 5,
          progress: levelVIT,
          previewType: "avatar",
          preview: require("../assets/images/iconVIT-v2.webp"),
        },
        {
          title: "Reach lv.10 in Vitality",
          reward: "Pugilist Title",
          level: 10,
          progress: levelVIT,
          previewType: "title",
          preview: "Pugilist",
        },
        {
          title: "Reach lv.15 in Vitality",
          reward: "Pugilist Avatar",
          level: 15,
          progress: levelVIT,
          previewType: "avatar",
          preview: require("../assets/images/avatarVIT-v1.webp"),
        },
        {
          title: "Reach lv.20 in Vitality",
          reward: "Monk Title",
          level: 20,
          progress: levelVIT,
          previewType: "title",
          preview: "Monk",
        },
        {
          title: "Reach lv.25 in Vitality",
          reward: "Monk Avatar",
          level: 25,
          progress: levelVIT,
          previewType: "avatar",
          preview: require("../assets/images/avatarVIT-v2.webp"),
        },
        {
          title: "Reach lv.30 in Vitality",
          reward: "Buddha Title & Vitality Theme",
          level: 30,
          progress: levelVIT,
          previewType: "titleTheme",
          preview: ["Buddha", "#262629", "#b5b5b9", "#2b6881", "#247d9a"],
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
          previewType: "title",
          preview: "Scout",
        },
        {
          title: "Reach lv.5 in Agility",
          reward: "Scout Avatar",
          level: 5,
          progress: levelAGI,
          previewType: "avatar",
          preview: require("../assets/images/iconAGI-v2.webp"),
        },
        {
          title: "Reach lv.10 in Agility",
          reward: "Ranger Title",
          level: 10,
          progress: levelAGI,
          previewType: "title",
          preview: "Ranger",
        },
        {
          title: "Reach lv.15 in Agility",
          reward: "Ranger Avatar",
          level: 15,
          progress: levelAGI,
          previewType: "avatar",
          preview: require("../assets/images/avatarAGI-v1.webp"),
        },
        {
          title: "Reach lv.20 in Agility",
          reward: "Strider Title",
          level: 20,
          progress: levelAGI,
          previewType: "title",
          preview: "Strider",
        },
        {
          title: "Reach lv.25 in Agility",
          reward: "Strider Avatar",
          level: 25,
          progress: levelAGI,
          previewType: "avatar",
          preview: require("../assets/images/avatarAGI-v2.webp"),
        },
        {
          title: "Reach lv.30 in Agility",
          reward: "Assassin Title & Agility Theme",
          level: 30,
          progress: levelAGI,
          previewType: "titleTheme",
          preview: ["Assassin", "#262629", "#b5b5b9", "#48642d", "#456d00"],
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
          previewType: "title",
          preview: "Apprentice",
        },
        {
          title: "Reach lv.5 in Intelligence",
          reward: "Apprentice Avatar",
          level: 5,
          progress: levelINT,
          previewType: "avatar",
          preview: require("../assets/images/iconINT-v2.webp"),
        },
        {
          title: "Reach lv.10 in Intelligence",
          reward: "Mage Title",
          level: 10,
          progress: levelINT,
          previewType: "title",
          preview: "Mage",
        },
        {
          title: "Reach lv.15 in Intelligence",
          reward: "Mage Avatar",
          level: 15,
          progress: levelINT,
          previewType: "avatar",
          preview: require("../assets/images/avatarINT-v1.webp"),
        },
        {
          title: "Reach lv.20 in Intelligence",
          reward: "Archmage Title",
          level: 20,
          progress: levelINT,
          previewType: "title",
          preview: "Archmage",
        },
        {
          title: "Reach lv.25 in Intelligence",
          reward: "Archmage Avatar",
          level: 25,
          progress: levelINT,
          previewType: "avatar",
          preview: require("../assets/images/avatarINT-v2.webp"),
        },
        {
          title: "Reach lv.30 in Intelligence",
          reward: "Wise One Title & Intelligence Theme",
          level: 30,
          progress: levelINT,
          previewType: "titleTheme",
          preview: ["Wise One", "#262629", "#b5b5b9", "#673273", "#824092"],
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
          previewType: "title",
          preview: "Storyteller",
        },
        {
          title: "Reach lv.5 in Charisma",
          reward: "Storyteller Avatar",
          level: 5,
          progress: levelCHR,
          previewType: "avatar",
          preview: require("../assets/images/iconCHR-v2.webp"),
        },
        {
          title: "Reach lv.10 in Charisma",
          reward: "Bard Title",
          level: 10,
          progress: levelCHR,
          previewType: "title",
          preview: "Bard",
        },
        {
          title: "Reach lv.15 in Charisma",
          reward: "Bard Avatar",
          level: 15,
          progress: levelCHR,
          previewType: "avatar",
          preview: require("../assets/images/avatarCHR-v1.webp"),
        },
        {
          title: "Reach lv.20 in Charisma",
          reward: "Socialite Title",
          level: 20,
          progress: levelCHR,
          previewType: "title",
          preview: "Socialite",
        },
        {
          title: "Reach lv.25 in Charisma",
          reward: "Socialite Avatar",
          level: 25,
          progress: levelCHR,
          previewType: "avatar",
          preview: require("../assets/images/avatarCHR-v2.webp"),
        },
        {
          title: "Reach lv.30 in Charisma",
          reward: "Silver-tongued Title & Charisma Theme",
          level: 30,
          progress: levelCHR,
          previewType: "titleTheme",
          preview: [
            "Silver-tongued",
            "#262629",
            "#b5b5b9",
            "#60522b",
            "#816c2f",
          ],
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
    <TouchableOpacity
      onPress={() => {
        setPreviewVisible(true);
        setPreviewReward(item.reward);
        setPreviewType(item.previewType);
        setPreview(item.preview);
      }}
    >
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
    </TouchableOpacity>
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

      {/* Preview Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={previewVisible}
        onRequestClose={() => setPreviewVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPreviewVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.previewTextContainer}>
                  <Text style={styles.previewText}>- Preview -</Text>
                  <Text style={styles.previewTextReward}>{previewReward}</Text>
                </View>

                <View style={styles.previewContainer}>
                  {previewType === "avatar" ? (
                    <Image style={styles.avatarPreview} source={preview} />
                  ) : (
                    ""
                  )}
                  {previewType === "title" ? (
                    <View style={styles.bannerContainer}>
                      <View style={styles.triangleLeft}></View>
                      <View style={styles.banner}>
                        <Text style={styles.characterTitle}>{preview}</Text>
                      </View>
                      <View style={styles.triangleRight}></View>
                    </View>
                  ) : (
                    ""
                  )}
                  {previewType === "titleTheme" ? (
                    <View style={styles.titleThemeContainer}>
                      <View style={styles.bannerContainer}>
                        <View
                          style={[
                            styles.triangleLeft,
                            {
                              borderRightColor: preview[3],
                            },
                          ]}
                        ></View>
                        <View
                          style={[
                            styles.banner,
                            {
                              backgroundColor: preview[1],
                              borderColor: preview[3],
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.characterTitle,
                              { color: preview[4] },
                            ]}
                          >
                            {preview[0]}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.triangleRight,
                            {
                              borderLeftColor: preview[3],
                            },
                          ]}
                        ></View>
                      </View>
                      <View style={styles.colorPreviewContainer}>
                        <View
                          style={[
                            styles.colorPreview,
                            { backgroundColor: preview[1] }, // bgPrimary
                          ]}
                        ></View>
                        <View
                          style={[
                            styles.colorPreview,
                            { backgroundColor: preview[2] }, // bgSecondary
                          ]}
                        ></View>
                        <View
                          style={[
                            styles.colorPreview,
                            { backgroundColor: preview[3] }, // borderInput
                          ]}
                        ></View>
                        <View
                          style={[
                            styles.colorPreview,
                            { backgroundColor: preview[4] }, // textDark
                          ]}
                        ></View>
                      </View>
                    </View>
                  ) : (
                    ""
                  )}
                </View>

                <View style={styles.closeButtonContainer}>
                  <TouchableOpacity
                    onPress={() => setPreviewVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.icons}>close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default AchievementsList;
