import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { auth } from "../../FirebaseConfig";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserData } from "@/contexts/UserContext";
import UserHeader from "@/components/UserHeader";
import SkillsList from "@/components/SkillsList";
import QuestsList from "@/components/QuestsList";
import CreateSkillModal from "@/components/CreateSkillModal";
import CreateQuestModal from "@/components/CreateQuestModal";
import WelcomeModal from "@/components/WelcomeModal";
import ReturnModal from "@/components/ReturnModal";

export default function HomePage() {
  const colors = useTheme();
  const { userData, firstLogin } = useUserData();

  const [fontsLoaded, setFontsLoaded] = useState(true);
  const [skillListVisible, setSkillListVisible] = useState(false);
  const [questListVisible, setQuestListVisible] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);
  const [questsModalVisible, setQuestsModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace("/(login)");
      return;
    }
    if (userData) {
      setLoading(false);
      const now = new Date();
      const lastLogin = userData?.lastLogin;
      if (userData.firstLoginComplete === null) {
        setWelcomeModalVisible(true);
      } else if (
        now.getTime() - (lastLogin?.getTime() || now.getTime()) >=
        24 * 60 * 60 * 1000
      ) {
        setReturnModalVisible(true);
      }
    }
  }, [userData]);

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
      backgroundColor: colors.bgSecondary,
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
    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.bgPrimary,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      position: "absolute",
      bottom: 0,
      height: "30%",
      width: "100%",
      backgroundColor: colors.bgSecondary,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    modalButton: {
      width: "70%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgPrimary,
      borderRadius: 100,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
      height: 50,
      margin: "5%",
    },
    modalButtonText: {
      fontFamily: "Metamorphous_400Regular",
      color: colors.textDark,
      fontSize: 20,
    },
  });

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loading} size="large" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <UserHeader />
      </View>

      <View style={styles.scrollLine}>
        <Text style={styles.pageTitle}>Home</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.section}
            onPress={() => setSkillListVisible(!skillListVisible)}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <Text style={styles.sectionTitleIcon}>
                {skillListVisible ? "arrow_drop_down" : "arrow_right"}
              </Text>
            </View>
          </TouchableOpacity>
          {skillListVisible && (
            <SkillsList skills={userData?.skills || []} mode="active" />
          )}
        </View>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.section}
            onPress={() => setQuestListVisible(!questListVisible)}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Quests</Text>
              <Text style={styles.sectionTitleIcon}>
                {questListVisible ? "arrow_drop_down" : "arrow_right"}
              </Text>
            </View>
          </TouchableOpacity>
          {questListVisible && (
            <QuestsList quests={userData?.quests || []} mode="active" />
          )}
        </View>
      </ScrollView>

      <CreateSkillModal
        visible={skillsModalVisible}
        onClose={() => setSkillsModalVisible(false)}
      />
      <CreateQuestModal
        visible={questsModalVisible}
        onClose={() => setQuestsModalVisible(false)}
      />

      <WelcomeModal
        visible={welcomeModalVisible}
        onClose={() => {
          setWelcomeModalVisible(false);
          firstLogin();
        }}
      />
      <ReturnModal
        visible={returnModalVisible}
        onClose={() => {
          setReturnModalVisible(false);
          firstLogin();
        }}
      />

      <Pressable
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setAddModalVisible(false);
                    setSkillsModalVisible(true);
                  }}
                >
                  <Text style={styles.modalButtonText}>Add Skill</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setAddModalVisible(false);
                    setQuestsModalVisible(true);
                  }}
                >
                  <Text style={styles.modalButtonText}>Add Quest</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
