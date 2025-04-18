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
  ScrollView,
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
import QuestsList from "../../components/QuestsList";
import { useUserData } from "@/contexts/UserContext";
import { BackHandler, Alert } from "react-native";
import CreateQuestModal from "@/components/CreateQuestModal";

//import { fetchUserData } from '../../utils/firestoreUtils';
//import { saveUserData, getUserData } from '../../utils/storageUtils';
import { UserData, Quest, Skill, Checkpoint } from "../../utils/types";

// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import UserHeader from "@/components/UserHeader";

// TODO Implement Quest Page functionality
export default function QuestMainPage() {
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
      marginBottom: 20,
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
    sectionTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    sectionTitle: {
      fontSize: 24,
      fontFamily: "Metamorphous_400Regular",
      color: colors.text,
    },
    dropdownContainer: {
      position: "relative",
      // marginBottom: 20,
      marginBottom: 40,
    },
    section: {
      zIndex: 1,
      backgroundColor: colors.bgTertiary,
      padding: 10,
      borderRadius: 8,
      height: 60,
      justifyContent: "center",
    },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
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
  });

  const user = auth.currentUser;
  const userData = useUserData();

  const [questListVisible, setQuestListVisible] = useState(false);
  const [pastQuestListVisible, setPastQuestListVisible] = useState(false);
  const [questModalVisible, setQuestModalVisible] = useState(false);


  return (
    <View style={styles.container}>
      {/* User section similar to home page user section */}
      <View style={styles.headerContainer}>
        <UserHeader></UserHeader>
      </View>

      <View style={styles.scrollLine}></View>
      <ScrollView style={styles.scrollContainer}>
        <View>
          {/* Active Quests Section */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.section}
              onPress={() => setQuestListVisible(!questListVisible)}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>
                  {questListVisible ? "Active Quests" : "Active Quests"}
                </Text>
                <Text style={styles.sectionTitle}>
                  {questListVisible ? "▲" : "▼"}
                </Text>
              </View>
            </TouchableOpacity>
            {questListVisible && (
              <QuestsList
                quests={userData.userData?.quests || []}
                mode="active"
              />
            )}
          </View>

          {/* Completed Quests Section */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.section}
              onPress={() => setPastQuestListVisible(!pastQuestListVisible)}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>
                  {pastQuestListVisible ? "Completed" : "Completed"}
                </Text>
                <Text style={styles.sectionTitle}>
                  {pastQuestListVisible ? "▲" : "▼"}
                </Text>
              </View>
            </TouchableOpacity>
            {pastQuestListVisible && (
              <QuestsList
                quests={userData.userData?.quests || []}
                mode="inactive"
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Quest Creation Modal */}
      <CreateQuestModal
        visible={questModalVisible}
        onClose={() => setQuestModalVisible(false)}
      />

      {/* Add Button */}
      <Pressable
        style={styles.addButton}
        onPress={() => setQuestModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}
