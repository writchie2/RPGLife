import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Pressable, ScrollViewBase, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from '../../FirebaseConfig';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { getAuth } from 'firebase/auth';

import { fetchUserData } from '../../utils/firestoreUtils';
import { saveUserData, getUserData } from '../../utils/storageUtils';
import { UserData, Quest, Skill, Checkpoint } from '../../utils/types';
import SkillsList  from '../../components/SkillsList'
import QuestsList  from '../../components/QuestsList'





export default function HomePage() {
  
  const user = auth.currentUser;
  const usersCollection = collection(db, 'users');
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace('/(login)');
  });

  // Hard-coded data for testing. Simulates the data that will be retreived from firestore. 
  const simulatedUserData = {
    username: "John Doe",
    email: "john@example.com",
    birthdate: "1990-05-20",
    exp: 320,
    quests: [
      {
        id: "1",
        name: "Learn React Native",
        dueDate: "2025-05-01",
        description: "Complete the React Native tutorial and build an app.",
        difficulty: "medium" as 'medium',
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
        difficulty: "hard" as 'hard',
        primarySkill: "Node.js",
        secondarySkill: "MongoDB",
        repeatable: true,
        active: true
      }
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
      }
    ]
  };

  const [skillListVisible, setSkillListVisible] = useState(false);
  const [questListVisible, setQuestListVisible] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); // Not used currently. could be implemented later. 

  useEffect(() => {
    
    // There are two versions of this for testing.
    // First one pulls data from firebase to populate 
    // Second one uses dummy data to test lists
    
    // Firebase implementation
    /*
    const loadUserData = async () => {
      if (!user?.uid) {
        console.error('User ID is undefined, cannot fetch user data.');
        return;
      }
      try {
        setLoading(true);
        let data = await getUserData(); // Try AsyncStorage first
        //alert("async storage pull: " + JSON.stringify(data));
        if (!data) {
          console.log('No cached data, fetching from Firestore...');
          //alert("Not found, fetching from firestore");
          data = await fetchUserData(user?.uid); // Fetch from Firestore
          if (data) {
            //alert("firstore pull: " + JSON.stringify(data));
            await saveUserData(data); // Cache it for next time
          }
        }

        setUserData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      };
    };
    loadUserData();
    */

    // Hard coded implementation 

    const loadUserData = async () => {
      try {
        setLoading(true);
    
        const data = simulatedUserData; // Hard-coded above
        setUserData(data); 
  
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadUserData();
    
  }, []);

  
  return (
    <SafeAreaView style={styles.container}>
      {/* User Section */}
      <View style={styles.userSection}>
        <View style={styles.avatar}></View>
        <View>
          <Text style={styles.username}>{userData?.username}</Text>
          <Text style={styles.level}>Level {Math.floor((userData?.exp || 1)/ 100)}</Text>
          <Text style={styles.experience}>{(userData?.exp || 0) % 100} exp</Text>
        </View>
      

      {/* Buttons */}
      <Pressable style={styles.iconButton} onPress={() => alert("Need to implement")}>
        <Text style={styles.iconButtonText}>★</Text>
      </Pressable>
      <Pressable style={styles.menuButton} onPress={() => alert("Need to implement")}>
        <Text style={styles.menuButtonText}>☰</Text>
      </Pressable>
      </View>
      
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
        <SkillsList skills={userData?.skills || []} mode="active" />
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
        <QuestsList quests={userData?.quests || []} mode="active" />
      )}
      </View>

      {/* Add Button */}
      <Pressable style={styles.addButton} onPress={() => alert("Note - this is currently a test!" + JSON.stringify(userData))}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
      {/* Logout Button */}
      <Pressable style={styles.logoutButton} onPress={() => auth.signOut()}>
        <Text>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3de",
    padding: 20,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#c2c8a0",
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#e4e7d1",
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a503d",
  },
  level: {
    fontSize: 14,
    color: "#4a503d",
  },
  experience: {
    fontSize: 14,
    color: "#4a503d",
  },
  iconButton: {
    position: "absolute",
    top: 20,
    right: 60,
    backgroundColor: "#e4e7d1",
    padding: 10,
    borderRadius: 20,
  },
  iconButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a503d",
  },
  menuButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#e4e7d1",
    padding: 10,
    borderRadius: 20,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a503d",
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
});
