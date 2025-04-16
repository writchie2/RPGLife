import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import colors from "@/constants/colors";
import UserHeader from "@/components/UserHeader";

import TraitGraph from "@/components/TraitGraphModal";
import CharacterTraitLevels from "@/components/CharacterTraitLevels";
import CharacterTraitDesc from "@/components/CharacterTraitDesc";
import { usePreventRemove } from "@react-navigation/native";

// Define the available views
enum ViewMode {
  LEVELS = "LEVELS",
  GRAPH = "GRAPH",
  DESCRIPTION = "DESCRIPTION",
}

// Define the structure for character traits
// type CharacterTrait = {
//   name: string;
//   level: number;
//   currentExp: number;
//   requiredExp: number;
//   description: string;
// };

export default function CharacterScreen() {
  // const [characterTraits, setCharacterTraits] = useState<CharacterTrait[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LEVELS); // Default view

  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <UserHeader />
      </View>

      <View style={styles.scrollLine}></View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.traitsContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Character Traits</Text>
          </View>

          <View style={styles.infoContainer}>
            {/* Conditional Rendering Based on View Mode */}
            {viewMode === ViewMode.LEVELS && <CharacterTraitLevels />}

            {viewMode === ViewMode.GRAPH && <TraitGraph />}

            {viewMode === ViewMode.DESCRIPTION && <CharacterTraitDesc />}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setViewMode(ViewMode.LEVELS)}
        >
          <Text style={styles.navText}>Levels</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setViewMode(ViewMode.GRAPH)}
        >
          <Text style={styles.navText}>Graph</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setViewMode(ViewMode.DESCRIPTION)}
        >
          <Text style={styles.navText}>Desc.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
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
  traitsContainer: {
    position: "relative",
    flex: 1,
    // marginTop: 20,
    marginBottom: 30,
    // backgroundColor: "orange", // -TEST-
  },
  titleContainer: {
    zIndex: 1,
    backgroundColor: colors.bgTertiary,
    padding: 10,
    borderRadius: 8,
    height: 60,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 26,
    color: colors.text,
  },
  infoContainer: {
    flex: 1,
    position: "relative",
    top: -60,
    marginBottom: -60,
    zIndex: 0,
    borderRadius: 8,
    width: "100%",
    paddingTop: 70,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 20,
  },
  navButton: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.bgTertiary,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  navText: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 18,
    color: colors.text,
  },
});
