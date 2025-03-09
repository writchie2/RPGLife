import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
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
      <UserHeader />
      <Text style={styles.title}>Achievements</Text>

      {/* Completed Achievements Section */}
      <TouchableOpacity 
        style={styles.section} 
        onPress={() => {} /* Toggle visibility or fetch achievements */}
      >
        <Text style={styles.sectionTitle}>Completed Achievements ▼</Text>
      </TouchableOpacity>
      <FlatList
        data={completedAchievements}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.achievementItem}>
            <Text style={styles.achievementTitle}>{item.title} Lvl{item.level}</Text>
          </View>
        )}
      />

      {/* In-Progress Achievements Section */}
      <TouchableOpacity 
        style={styles.section} 
        onPress={() => {} /* Toggle visibility or fetch achievements */}
      >
        <Text style={styles.sectionTitle}>In-Progress Achievements ▼</Text>
      </TouchableOpacity>
      <FlatList
        data={inProgressAchievements}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.achievementItem}>
            <Text style={styles.achievementTitle}>{item.title} Lvl{item.level}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: 10,
  },
  section: {
    backgroundColor: "#c2c8a0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a503d",
  },
  achievementItem: {
    backgroundColor: "#e4e7d1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a503d",
  },
});
