import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, BackHandler } from "react-native";
import { router } from "expo-router";
import { useUserData } from "@/contexts/UserContext";
import { auth } from "../../FirebaseConfig";
import SkillsList from "../../components/SkillsList";
import UserHeader from "@/components/UserHeader";
import CreateSkillModal from "@/components/CreateSkillModal";
import { useTheme } from "@/contexts/ThemeContext";

export default function SkillsPage() {
  const colors = useTheme();
  const userData = useUserData();

  useEffect(() => {
    const backAction = () => {
      router.replace("/(main)");
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  const [skillsListVisible, setSkillsListVisible] = useState(false);
  const [pastSkillsListVisible, setPastSkillsListVisible] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).headerContainer}>
        <UserHeader />
      </View>
      <View style={styles(colors).scrollLine}>
        <Text style={styles(colors).pageTitle}>Skills</Text>
      </View>
      <ScrollView style={styles(colors).scrollContainer}>
        <View style={styles(colors).settingsContainer}>
          <TouchableOpacity
            onPress={() => setSkillsListVisible(!skillsListVisible)}
            style={styles(colors).section}
          >
            <View style={styles(colors).splitRowContainer}>
              <Text style={styles(colors).sectionTitle}>Active Skills</Text>
              <Text style={styles(colors).icon}>{skillsListVisible ? "▲" : "▼"}</Text>
            </View>
          </TouchableOpacity>
          {skillsListVisible && (
            <SkillsList
              skills={userData.userData?.skills || []}
              mode="active"
            />
          )}

          <TouchableOpacity
            onPress={() => setPastSkillsListVisible(!pastSkillsListVisible)}
            style={styles(colors).section}
          >
            <View style={styles(colors).splitRowContainer}>
              <Text style={styles(colors).sectionTitle}>Archived Skills</Text>
              <Text style={styles(colors).icon}>{pastSkillsListVisible ? "▲" : "▼"}</Text>
            </View>
          </TouchableOpacity>
          {pastSkillsListVisible && (
            <SkillsList
              skills={userData.userData?.skills || []}
              mode="inactive"
            />
          )}
        </View>
      </ScrollView>

      <CreateSkillModal
        visible={skillsModalVisible}
        onClose={() => setSkillsModalVisible(false)}
      />

      <Pressable style={styles(colors).addButton} onPress={() => setSkillsModalVisible(true)}>
        <Text style={styles(colors).addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    headerContainer: {
      paddingHorizontal: 20,
      marginVertical: 20,
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
      width: "100%",
      marginBottom: 10,
    },
    sectionTitle: {
      width: "100%",
      fontFamily: "Metamorphous_400Regular",
      fontSize: 24,
      color: colors.text,
    },
    icon: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 24,
      color: colors.text,
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
      fontSize: 36,
      lineHeight: 44,
      color: colors.text,
    },
  });