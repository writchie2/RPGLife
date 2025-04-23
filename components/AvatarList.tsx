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

// Types for avatar object
export type Avatar = {
  id: number;
  catagory: string;
  source: any;
  unlockLevel: number;
  progress: number;
  message: string;
};

export const avatarsData: Avatar[] = [
  {
    id: 0,
    catagory: "default",
    source: require("../assets/images/iconDefault.webp"),
    unlockLevel: 0,
    progress: 0,
    message: "Unlocked at Character level 0!",
  },
  {
    id: 1,
    catagory: "default",
    source: require("../assets/images/iconSTR-v1.webp"),
    unlockLevel: 0,
    progress: 0,
    message: "Unlocked at Character level 0!",
  },
  {
    id: 2,
    catagory: "default",
    source: require("../assets/images/iconVIT-v1.webp"),
    unlockLevel: 0,
    progress: 0,
    message: "Unlocked at Character level 0!",
  },
  {
    id: 3,
    catagory: "default",
    source: require("../assets/images/iconAGI-v1.webp"),
    unlockLevel: 0,
    progress: 0,
    message: "Unlocked at Character level 0!",
  },
  {
    id: 4,
    catagory: "default",
    source: require("../assets/images/iconINT-v1.webp"),
    unlockLevel: 0,
    progress: 0,
    message: "Unlocked at Character level 0!",
  },
  {
    id: 5,
    catagory: "default",
    source: require("../assets/images/iconCHR-v1.webp"),
    unlockLevel: 0,
    progress: 0,
    message: "Unlocked at Character level 0!",
  },
  {
    id: 6,
    catagory: "strength",
    source: require("../assets/images/iconSTR-v2.webp"),
    unlockLevel: 5,
    progress: 0,
    message: "Unlocked at Strength level 5!",
  },
  {
    id: 7,
    catagory: "vitality",
    source: require("../assets/images/iconVIT-v2.webp"),
    unlockLevel: 5,
    progress: 0,
    message: "Unlocked at Vitality level 5!",
  },
  {
    id: 8,
    catagory: "agility",
    source: require("../assets/images/iconAGI-v2.webp"),
    unlockLevel: 5,
    progress: 0,
    message: "Unlocked at Agility level 5!",
  },
  {
    id: 9,
    catagory: "intelligence",
    source: require("../assets/images/iconINT-v2.webp"),
    unlockLevel: 5,
    progress: 0,
    message: "Unlocked at Intelligence level 5!",
  },
  {
    id: 10,
    catagory: "charisma",
    source: require("../assets/images/iconCHR-v2.webp"),
    unlockLevel: 5,
    progress: 0,
    message: "Unlocked at Charisma level 5!",
  },
  {
    id: 11,
    catagory: "strength",
    source: require("../assets/images/avatarSTR-v1.webp"),
    unlockLevel: 15,
    progress: 0,
    message: "Unlocked at Strength level 15!",
  },
  {
    id: 12,
    catagory: "vitality",
    source: require("../assets/images/avatarVIT-v1.webp"),
    unlockLevel: 15,
    progress: 0,
    message: "Unlocked at Vitality level 15!",
  },
  {
    id: 13,
    catagory: "agility",
    source: require("../assets/images/avatarAGI-v1.webp"),
    unlockLevel: 15,
    progress: 0,
    message: "Unlocked at Agility level 15!",
  },
  {
    id: 14,
    catagory: "intelligence",
    source: require("../assets/images/avatarINT-v1.webp"),
    unlockLevel: 15,
    progress: 0,
    message: "Unlocked at Intelligence level 15!",
  },
  {
    id: 15,
    catagory: "charisma",
    source: require("../assets/images/avatarCHR-v1.webp"),
    unlockLevel: 15,
    progress: 0,
    message: "Unlocked at Charisma level 15!",
  },
  {
    id: 16,
    catagory: "strength",
    source: require("../assets/images/avatarSTR-v2.webp"),
    unlockLevel: 25,
    progress: 0,
    message: "Unlocked at Strength level 25!",
  },
  {
    id: 17,
    catagory: "vitality",
    source: require("../assets/images/avatarVIT-v2.webp"),
    unlockLevel: 25,
    progress: 0,
    message: "Unlocked at Vitality level 25!",
  },
  {
    id: 18,
    catagory: "agility",
    source: require("../assets/images/avatarAGI-v2.webp"),
    unlockLevel: 25,
    progress: 0,
    message: "Unlocked at Agility level 25!",
  },
  {
    id: 19,
    catagory: "intelligence",
    source: require("../assets/images/avatarINT-v2.webp"),
    unlockLevel: 25,
    progress: 0,
    message: "Unlocked at Intelligence level 25!",
  },
  {
    id: 20,
    catagory: "charisma",
    source: require("../assets/images/avatarCHR-v2.webp"),
    unlockLevel: 25,
    progress: 0,
    message: "Unlocked at Charisma level 25!",
  },
];

const AvatarList = () => {
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
    avatarListContainer: {
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
    avatarGrid: {
      alignItems: "center",
      padding: 10,
    },
    pickAvatar: {
      width: 100,
      height: 100,
    },
    pickAvatarLocked: {
      width: 100,
      height: 100,
      opacity: 0.5,
      filter: "grayscale(80%)",
    },
    icon: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 50,
      color: colors.text,
      position: "absolute",
      right: 0,
    },
    lockedAvatarContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    iconLock: {
      // backgroundColor: colors.bgSecondary,
      // borderRadius: 99,
      // padding: 4,
      // borderWidth: 2,
      // fontSize: 32,
      borderColor: colors.borderInput,
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 40,
      color: colors.textDark,
      position: "absolute",
      zIndex: 9,
    },
    pickAvatarContainer: {
      backgroundColor: colors.bgSecondary,
      borderRadius: 25,
      padding: 3,
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

  // GET USER LEVEL DATA
  const userData = useUserData();
  const [levelOverall, setLevelOverall] = useState(0);
  const [levelSTR, setLevelSTR] = useState(0);
  const [levelVIT, setLevelVIT] = useState(0);
  const [levelAGI, setLevelAGI] = useState(0);
  const [levelINT, setLevelINT] = useState(0);
  const [levelCHR, setLevelCHR] = useState(0);

  const [isVisible, setIsVisible] = useState(false);

  // AVATARS OBJECT ARRAY
  const [avatars, setAvatars] = useState<Avatar[]>(avatarsData);

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
    setAvatars((prevAvatars) =>
      prevAvatars.map((avatar) => {
        let progress = levelOverall;
        switch (avatar.catagory) {
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
        return { ...avatar, progress };
      })
    );
  }, [levelOverall, levelSTR, levelVIT, levelAGI, levelINT, levelCHR]);

  // FLATLIST DISPLAY AVATARS
  const renderAvatarItem = ({ item }: { item: Avatar }) => {
    let isUnlocked = item.progress >= item.unlockLevel;
    if (userData.userData?.testerMode) {
      isUnlocked = true;
    }
    return (
      <TouchableOpacity
        onPress={() =>
          isUnlocked ? userData.setAvatar(item.id) : alert(item.message)
        }
        style={isUnlocked ? undefined : styles.lockedAvatarContainer}
      >
        {!isUnlocked && <Text style={styles.iconLock}>lock</Text>}
        <View style={styles.pickAvatarContainer}>
          <Image
            style={isUnlocked ? styles.pickAvatar : styles.pickAvatarLocked}
            source={item.source}
          />
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
          <Text style={styles.sectionTitle}>Avatars</Text>
          <Text style={styles.icon}>
            {isVisible ? "arrow_drop_down" : "arrow_right"}
          </Text>
        </View>
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.avatarListContainer}>
          <FlatList
            data={avatars}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAvatarItem}
            numColumns={3}
            contentContainerStyle={styles.avatarGrid}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

export default AvatarList;
