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
  Platform,
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
import SkillsList from "../../components/SkillsList";
import { useUserData } from "@/contexts/UserContext";
import { BackHandler, Alert } from "react-native";

//import { fetchUserData } from '../../utils/firestoreUtils';
//import { saveUserData, getUserData } from '../../utils/storageUtils';
import { UserData, Skill, Checkpoint } from "../../utils/types";

// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import UserHeader from "@/components/UserHeader";
import CreateSkillModal from "@/components/CreateSkillModal";

export default function SkillsPage() {
  const colors = useTheme(); // used for themes, replaces colors import

  //styling, similar to home page:
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
      // padding: 20,
      paddingVertical: 20,
    },
    headerContainer: {
      paddingHorizontal: 20,
      // marginVertical: 20,
      ...Platform.select({
        ios: {
          marginVertical: 20,
        },
        android: {
          marginBottom: 20,
        },
        default: {
          marginTop: 10,
          marginBottom: 20,
        },
      }),
    },
    pageTitle: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 28,
      color: colors.text,
      textAlign: "center",
    },
    scrollLine: {
      marginHorizontal: 15,
      padding: 5,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: colors.borderLight,
    },
    scrollContainer: {
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    dropdownContainer: {
      position: "relative",
      // marginBottom: 20,
      marginBottom: 40,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 24,
      color: colors.text,
    },
    sectionTitleIcon: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 50,
      color: colors.text,
      position: "absolute",
      right: 0,
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

  const [skillsListVisible, setSkillsListVisible] = useState(false);
  const [pastSkillsListVisible, setPastSkillsListVisible] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* User Header */}
      <View style={styles.headerContainer}>
        <UserHeader></UserHeader>
      </View>

      <View style={styles.scrollLine}>
        <Text style={styles.pageTitle}>Skills</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View>
          {/*section for skill lists*/}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.section}
              onPress={() => setSkillsListVisible(!skillsListVisible)}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Active Skills</Text>
                <Text style={styles.sectionTitleIcon}>
                  {skillsListVisible ? "arrow_drop_down" : "arrow_right"}
                </Text>
              </View>
            </TouchableOpacity>
            {skillsListVisible && (
              <SkillsList
                skills={userData.userData?.skills || []}
                mode="active"
              />
            )}
          </View>

          {/*Archived section*/}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.section}
              onPress={() => setPastSkillsListVisible(!pastSkillsListVisible)}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Archived Skills</Text>
                <Text style={styles.sectionTitleIcon}>
                  {pastSkillsListVisible ? "arrow_drop_down" : "arrow_right"}
                </Text>
              </View>
            </TouchableOpacity>
            {pastSkillsListVisible && (
              <SkillsList
                skills={userData.userData?.skills || []}
                mode="inactive"
              />
            )}
          </View>
        </View>
      </ScrollView>

      <CreateSkillModal
        visible={skillsModalVisible}
        onClose={() => setSkillsModalVisible(false)}
      ></CreateSkillModal>

      {/* Add Button */}
      <Pressable
        style={styles.addButton}
        onPress={() => setSkillsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}
