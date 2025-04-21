import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from "react-native";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import { router } from "expo-router";
import { auth } from "../FirebaseConfig";
import { useState } from "react";
import NavigationModal from "./NavigationModal";
import { useUserData } from "@/contexts/UserContext";
import { UserData } from "@/utils/types";
import calcEXP from "@/utils/calcEXP";

// import list of avatars from AvatarList
import { avatarsData, Avatar } from "@/components/AvatarList";

interface UserHeaderProps {}

const UserHeader: React.FC<UserHeaderProps> = ({}) => {
  const colors = useTheme(); // used for themes, replaces colors import

  const styles = StyleSheet.create({
    headerContainer: {
      // marginBottom: 20,
      marginTop: "10%",
      // padding: 10,
      // gap: "2%",
      // height: 130,
      flexDirection: "row",
      alignItems: "center",
      height: 110,
      // gap: 12,
      gap: "3%",
      width: "100%",
    },
    userSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.bgSecondary,
      padding: 10,
      borderRadius: 6,
      // width: "85%",
      flex: 1,
      height: "100%",
    },
    buttonContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      // alignItems: "center",
      // gap: 10,
      gap: "10%",
      // width: "13%",
      height: "100%",
    },
    expBar: {
      marginTop: 10,
      marginBottom: 2,
      height: 14,
      backgroundColor: colors.bgPrimary,
      borderWidth: 2,
      borderColor: colors.borderInput,
      borderRadius: 99,
      justifyContent: "center",
      // width: "90%",
    },
    expProgressBar: {
      height: "100%",
      backgroundColor: colors.text,
      borderRadius: 99,
    },
    levelInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    levelText: {
      // fontFamily: "Metamorphous_400Regular",
      // fontFamily: "Alegreya_400Regular",
      fontFamily: "Alegreya_500Medium",
      fontSize: 14,
      color: colors.text,
    },
    avatar: {
      height: "90%",
      aspectRatio: 1,
      backgroundColor: colors.bgPrimary,
      borderRadius: 40,

      borderWidth: 2,
      borderColor: colors.borderInput,
    },
    userInfo: {
      flex: 1,
    },
    username: {
      fontSize: 22,
      fontFamily: "Metamorphous_400Regular",
      color: colors.text,
    },
    // NAV BUTTONS ===============================
    iconButton: {
      // height: "47%",
      // height: 48,
      height: "45%",
      aspectRatio: 1,
      backgroundColor: colors.bgSecondary,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
    },
    iconMenu: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 40,
      color: colors.textLight,
    },
    // AVATAR PICKER STYLES =========================
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
      // justifyContent: "center",
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
    lockedAvatarContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    iconLock: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 40,
      color: colors.textDark,
      position: "absolute",
      zIndex: 9,
    },
    avatarTextContainer: {
      marginTop: 10,
      marginHorizontal: 10,
      padding: 10,
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: colors.borderLight,
    },
    avatarText: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 32,
      color: colors.text,
      // marginBottom: 30,
      // marginTop: 20,
    },
    closeButtonContainer: {
      marginVertical: 10,
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
    // Character Title Banner ======================
    banner: {
      backgroundColor: colors.bgPrimary,
      borderWidth: 1,
      borderColor: colors.borderInput,
      justifyContent: "center",
      alignItems: "center",

      height: 18,
      position: "absolute",
      bottom: -5,
      width: "100%",
      zIndex: 2,
    },
    characterTitle: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 9,
      // padding: 2,
      color: colors.textDark,
    },

    triangleLeft: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",

      borderRightWidth: 9,
      borderTopWidth: 9,
      borderBottomWidth: 9,

      borderRightColor: colors.borderInput,
      borderTopColor: "transparent",
      borderBottomColor: "transparent",

      position: "absolute",
      bottom: -5,
      left: -5,
      zIndex: 0,
    },
    triangleRight: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",

      borderLeftWidth: 9,
      borderTopWidth: 9,
      borderBottomWidth: 9,

      borderLeftColor: colors.borderInput,
      borderTopColor: "transparent",
      borderBottomColor: "transparent",

      position: "absolute",
      bottom: -5,
      right: -5,
      zIndex: 0,
    },
  });

  const userData = useUserData();
  const [navVisible, setNavVisible] = useState(false);
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);

  const [level, setLevel] = useState(0);
  const [neededEXP, setNeededEXP] = useState(1000);
  const [progressEXP, setProgressEXP] = useState(0);

  // Trait levels for avatar picker
  const [levelSTR, setLevelSTR] = useState(0);
  const [levelVIT, setLevelVIT] = useState(0);
  const [levelAGI, setLevelAGI] = useState(0);
  const [levelINT, setLevelINT] = useState(0);
  const [levelCHR, setLevelCHR] = useState(0);

  const [avatars, setAvatars] = useState<Avatar[]>(avatarsData);

  // Render item for the Avatar selector list
  // Will render an avatar choice as locked or unlocked based on user levels
  const renderAvatarItem = ({ item }: { item: Avatar }) => {
    let isUnlocked = item.progress >= item.unlockLevel;
    if(userData.userData?.testerMode){
      isUnlocked = true;
    }
    return (
      <TouchableOpacity
        onPress={() =>
          isUnlocked
            ? userData.setAvatar(item.id)
            : alert("You haven't unlocked this yet!")
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

  // When page loads, run the function to calculate the user's Level, neededEXP, and progressEXP
  useEffect(() => {
    const { neededEXP, level, progressEXP } = calcEXP(
      userData.userData?.exp || 0
    );
    setLevel(level);
    setNeededEXP(neededEXP);
    setProgressEXP(progressEXP);
  }, [userData.userData?.exp]);

  // Calculate trait levels on load
  useEffect(() => {
    const user = userData.userData;
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
        let progress = level;
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
  }, [level, levelSTR, levelVIT, levelAGI, levelINT, levelCHR]);

  return (
    <View>
      {/* Navigation Modal (hidden) */}
      <NavigationModal
        visible={navVisible}
        onClose={() => setNavVisible(false)}
      ></NavigationModal>

      {/* Header */}
      <View style={styles.headerContainer}>
        {/* User Section: Avater, Username, EXP Bar, Level Info */}
        <View style={styles.userSection}>
          {/* Avatar. Will launch avatar picker when pressed */}
          <TouchableOpacity onPress={() => setAvatarPickerVisible(true)}>
            <Image
              style={styles.avatar}
              source={avatars[userData.userData?.avatarIndex || 0].source}
            />
            {/* Shows Character Title Banner - If "- None -" is not selected */}
            {userData.userData?.characterTitle !== "- None -" && (
              <View>
                <View style={styles.triangleLeft}></View>
                <View style={styles.banner}>
                  <Text style={styles.characterTitle}>
                    {userData.userData?.characterTitle}
                  </Text>
                </View>
                <View style={styles.triangleRight}></View>
              </View>
            )}
          </TouchableOpacity>

          {/* User Info: Username, EXP Bar, Level Info */}
          <View style={styles.userInfo}>
            <Text style={styles.username}>{userData.userData?.username}</Text>

            <View style={styles.expBar}>
              <View
                style={[
                  styles.expProgressBar,
                  { width: `${(progressEXP / neededEXP) * 100}%` },
                ]}
              ></View>
            </View>

            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {level}</Text>
              <Text style={styles.levelText}>
                {progressEXP}/{neededEXP} exp
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons: Navigation and Awards */}
        <View style={styles.buttonContainer}>
          {/* Navigation Button */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setNavVisible(true)}
          >
            <Text style={styles.iconMenu}>menu</Text>
          </TouchableOpacity>

          {/* Awards Button */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              router.push("/(main)/achievements_main");
            }}
          >
            <Text style={styles.iconMenu}>military_tech</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={avatarPickerVisible}
        onRequestClose={() => setAvatarPickerVisible(false)}
      >
        {/* TouchableWithoutFeedback to detect taps outside the modal. Also somewhat simulates slide to cancel for iOS. */}
        <TouchableWithoutFeedback onPress={() => setAvatarPickerVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.avatarTextContainer}>
                  <Text style={styles.avatarText}>Choose Avatar</Text>
                </View>
                <FlatList
                  data={avatars}
                  renderItem={renderAvatarItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  contentContainerStyle={styles.avatarGrid}
                />
                <View style={styles.closeButtonContainer}>
                  <TouchableOpacity
                    onPress={() => setAvatarPickerVisible(false)}
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

export default UserHeader;
