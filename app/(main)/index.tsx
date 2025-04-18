import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  ScrollViewBase,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../FirebaseConfig";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { getAuth } from "firebase/auth";

import { fetchUserData } from "../../utils/firestoreUtils";
import { saveUserData, getUserData } from "../../utils/storageUtils";
import { UserData, Quest, Skill, Checkpoint } from "../../utils/types";
import SkillsList from "../../components/SkillsList";
import QuestsList from "../../components/QuestsList";
import CreateSkillModal from "@/components/CreateSkillModal";
import CreateQuestModal from "@/components/CreateQuestModal";
import NavigationModal from "../../components/NavigationModal";
import { useUserData } from "@/contexts/UserContext";

// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import UserHeader from "@/components/UserHeader";
import { useFonts } from "expo-font";
import { Metamorphous_400Regular } from "@expo-google-fonts/metamorphous";
import {
  Alegreya_400Regular,
  Alegreya_500Medium,
} from "@expo-google-fonts/alegreya";

// ICON FONTS - look at fonts.google.com/icons for list/name of icons available
import { MaterialIconsRound_400Regular } from "expo-google-fonts-material-icons-round/400Regular";
import { MaterialIcons_400Regular } from "expo-google-fonts-material-icons/400Regular";
import WelcomeModal from "@/components/WelcomeModal";
import ReturnModal from "@/components/ReturnModal";

export default function HomePage() {
  const colors = useTheme(); // used for themes, replaces colors import

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
      // padding: 20,
      paddingVertical: 20,
    },
    headerContainer: {
      paddingHorizontal: 20,
      marginVertical: 20,
    },
    scrollLine: {
      marginHorizontal: 15,
      borderBottomWidth: 1,
      borderColor: colors.borderLight,
    },
    scrollContainer: {
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    dropdownContainer: {
      position: "relative",
      // marginBottom: 20,
      marginBottom: 40, // need to increase to compensate for scrollContainer Top Padding, also looks better?
    },
    section: {
      zIndex: 1,
      backgroundColor: colors.bgTertiary,
      padding: 10,
      borderRadius: 8,
      height: 60,
      justifyContent: "center",
    },
    sectionTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    sectionTitle: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 24,
      color: colors.text,
    },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      // backgroundColor: colors.bgTertiary,
      backgroundColor: colors.bgSecondary,
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    logoutButton: {
      position: "absolute",
      bottom: 20,
      left: 20,
      backgroundColor: colors.bgTertiary,
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonText: {
      // fontSize: 24,
      // fontWeight: "bold",
      fontSize: 36,
      lineHeight: 44,
      color: colors.text,
    },
    loading: {
      backgroundColor: colors.bgPrimary,
      height: "100%",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      position: "absolute",
      bottom: 0,
      height: "30%",
      width: "100%",
      backgroundColor: colors.bgSecondary,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    modalButton: {
      width: "70%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgPrimary,
      borderRadius: 100,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
      height: 50,
      margin: "5%",
    },
    modalButtonText: {
      fontFamily: "Metamorphous_400Regular",
      color: colors.textDark,
      fontSize: 20,
    },
  });

  const [fontsLoaded] = useFonts({
    Metamorphous_400Regular,
    Alegreya_400Regular,
    Alegreya_500Medium,
    MaterialIconsRound_400Regular,
    MaterialIcons_400Regular,
  });

  const user = auth.currentUser;

  const usersCollection = collection(db, "users");

  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("/(login)");
  });

  const [skillListVisible, setSkillListVisible] = useState(false);
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [questListVisible, setQuestListVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);
  const [questsModalVisible, setQuestsModalVisible] = useState(false);

  const [loading, setLoading] = useState(true); // Not used currently. could be implemented later.
  const { userData, firstLogin } = useUserData();
  //Context for main folder that has the user data.

  // Firebase implementation moved to "@/contexts/UserContext"
  useEffect(() => {
    if (!auth.currentUser) {
      router.replace("/(login)");
      return;
    }
    if (userData) {
      setLoading(false);
      const now = new Date();
      const lastLogin = userData?.lastLogin;
      if (userData.firstLoginComplete === null) {
        setWelcomeModalVisible(true);
      } else if (
        now.getTime() - (lastLogin?.getTime() || now.getTime()) >=
        24 * 60 * 60 * 1000
      ) {
        setReturnModalVisible(true);
      }
    }
  }, [userData]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator style={styles.loading} size="large" />
        <Text>Loading user data...</Text>
      </View>
    );
  }
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {/* Header Component */}
        <View style={styles.headerContainer}>
          <UserHeader></UserHeader>
        </View>

        <View style={styles.scrollLine}></View>
        <ScrollView style={styles.scrollContainer}>
          <View>
            {/* Skills Section */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.section}
                onPress={() => setSkillListVisible(!skillListVisible)}
                // onPress={() => setReturnModalVisible(!skillListVisible)} //I was using this to test
              >
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>
                    {skillListVisible ? "Hide Skills" : "Skills"}
                  </Text>
                  <Text style={styles.sectionTitle}>
                    {skillListVisible ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>
              {skillListVisible && (
                <SkillsList skills={userData?.skills || []} mode="active" />
              )}
            </View>
            {/* Quests Section */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.section}
                onPress={() => setQuestListVisible(!questListVisible)}
              >
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>
                    {questListVisible ? "Hide Quests" : "Quests"}
                  </Text>
                  <Text style={styles.sectionTitle}>
                    {questListVisible ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>
              {questListVisible && (
                <QuestsList quests={userData?.quests || []} mode="active" />
              )}
            </View>
          </View>
        </ScrollView>

        {/* Add Button */}
        <Pressable
          style={styles.addButton}
          onPress={() => {
            setAddModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>

        <CreateSkillModal
          visible={skillsModalVisible}
          onClose={() => setSkillsModalVisible(false)}
        ></CreateSkillModal>
        <CreateQuestModal
          visible={questsModalVisible}
          onClose={() => setQuestsModalVisible(false)}
        ></CreateQuestModal>

        <WelcomeModal
          visible={welcomeModalVisible}
          onClose={() => {
            setWelcomeModalVisible(false);
            firstLogin();
          }}
        ></WelcomeModal>
        <ReturnModal
          visible={returnModalVisible}
          onClose={() => {
            setReturnModalVisible(false);
            firstLogin();
          }}
        ></ReturnModal>

        {/* Modal for Add Button */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={() => setAddModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setAddModalVisible(false);
                      setSkillsModalVisible(true);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Add Skill</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setAddModalVisible(false);
                      setQuestsModalVisible(true);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Add Quest</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}
