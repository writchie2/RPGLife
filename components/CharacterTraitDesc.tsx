import React from "react";
import { Text, StyleSheet, View } from "react-native";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import

const CharacterTraitDesc = () => {
  const colors = useTheme(); // used for themes, replaces colors import

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-evenly",
      paddingHorizontal: 10,
      position: "relative",
      top: -70,
      marginBottom: -70,
      borderRadius: 8,
      width: "100%",
      paddingTop: 65,
      paddingBottom: 10,
      // backgroundColor: colors.bgSecondary,
      backgroundColor: colors.bgDropdown,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    traitInfo: {
      width: "100%",
      paddingVertical: 10,
      paddingHorizontal: 6,
      marginBottom: 5,
      backgroundColor: "transparent",
      borderBottomWidth: 0.5,
      borderColor: colors.borderLight,
    },
    traitName: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 20,
      color: colors.text,
    },
    traitDesc: {
      // fontFamily: "Alegreya_400Regular",
      fontFamily: "Alegreya_500Medium",
      marginTop: 2,
      fontSize: 14,
      color: colors.textLight,
    },
  });
  return (
    <View style={styles.container}>
      {/* Trait Info: Trait, EXP Bar, Level Info */}
      {/* STRENGTH */}
      <View style={styles.traitInfo}>
        <Text style={styles.traitName}>Strength (STR)</Text>
        <Text style={styles.traitDesc}>
          Represents your physical power and endurance. Increased by completeing
          physical tasks, workouts, and other physical challenges.
        </Text>
      </View>
      {/* VITALITY */}
      <View style={styles.traitInfo}>
        <Text style={styles.traitName}>Vitality (VIT)</Text>
        <Text style={styles.traitDesc}>
          Measures your overall well-being and resilience. Boosted through
          sleep, eating well, managing stress, and maintaining a healthy
          lifestyle.
        </Text>
      </View>
      {/* AGILITY */}
      <View style={styles.traitInfo}>
        <Text style={styles.traitName}>Agility (AGI)</Text>
        <Text style={styles.traitDesc}>
          Represents your speed, flexibility, and stamina. Improved through
          activities such as running, dancing, yoga, and other tasks that demand
          sustained effort or flexability.
        </Text>
      </View>
      {/* INTELLIGENCE */}
      <View style={styles.traitInfo}>
        <Text style={styles.traitName}>Intelligence (INT)</Text>
        <Text style={styles.traitDesc}>
          Governs your ability to learn, solve problems, and apply knowledge.
          Grows with reading, studying, solving puzzles, and learning new
          skills.
        </Text>
      </View>
      {/* CHARISMA */}
      <View style={styles.traitInfo}>
        <Text style={styles.traitName}>Charisma (CHR)</Text>
        <Text style={styles.traitDesc}>
          Reflects your social influence, confidence, and creativity. Raised
          through communication, networking, and artistic expression like music,
          art, writing, and performing.
        </Text>
      </View>
    </View>
  );
};

export default CharacterTraitDesc;
