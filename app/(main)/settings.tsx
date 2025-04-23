/*
 * Where user can reset password if forgotten
 *
 * TODO:
 * Impliment using Firebase
 * Possibly create another confirmation page depending on implimentation
 *
 */
import React, { useState } from "react";
import { auth } from "../../FirebaseConfig";
import { router } from "expo-router";
import UserHeader from "@/components/UserHeader";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import {
  getAuth,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  verifyPasswordResetCode,
  EmailAuthCredential,
} from "@firebase/auth";

import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useUserData } from "@/contexts/UserContext";

// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import

import AvatarList from "@/components/AvatarList"; // allow selecting avatars from settings
import TitlesList from "@/components/TitlesList"; // allow selecting character titles from settings

import EditUsernameModal from "@/components/EditUsernameModal";
import ThemeList from "@/components/ThemeList"; // allow selecting app themes from settings
import EditPasswordModal from "@/components/EditPasswordModal";

export default function Settings() {
  const colors = useTheme(); // used for themes, replaces colors import

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
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
    settingsContainer: {
      alignItems: "center",
      paddingBottom: 40, // needed to prevent cutoff caused by scroll containers paddingTop
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
      marginBottom: 20,
    },
    sectionTitle: {
      width: "100%",
      fontFamily: "Metamorphous_400Regular",
      fontSize: 24,
      color: colors.text,
    },
    logo: {
      height: 200,
      aspectRatio: 1, // maintains correct image width -> aspectRation = width/height
      // marginTop: 5,
      marginBottom: 10,
    },
    form: {
      backgroundColor: colors.bgSecondary,
      marginTop: 15,
      padding: 15,
      borderRadius: 8,
      width: "90%",
      shadowColor: colors.shadowLight, // Shadow color
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
    inputGroup: {
      marginBottom: 8,
    },
    inputLabel: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 18,
      color: colors.text,
      marginBottom: 2,
    },
    inputField: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.textInput,
      paddingHorizontal: 10,
      backgroundColor: colors.bgPrimary,
      height: 48,
      borderColor: colors.borderInput,
      borderWidth: 2,
      borderRadius: 6,
    },
    resetButton: {
      width: "56%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.cancel,
      borderRadius: 100, // full rounded corners
      marginTop: 50,
      padding: 18,
      shadowColor: colors.shadow, // Shadow color to match the button for a cohesive look
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonText: {
      fontFamily: "Metamorphous_400Regular",
      color: colors.textDark, // match title color, slightly darker due to being on darker bg
      fontSize: 20, // Slightly larger for emphasis
    },
    icon: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 40,
      color: colors.text,
      position: "absolute",
      right: 0,
    },
  });

  const { resetAccount, userData, toggleTesterMode } = useUserData();
  const [editUsernameVisible, setEditUsernameVisible] = useState(false);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);

  const resetHandler = () => {
    Alert.alert(
      "Confirm Reset",
      "This will reset you experience, and delete your skills and quests",
      [
        {
          text: "Confirm",
          onPress: () => {
            resetAccount();
          },
        },
        {
          text: "Cancel",
          onPress: () => {},
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <UserHeader></UserHeader>
      </View>
      <View style={styles.scrollLine}>
        <Text style={styles.pageTitle}>Settings</Text>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.settingsContainer}>
          <AvatarList />
          <TitlesList />
          <ThemeList />
          <TouchableOpacity
            onPress={() => setEditUsernameVisible(true)}
            style={styles.section}
          >
            <View style={styles.splitRowContainer}>
              <Text style={styles.sectionTitle}>Change Username</Text>
              <Text style={styles.icon}>person</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setEditPasswordVisible(true)}
            style={styles.section}
          >
            <View style={styles.splitRowContainer}>
              <Text style={styles.sectionTitle}>Change Password</Text>
              <Text style={styles.icon}>password</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              toggleTesterMode();
            }}
            style={styles.section}
          >
            <View style={styles.splitRowContainer}>
              <Text style={styles.sectionTitle}>Tester Mode</Text>
              <Text style={styles.icon}>
                {userData?.testerMode ? "check_circle" : "check_circle_outline"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              auth.signOut();
            }}
            style={styles.section}
          >
            <View style={styles.splitRowContainer}>
              <Text style={styles.sectionTitle}>Logout</Text>
              <Text style={styles.icon}>logout</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => resetHandler()}
          >
            <Text style={styles.buttonText}>Reset Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <EditUsernameModal
        visible={editUsernameVisible}
        onClose={() => {
          setEditUsernameVisible(false);
        }}
      ></EditUsernameModal>
      <EditPasswordModal
        visible={editPasswordVisible}
        onClose={() => {
          setEditPasswordVisible(false);
        }}
      ></EditPasswordModal>
    </View>
  );
}
