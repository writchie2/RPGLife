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
import NavigationModal  from '../../components/NavigationModal'
import { useUserData } from '@/contexts/UserContext';


import colors from "@/constants/colors";
import UserHeader from "@/components/UserHeader";

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
      trait: "Core",
      exp: 200,
      active: false,
    },
    {
      id: "2",
      name: "React",
      description: "JavaScript library for building user interfaces.",
      trait: "Frontend",
      exp: 100,
      active: true,
    },
    {
      id: "3",
      name: "Node.js",
      description: "JavaScript runtime for building server-side applications.",
      trait: "Backend",
      exp: 20,
      active: true,
    },
  ],
};



export default function HomePage() {
  const user = auth.currentUser;

  const usersCollection = collection(db, "users");
  
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("/(login)");
  });
  

  const [skillListVisible, setSkillListVisible] = useState(false);
  const [questListVisible, setQuestListVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [loading, setLoading] = useState(true); // Not used currently. could be implemented later.
  const userData = useUserData();
  //Context for main folder that has the user data. 


  // Firebase implementation moved to "@/contexts/UserContext"
  useEffect(() => {
    if (userData){
      setLoading(false)
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

  return (
    <View style={styles.container}>
      
      {/* Header Component */}
      <UserHeader></UserHeader>
      
      <View>
        {/* Skills Section */}
        <TouchableOpacity 
          style={styles.section} 
          onPress={() => setSkillListVisible(!skillListVisible)}
        >
          <Text style={styles.sectionTitle}>
            {skillListVisible ? 'Hide Skills ▲' : 'Skills ▼'}
          </Text>
        </TouchableOpacity>
        {skillListVisible && (
          <SkillsList skills={simulatedUserData.skills || []} mode="active" />
        )}

        {/* Quests Section */}
        <TouchableOpacity 
          style={styles.section} 
          onPress={() => setQuestListVisible(!questListVisible)}
        >
          <Text style={styles.sectionTitle}>
            {questListVisible ? 'Hide Quests ▲' : 'Quests ▼'}
          </Text>
        </TouchableOpacity>
        {questListVisible && (
          <QuestsList quests={simulatedUserData.quests || []} mode="active" />
        )}
      </View>

      {/* Add Button */}
      <Pressable
        style={styles.addButton}
        onPress={() =>
          setAddModalVisible(true)
        }
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

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
                  alert("launching add skill modal (TODO)");
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3de",
    padding: 20,
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
  logoutButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
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
  loading: {
    backgroundColor: "#f1f3de",
    height: "100%"
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
    margin:"5%"  
      },
  modalButtonText: {
    fontFamily: "Metamorphous_400Regular",
    color: colors.textDark, 
    fontSize: 20, 
    },
});
