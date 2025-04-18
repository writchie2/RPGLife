import React, { useState } from "react";
import { Text, StyleSheet, View, SafeAreaView } from "react-native";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import

import { useEffect } from "react";
import { useUserData } from "@/contexts/UserContext";
import { RadarChart } from "@salmonco/react-native-radar-chart";
import calcEXP from "@/utils/calcEXP";

const CharacterTraitLevels = () => {
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
      paddingBottom: 5,
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
      marginBottom: 10,
      backgroundColor: "transparent",
      borderBottomWidth: 0.5,
      borderColor: colors.borderLight,
    },
    traitName: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 20,
      color: colors.text,
    },
    expBar: {
      marginTop: 5,
      height: 14,
      backgroundColor: colors.bgPrimary,
      borderWidth: 2,
      borderColor: colors.borderInput,
      borderRadius: 99,
      justifyContent: "center",
    },
    expProgressBar: {
      height: "100%",
      backgroundColor: colors.text,
      borderRadius: 99,
    },
    splitRowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    levelText: {
      // fontFamily: "Alegreya_400Regular",
      fontFamily: "Alegreya_500Medium",
      marginTop: 2,
      fontSize: 14,
      color: colors.textLight,
    },
  });

  // GET USER TRAIT DATA
  const userData = useUserData();

  const [levelSTR, setLevelSTR] = useState(0);
  const [neededExpSTR, setNeededExpSTR] = useState(0);
  const [progressExpSTR, setProgressExpSTR] = useState(0);

  const [levelVIT, setLevelVIT] = useState(0);
  const [neededExpVIT, setNeededExpVIT] = useState(0);
  const [progressExpVIT, setProgressExpVIT] = useState(0);

  const [levelAGI, setLevelAGI] = useState(0);
  const [neededExpAGI, setNeededExpAGI] = useState(0);
  const [progressExpAGI, setProgressExpAGI] = useState(0);

  const [levelINT, setLevelINT] = useState(0);
  const [neededExpINT, setNeededExpINT] = useState(0);
  const [progressExpINT, setProgressExpINT] = useState(0);

  const [levelCHR, setLevelCHR] = useState(0);
  const [neededExpCHR, setNeededExpCHR] = useState(0);
  const [progressExpCHR, setProgressExpCHR] = useState(0);

  // When page loads, run the function to calculate the user's Level, neededEXP, and progressEXP
  useEffect(() => {
    const { level, neededEXP, progressEXP } = calcEXP(
      userData.userData?.strengthEXP || 0
    );
    setLevelSTR(level);
    setNeededExpSTR(neededEXP);
    setProgressExpSTR(progressEXP);
  }, [userData.userData?.strengthEXP]);

  useEffect(() => {
    const { level, neededEXP, progressEXP } = calcEXP(
      userData.userData?.vitalityEXP || 0
    );
    setLevelVIT(level);
    setNeededExpVIT(neededEXP);
    setProgressExpVIT(progressEXP);
  }, [userData.userData?.vitalityEXP]);

  useEffect(() => {
    const { level, neededEXP, progressEXP } = calcEXP(
      userData.userData?.agilityEXP || 0
    );
    setLevelAGI(level);
    setNeededExpAGI(neededEXP);
    setProgressExpAGI(progressEXP);
  }, [userData.userData?.agilityEXP]);

  useEffect(() => {
    const { level, neededEXP, progressEXP } = calcEXP(
      userData.userData?.intelligenceEXP || 0
    );
    setLevelINT(level);
    setNeededExpINT(neededEXP);
    setProgressExpINT(progressEXP);
  }, [userData.userData?.intelligenceEXP]);

  useEffect(() => {
    const { level, neededEXP, progressEXP } = calcEXP(
      userData.userData?.charismaEXP || 0
    );
    setLevelCHR(level);
    setNeededExpCHR(neededEXP);
    setProgressExpCHR(progressEXP);
  }, [userData.userData?.charismaEXP]);

  return (
    <View style={styles.container}>
      {/* Trait Info: Trait, EXP Bar, Level Info */}
      {/* STRENGTH */}
      <View style={styles.traitInfo}>
        <Text style={styles.traitName}>Strength (STR)</Text>

        <View style={styles.expBar}>
          <View
            style={[
              styles.expProgressBar,
              { width: `${(progressExpSTR / neededExpSTR) * 100}%` },
            ]}
          ></View>
        </View>

        <View style={styles.splitRowContainer}>
          <Text style={styles.levelText}>Level {levelSTR}</Text>
          <Text style={styles.levelText}>
            {progressExpSTR}/{neededExpSTR} exp
          </Text>
        </View>
      </View>
      {/* VITALITY */}
      <View style={styles.traitInfo}>
        <Text style={styles.traitName}>Vitality (VIT)</Text>

        <View style={styles.expBar}>
          <View
            style={[
              styles.expProgressBar,
              { width: `${(progressExpVIT / neededExpVIT) * 100}%` },
            ]}
          ></View>
        </View>

        <View style={styles.splitRowContainer}>
          <Text style={styles.levelText}>Level {levelVIT}</Text>
          <Text style={styles.levelText}>
            {progressExpVIT}/{neededExpVIT} exp
          </Text>
        </View>
      </View>
      {/* AGILITY */}
      <View style={styles.traitInfo}>
        <Text style={styles.traitName}>Agility (AGI)</Text>

        <View style={styles.expBar}>
          <View
            style={[
              styles.expProgressBar,
              { width: `${(progressExpAGI / neededExpAGI) * 100}%` },
            ]}
          ></View>
        </View>

        <View style={styles.splitRowContainer}>
          <Text style={styles.levelText}>Level {levelAGI}</Text>
          <Text style={styles.levelText}>
            {progressExpAGI}/{neededExpAGI} exp
          </Text>
        </View>
      </View>
      {/* INTELLIGENCE */}
      <View style={styles.traitInfo}>
        <Text style={styles.traitName}>Intelligence (INT)</Text>

        <View style={styles.expBar}>
          <View
            style={[
              styles.expProgressBar,
              { width: `${(progressExpINT / neededExpINT) * 100}%` },
            ]}
          ></View>
        </View>

        <View style={styles.splitRowContainer}>
          <Text style={styles.levelText}>Level {levelINT}</Text>
          <Text style={styles.levelText}>
            {progressExpINT}/{neededExpINT} exp
          </Text>
        </View>
      </View>
      {/* CHARISMA */}
      <View style={styles.traitInfo}>
        <Text style={styles.traitName}>Charisma (CHR)</Text>

        <View style={styles.expBar}>
          <View
            style={[
              styles.expProgressBar,
              { width: `${(progressExpCHR / neededExpCHR) * 100}%` },
            ]}
          ></View>
        </View>

        <View style={styles.splitRowContainer}>
          <Text style={styles.levelText}>Level {levelCHR}</Text>
          <Text style={styles.levelText}>
            {progressExpCHR}/{neededExpCHR} exp
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CharacterTraitLevels;
