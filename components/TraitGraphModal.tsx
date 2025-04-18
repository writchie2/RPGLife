import React, { useState } from "react";
import { Text, StyleSheet, View, SafeAreaView } from "react-native";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import

import { useEffect } from "react";
import { useUserData } from "@/contexts/UserContext";
import { RadarChart } from "@salmonco/react-native-radar-chart";
import calcEXP from "@/utils/calcEXP";

const TraitGraph = () => {
  const colors = useTheme(); // used for themes, replaces colors import

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      position: "relative",
      top: -70,
      marginBottom: -70,
      borderRadius: 8,
      width: "100%",
      paddingTop: 70,
      // backgroundColor: colors.bgSecondary,
      backgroundColor: colors.bgDropdown,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
  });

  // GET USER TRAIT DATA
  const userData = useUserData();
  const [levelSTR, setLevelSTR] = useState(0);
  const [levelVIT, setLevelVIT] = useState(0);
  const [levelAGI, setLevelAGI] = useState(0);
  const [levelINT, setLevelINT] = useState(0);
  const [levelCHR, setLevelCHR] = useState(0);

  // When page loads, run the function to calculate the user's Level, neededEXP, and progressEXP
  useEffect(() => {
    const { level } = calcEXP(userData.userData?.strengthEXP || 0);
    setLevelSTR(level);
  }, [userData.userData?.strengthEXP]);

  useEffect(() => {
    const { level } = calcEXP(userData.userData?.vitalityEXP || 0);
    setLevelVIT(level);
  }, [userData.userData?.vitalityEXP]);

  useEffect(() => {
    const { level } = calcEXP(userData.userData?.agilityEXP || 0);
    setLevelAGI(level);
  }, [userData.userData?.agilityEXP]);

  useEffect(() => {
    const { level } = calcEXP(userData.userData?.intelligenceEXP || 0);
    setLevelINT(level);
  }, [userData.userData?.intelligenceEXP]);

  useEffect(() => {
    const { level } = calcEXP(userData.userData?.charismaEXP || 0);
    setLevelCHR(level);
  }, [userData.userData?.charismaEXP]);

  // GRAPH DATA
  const data = [
    { label: "STR", value: levelSTR },
    { label: "VIT", value: levelVIT },
    { label: "INT", value: levelINT },
    { label: "CHR", value: levelCHR },
    { label: "AGI", value: levelAGI },
  ];

  // Compares the lvls of each trait and finds a maxValue for the graph
  const getMAX = (lvls: Array<number>) => {
    let max = 5;
    for (let i = 0; i < 5; i++) {
      while (lvls[i] > max) {
        max += 5;
      }
      if (lvls[i] == max) {
        max += 1;
      }
    }
    return max;
  };

  return (
    <View style={styles.container}>
      {/* // -TEST->>>>>>>>>>>>> */}
      {/* <Text>STR: {levelSTR}</Text>
      <Text>VIT: {levelVIT}</Text>
      <Text>AGI: {levelAGI}</Text>
      <Text>INT: {levelINT}</Text>
      <Text>CHR: {levelCHR}</Text> */}
      {/* // <<<<<<<<<<<<<-TEST- */}
      <SafeAreaView>
        <RadarChart
          data={data}
          // maxValue={100}
          maxValue={getMAX([levelSTR, levelVIT, levelAGI, levelINT, levelCHR])}
          gradientColor={{
            startColor: colors.graphStart,
            endColor: colors.graphEnd,
            count: 5,
          }}
          stroke={[
            colors.graphLine,
            colors.graphLine,
            colors.graphLine,
            colors.graphLine,
            colors.textDark,
          ]}
          strokeWidth={[0.5, 0.5, 0.5, 0.5, 1]}
          strokeOpacity={[1, 1, 1, 1, 0.13]}
          labelColor={colors.text}
          labelFontFamily="Metamorphous_400Regular"
          dataFillColor={colors.graphStroke}
          dataFillOpacity={0.8}
          dataStroke={colors.graphStrokeMain}
          dataStrokeWidth={2}
          scale={1}
        />
      </SafeAreaView>
    </View>
  );
};

export default TraitGraph;
