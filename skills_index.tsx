/*
simple skeleton of the skills page
that shows active skills and archived skills
TODO later date: design and make the page look pretty
*/

import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Pressable, ScrollViewBase, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from '../../FirebaseConfig';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { getAuth } from 'firebase/auth';

//import { fetchUserData } from '../../utils/firestoreUtils';
//import { saveUserData, getUserData } from '../../utils/storageUtils';
import { UserData, Skill, Checkpoint } from '../../utils/types';

import colors from "@/constants/colors";

type RootStackParamList = {
    Home: undefined;
    Skills: undefined;
    Quests: undefined;
    Stats: undefined;
  };

// TODO Implement Skills Page functionality
export default function SkillsPage() {
  const user = auth.currentUser;

  const [skillsListVisible, setSkillsListVisible] = useState(false);
  const [pastSkillsListVisible, setPastSkillsListVisible] = useState(false);

  return (
    <View style={styles.container}>
    {/* User section similar to home page user section */}
    <View style={styles.userSection}>
      <View style={styles.avatar}></View>
      <View>
        {/* TODO Default spots for user data for now, add actual data connection later */}
        <Text style={styles.username}>Username{}</Text>
        <Text style={styles.level}>Level {}</Text>
        <Text style={styles.experience}>exp</Text>
      </View>
    </View>

    {/*skills style for now*/}
    <TouchableOpacity 
      style={styles.section} 
      onPress={() => setSkillsListVisible(!skillsListVisible)}
    > 
    <Text style={styles.sectionTitle}>
      {skillsListVisible ? 'Active Skills ▲' : 'Active Skills ▼'}
    </Text>
    </TouchableOpacity>
      {/*TODO fix SkillsList and userData parts here once necessary components are added*/}
      {/* {skillsListVisible && ( <SkillsList skills={userData?.skills || []} mode="active" />)} */}

      {/*TODO fix once necessary components for pastSkillsList */}
      
    <TouchableOpacity 
      style={styles.section} 
      onPress={() => setPastSkillsListVisible(!pastSkillsListVisible)}
    >
      <Text style={styles.sectionTitle}>
        {pastSkillsListVisible ? 'Completed ▲' : 'Completed ▼'}
      </Text>
    </TouchableOpacity>
      {/*{pastSkillsListVisible && (<PastSkillsList pastskills={userData?.pastskills || []} mode="active" />*/}
      
    {/* Add Button */}
    <Pressable style={styles.addButton} onPress={() => router.push("/(skills)/create_skills")}>
      <Text style={styles.addButtonText}>+</Text>
    </Pressable>
    </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
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
  title: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 48,
    color: colors.textDark,
  },
  sectionTitle: {
    fontSize: 18,
    top: 0,
    fontWeight: "bold",
    color: "#4a503d",
  },
  section: {
    backgroundColor: "#c2c8a0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
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
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a503d",
  },
});
