import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler } from "react-native";

// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import
import UserHeader from "@/components/UserHeader";

import AchievementsList from "@/components/AchievementsList";

// Define the achievement structure
// type Achievement = {
//   title: string;
//   level: number;
//   progress?: number; // If present, it means the achievement is in progress
// };

export default function AchievementsPage() {
  const colors = useTheme(); // used for themes, replaces colors import
  // Styles
  const styles = StyleSheet.create({
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
      padding: 5,
      color: colors.text,
      textAlign: "center",
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
  });

  // const [completedAchievements, setCompletedAchievements] = useState<
  //   Achievement[]
  // >([]);
  // const [inProgressAchievements, setInProgressAchievements] = useState<
  //   Achievement[]
  // >([]);

  return (
    <View style={styles.container}>
      {/* User Header */}
      <View style={styles.headerContainer}>
        <UserHeader />
      </View>

      <View style={styles.scrollLine}></View>
      <Text style={styles.pageTitle}>Achievements</Text>
      <View style={styles.scrollLine}></View>

      {/* Achievements List */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <AchievementsList />
      </ScrollView>
    </View>
  );
}
