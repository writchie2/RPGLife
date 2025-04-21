import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import UserHeader from "@/components/UserHeader";
import TraitGraph from "@/components/TraitGraphModal";
import CharacterTraitLevels from "@/components/CharacterTraitLevels";
import CharacterTraitDesc from "@/components/CharacterTraitDesc";

// Define the available views
enum ViewMode {
  LEVELS = "LEVELS",
  GRAPH = "GRAPH",
  DESCRIPTION = "DESCRIPTION",
}

export default function CharacterScreen() {
  const colors = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LEVELS);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
      paddingVertical: 20,
    },
    headerContainer: {
      paddingHorizontal: 20,
      ...Platform.select({
        ios: { marginVertical: 20 },
        android: { marginBottom: 20 },
        default: { marginTop: 10, marginBottom: 20 },
      }),
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
    traitsContainer: {
      position: "relative",
      flex: 1,
      marginBottom: 30,
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
      fontSize: 28,
      color: colors.text,
      textAlign: "center",
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <UserHeader />
      </View>

      <View style={styles.scrollLine}>
        <Text style={styles.title}>Character</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.traitsContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Character Traits</Text>
          </View>

          <View style={styles.infoContainer}>
            {viewMode === ViewMode.LEVELS && <CharacterTraitLevels />}
            {viewMode === ViewMode.GRAPH && <TraitGraph />}
            {viewMode === ViewMode.DESCRIPTION && <CharacterTraitDesc />}
          </View>
        </View>
      </ScrollView>

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
