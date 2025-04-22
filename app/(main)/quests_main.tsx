import React, { useState } from "react";
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
import { useUserData } from "@/contexts/UserContext";
import UserHeader from "@/components/UserHeader";
import QuestsList from "@/components/QuestsList";
import CreateQuestModal from "@/components/CreateQuestModal";

export default function QuestMainPage() {
  const colors = useTheme();
  const userData = useUserData();

  const [questListVisible, setQuestListVisible] = useState(false);
  const [pastQuestListVisible, setPastQuestListVisible] = useState(false);
  const [questModalVisible, setQuestModalVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
      paddingVertical: 20,
    },
    headerContainer: {
      paddingHorizontal: 20,
      ...Platform.select({
        ios: {
          marginVertical: 20,
        },
        android: {
          marginBottom: 20,
        },
        default: {
          marginTop: 10,
          marginBottom: 20,
        },
      }),
    },
    pageTitle: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 28,
      color: colors.text,
      textAlign: "center",
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
    dropdownContainer: {
      marginBottom: 40,
    },
    section: {
      zIndex: 1,
      backgroundColor: colors.bgTertiary,
      padding: 10,
      borderRadius: 8,
      height: 60,
      justifyContent: "center",
    },
    sectionTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 24,
      color: colors.text,
    },
    sectionTitleIcon: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 50,
      color: colors.text,
      position: "absolute",
      right: 0,
    },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: colors.bgTertiary,
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonText: {
      fontSize: 36,
      lineHeight: 44,
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <UserHeader />
      </View>

      <View style={styles.scrollLine}>
        <Text style={styles.pageTitle}>Quests</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.section}
            onPress={() => setQuestListVisible(!questListVisible)}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Active Quests</Text>
              <Text style={styles.sectionTitleIcon}>
                {questListVisible ? "arrow_drop_down" : "arrow_right"}
              </Text>
            </View>
          </TouchableOpacity>
          {questListVisible && (
            <QuestsList
              quests={userData.userData?.quests || []}
              mode="active"
            />
          )}
        </View>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.section}
            onPress={() => setPastQuestListVisible(!pastQuestListVisible)}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Completed Quests</Text>
              <Text style={styles.sectionTitleIcon}>
                {pastQuestListVisible ? "arrow_drop_down" : "arrow_right"}
              </Text>
            </View>
          </TouchableOpacity>
          {pastQuestListVisible && (
            <QuestsList
              quests={userData.userData?.quests || []}
              mode="inactive"
            />
          )}
        </View>
      </ScrollView>

      <CreateQuestModal
        visible={questModalVisible}
        onClose={() => setQuestModalVisible(false)}
      />

      <Pressable
        style={styles.addButton}
        onPress={() => setQuestModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}
