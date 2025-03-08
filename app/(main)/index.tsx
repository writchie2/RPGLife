import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  ScrollViewBase,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../FirebaseConfig";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { getAuth } from "firebase/auth";

import { fetchUserData } from '../../utils/firestoreUtils';
import { saveUserData, getUserData } from '../../utils/storageUtils';
import { UserData, Quest, Skill, Checkpoint } from '../../utils/types';
import SkillsList  from '../../components/SkillsList'
import QuestsList  from '../../components/QuestsList'
import CreateSkillModal from "@/components/CreateSkillModal";
import NavigationModal  from '../../components/NavigationModal'
import { useUserData } from '@/contexts/UserContext';



import colors from "@/constants/colors";
import UserHeader from "@/components/UserHeader";
import { useFonts } from "expo-font";
import { Metamorphous_400Regular } from "@expo-google-fonts/metamorphous";
import {
  Alegreya_400Regular,
  Alegreya_500Medium,
} from "@expo-google-fonts/alegreya";

// moved dummy data outside, otherwise function for lvl/exp stuff was launching twice for some reason, idk why :P
// Hard-coded data for testing. Simulates the data that will be retreived from firestore.
const simulatedUserData = {
  username: "John Doe",
  email: "john@example.com",
  birthdate: "1990-05-20",
  exp: 3200,
  quests: [
    {
      id: "1",
      name: "Learn React Native",
      dueDate: "2025-05-01",
      description: "Complete the React Native tutorial and build an app.",
      difficulty: "medium" as "medium",
      primarySkill: "JavaScript",
      secondarySkill: "React",
      repeatable: false,
      active: true,
    },
    {
      id: "2",
      name: "Complete Backend API",
      dueDate: "2025-06-01",
      description: "Finish the backend API with Express.js and MongoDB.",
      difficulty: "hard" as "hard",
      primarySkill: "Node.js",
      secondarySkill: "MongoDB",
      repeatable: true,
      active: true,
    },
  ],
  skills: [
    {
      id: "1",
      name: "JavaScript",
      description: "Programming language for building web applications.",
      primaryTrait: "Core",
      exp: 200,
      active: false,
    },
    {
      id: "2",
      name: "React",
      description: "JavaScript library for building user interfaces.",
      primaryTrait: "Frontend",
      exp: 100,
      active: true,
    },
    {
      id: "3",
      name: "Node.js",
      description: "JavaScript runtime for building server-side applications.",
      primaryTrait: "Backend",
      exp: 20,
      active: true,
    },
  ],
};

export default function HomePage() {
  const [fontsLoaded] = useFonts({
    Metamorphous_400Regular,
    Alegreya_400Regular,
    Alegreya_500Medium,
  });

  const user = auth.currentUser;

  const usersCollection = collection(db, "users");

  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("/(login)");
  });

  const [skillListVisible, setSkillListVisible] = useState(false);
  const [questListVisible, setQuestListVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);

  const [loading, setLoading] = useState(true); // Not used currently. could be implemented later.
  const userData = useUserData();
  //Context for main folder that has the user data.

  // Firebase implementation moved to "@/contexts/UserContext"
  useEffect(() => {
    if (userData) {
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator style={styles.loading} size="large" />
        <Text>Loading user data...</Text>
      </View>
    );
  }
  if (!fontsLoaded) {
    return null;
  } else {
    return (
        <View style={styles.container}>
          {/* Header Component */}
          <UserHeader></UserHeader>

          <View>
            {/* Skills Section */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.section}
                onPress={() => setSkillListVisible(!skillListVisible)}
              >
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>
                    {skillListVisible ? "Hide Skills" : "Skills"}
                  </Text>
                  <Text style={styles.sectionTitle}>
                    {skillListVisible ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>
              {skillListVisible && (
                <SkillsList
                  skills={simulatedUserData.skills || []}
                  mode="active"
                />
              )}
            </View>
            {/* Quests Section */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.section}
                onPress={() => setQuestListVisible(!questListVisible)}
              >
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>
                    {questListVisible ? "Hide Quests" : "Quests"}
                  </Text>
                  <Text style={styles.sectionTitle}>
                    {questListVisible ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>
              {questListVisible && (
                <QuestsList
                  quests={simulatedUserData.quests || []}
                  mode="active"
                />
              )}
            </View>
          </View>

          {/* Add Button */}
          <Pressable
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>

          {/* Modal for Add Button */}
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
                        alert("launching add skill modal (TODO)");
                      }}
                    >
                      <Text style={styles.modalButtonText}>Add Skill</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                        setAddModalVisible(false);
                        alert("launching add quest modal (TODO)");
                      }}
                    >
                      <Text style={styles.modalButtonText}>Add Quest</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        
    


        {/* Add Button */}
        <Pressable
          style={styles.addButton}
          onPress={() =>
            setAddModalVisible(true)
          }
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
          
        <CreateSkillModal visible={skillsModalVisible} onClose={() => setSkillsModalVisible(false)}></CreateSkillModal>
        

        {/* Modal for Add Button */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={ () => setAddModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <TouchableOpacity style={styles.modalButton} onPress={() => {
                    setAddModalVisible(false);
                    setSkillsModalVisible(true);
                    //alert("launching add skill modal (TODO)");
                  }}>
                    <Text style={styles.modalButtonText}>Add Skill</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={() => {
                    setAddModalVisible(false);
                    alert("launching add quest modal (TODO)");
                  }}>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    padding: 20,
  },
  dropdownContainer: {
    position: "relative",
    marginTop: 20,
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
  },
  sectionTitle: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 24,
    color: colors.text,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    // backgroundColor: colors.bgTertiary,
    backgroundColor: colors.bgSecondary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: colors.bgTertiary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  loading: {
    backgroundColor: colors.bgPrimary,
    height: "100%",
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
