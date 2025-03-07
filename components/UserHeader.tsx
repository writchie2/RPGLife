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
import colors from "@/constants/colors";
import { router } from "expo-router";
import { auth } from "../FirebaseConfig";
import { useState } from "react";
import NavigationModal from "./NavigationModal";
import { useUserData } from "@/contexts/UserContext";
import { UserData } from "@/utils/types";
import calcEXP from "@/utils/calcEXP";

interface UserHeaderProps {}
// Interface for Avatar object. Not exported yet as only used in header.
interface Avatar {
  id: number;
  source: any;
  unlockEXP: number;
}

// Array of current Avatar assets. Could expand more and/or move it to it's own file and export it
// UserData now stores an avatarIndex which saves the choise of the user
// unlockEXP could be used to implement rewards at certain levels.
const avatarImages: Avatar[] = [
  { id: 0, source: require("../assets/images/RPGiconBow.png"), unlockEXP: 0 },
  { id: 1, source: require("../assets/images/RPGiconHarp.png"), unlockEXP: 0 },
  {
    id: 2,
    source: require("../assets/images/RPGiconShield.png"),
    unlockEXP: 0,
  },
  { id: 3, source: require("../assets/images/RPGiconStaff.png"), unlockEXP: 0 },
  {
    id: 4,
    source: require("../assets/images/RPGiconSword.png"),
    unlockEXP: 20000,
  },
];

const UserHeader: React.FC<UserHeaderProps> = ({}) => {
  const userData = useUserData();
  const [navVisible, setNavVisible] = useState(false);
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);

  const [level, setLevel] = useState(0);
  const [neededEXP, setNeededEXP] = useState(1000);
  const [progressEXP, setProgressEXP] = useState(0);

  // Render item for the Avatar selector list
  // Will render an avatar choice as locked or unlocked based on user's EXP level
  const renderAvatarItem = ({ item }: { item: Avatar }) => {
    if (userData.userData) {
      if (item.unlockEXP < userData.userData?.exp) {
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              setAvatarPickerVisible(false);
              userData.setAvatar(item.id);
            }}
          >
            <Image style={styles.pickAvatar} source={item.source} />
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              alert("You haven't unlocked this yet!");
            }}
          >
            <Image style={styles.pickAvatarLocked} source={item.source} />
          </TouchableOpacity>
        );
      }
    }
    return null;
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
              source={avatarImages[userData.userData?.avatarIndex || 0].source}
            />
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
            <Image
              style={styles.iconImage}
              source={require("@/assets/images/MenuBTN.png")}
            />
          </TouchableOpacity>

          {/* Awards Button TODO */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              alert("Need to implement " + (progressEXP / neededEXP) * 100)
            }
          >
            <Image
              style={styles.iconImage}
              source={require("@/assets/images/AchievementsBTN.png")}
            />
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
                  <Text style={styles.avatarText}>Choose</Text>
                  <Text style={styles.avatarText}>Avatar</Text>
                </View>
                <FlatList
                  data={avatarImages}
                  renderItem={renderAvatarItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  contentContainerStyle={styles.avatarGrid}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    // marginBottom: 20,
    // marginTop: 45,
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
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 22,
    fontFamily: "Metamorphous_400Regular",
    color: colors.text,
  },
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
  iconImage: {
    height: "60%",
    width: "60%",
  },
  iconButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4a503d",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "60%",
    backgroundColor: colors.bgPrimary,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pickAvatar: {
    width: 100,
    height: 100,
    backgroundColor: colors.bgSecondary,
    borderRadius: 25,
    margin: 3,
    borderWidth: 2,
    borderColor: "#4a503d",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pickAvatarLocked: {
    width: 100,
    height: 100,
    backgroundColor: colors.bgSecondary,
    borderRadius: 25,
    margin: 3,
    borderWidth: 2,
    borderColor: "#c5c5c5",
    opacity: 0.5,
    filter: "grayscale(100%)",
  },
  avatarGrid: {
    justifyContent: "center",
  },
  avatarTextContainer: {
    marginBottom: 30,
    marginTop: 20,
    alignItems: "center",
  },
  avatarText: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 42,
    color: colors.text,
    // marginBottom: 30,
    // marginTop: 20,
  },
});

export default UserHeader;
