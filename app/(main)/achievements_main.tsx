import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler } from "react-native";

import colors from "@/constants/colors";
import UserHeader from "@/components/UserHeader";

// Define the achievement structure
type Achievement = {
  title: string;
  level: number;
  progress?: number; // If present, it means the achievement is in progress
};

export default function AchievementsPage() {
  const [completedAchievements, setCompletedAchievements] = useState<Achievement[]>([]);
  const [inProgressAchievements, setInProgressAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const backAction = () => {
      router.replace("/(main)"); // Navigate back to home
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* User Header */}
      <View style={styles.headerContainer}>
        <UserHeader />
      </View>

      <View style={styles.scrollLine}></View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View>
          {/* Completed Achievements Section */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Completed Achievements</Text>
                <Text style={styles.sectionTitle}>▼</Text>
              </View>
            </TouchableOpacity>
            {completedAchievements.map((item) => (
              <View key={item.title} style={styles.achievementItem}>
                <Text style={styles.achievementTitle}>{item.title} Lvl {item.level}</Text>
              </View>
            ))}
          </View>

          {/* In-Progress Achievements Section */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>In-Progress Achievements</Text>
                <Text style={styles.sectionTitle}>▼</Text>
              </View>
            </TouchableOpacity>
            {inProgressAchievements.map((item) => (
              <View key={item.title} style={styles.achievementItem}>
                <Text style={styles.achievementTitle}>{item.title} Lvl {item.level}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 5, // Reduced from 20 to 5
  },
  scrollLine: {
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  scrollContainer: {
    paddingTop: 10, // Reduced top padding
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    marginBottom: 30,
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
  section: {
    backgroundColor: colors.bgTertiary,
    padding: 10,
    borderRadius: 8,
    height: 60,
    justifyContent: "center",
  },
  achievementItem: {
    backgroundColor: colors.bgSecondary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  achievementTitle: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 18,
    color: colors.text,
  },
});
