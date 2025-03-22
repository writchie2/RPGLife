import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler } from "react-native";
import { ProgressBar } from "react-native-paper";

import colors from "@/constants/colors";
import UserHeader from "@/components/UserHeader";

// Define the available views
enum ViewMode {
  LEVELS = "LEVELS",
  GRAPH = "GRAPH",
  DESCRIPTION = "DESCRIPTION",
}

// Define the structure for character traits
type CharacterTrait = {
  name: string;
  level: number;
  currentExp: number;
  requiredExp: number;
  description: string;
};

export default function CharacterScreen() {
  const [characterTraits, setCharacterTraits] = useState<CharacterTrait[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LEVELS); // Default view

  useEffect(() => {
    const backAction = () => {
      router.replace("/(main)"); // Navigate back to the home screen
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <UserHeader />
      <Text style={styles.title}>Character Traits</Text>

      {/* Conditional Rendering Based on View Mode */}
      {viewMode === ViewMode.LEVELS && (
        <FlatList
          data={characterTraits}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.traitContainer}>
              <Text style={styles.traitTitle}>{item.name} - Level {item.level}</Text>
              <ProgressBar progress={item.currentExp / item.requiredExp} color="#6b8e23" />
              <Text style={styles.expText}>
                {item.currentExp}/{item.requiredExp} EXP
              </Text>
            </View>
          )}
        />
      )}

      {viewMode === ViewMode.GRAPH && (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Graph View (To be implemented)</Text>
        </View>
      )}

      {viewMode === ViewMode.DESCRIPTION && (
        <FlatList
          data={characterTraits}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.traitContainer}>
              <Text style={styles.traitTitle}>{item.name}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          )}
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => setViewMode(ViewMode.LEVELS)}>
          <Text style={styles.navText}>Levels</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => setViewMode(ViewMode.GRAPH)}>
          <Text style={styles.navText}>Graph</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => setViewMode(ViewMode.DESCRIPTION)}>
          <Text style={styles.navText}>Desc.</Text>
        </TouchableOpacity>
      </View>
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
  traitContainer: {
    backgroundColor: "#c2c8a0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  traitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a503d",
  },
  expText: {
    fontSize: 14,
    color: "#4a503d",
    textAlign: "right",
  },
  descriptionText: {
    fontSize: 14,
    color: "#4a503d",
    marginTop: 5,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a503d",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#a6aa83",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  navText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a503d",
  },
});

