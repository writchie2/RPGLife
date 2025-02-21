import React from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the RootStackParamList for type-safe navigation
type RootStackParamList = {
  Home: undefined;
  Skills: undefined;
  Quests: undefined;
  Stats: undefined;
};

// Correctly type the navigation object
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function HomePage() {
  const navigation = useNavigation<NavigationProps>();

  // Ensure page is one of the keys from RootStackParamList
  const handleNavigate = (page: keyof RootStackParamList) => {
    navigation.navigate(page);
  };

  return (
    <View style={styles.container}>
      {/* User Section */}
      <View style={styles.userSection}>
        <View style={styles.avatar}></View>
        <View>
          <Text style={styles.username}>Username</Text>
          <Text style={styles.level}>Level 1</Text>
          <Text style={styles.experience}>0/100 exp</Text>
        </View>
      </View>

      {/* Buttons */}
      <Pressable style={styles.iconButton} onPress={() => handleNavigate("Stats")}>
        <Text style={styles.iconButtonText}>★</Text>
      </Pressable>
      <Pressable style={styles.menuButton} onPress={() => {}}>
        <Text style={styles.menuButtonText}>☰</Text>
      </Pressable>

      {/* Skills Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
      </View>

      {/* Quests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quests</Text>
      </View>

      {/* Add Button */}
      <Pressable style={styles.addButton} onPress={() => handleNavigate("Quests")}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3de",
    padding: 20,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#c2c8a0",
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#e4e7d1",
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a503d",
  },
  level: {
    fontSize: 14,
    color: "#4a503d",
  },
  experience: {
    fontSize: 14,
    color: "#4a503d",
  },
  iconButton: {
    position: "absolute",
    top: 20,
    right: 60,
    backgroundColor: "#e4e7d1",
    padding: 10,
    borderRadius: 20,
  },
  iconButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a503d",
  },
  menuButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#e4e7d1",
    padding: 10,
    borderRadius: 20,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a503d",
  },
  section: {
    backgroundColor: "#c2c8a0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a503d",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#c2c8a0",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a503d",
  },
});
