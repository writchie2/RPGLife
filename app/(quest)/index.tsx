/*
* Page that shows all info for a quest 
*
* TODO: 
* Impliment page
* Impliment database loding
* Styling 
* 
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
import { UserData, Quest, Skill, Checkpoint } from '../../utils/types';


import colors from "@/constants/colors";

type RootStackParamList = {
    Home: undefined;
    Skills: undefined;
    Quests: undefined;
    Stats: undefined;
  };


// TODO Implement Quest Page functionality
export default function QuestPage() {
  const user = auth.currentUser;

  const [questListVisible, setQuestListVisible] = useState(false);
  const [pastQuestListVisible, setPastQuestListVisible] = useState(false);

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

    {/* copying home page quest style for now*/}
    <TouchableOpacity 
      style={styles.section} 
      onPress={() => setQuestListVisible(!questListVisible)}
    > 
    <Text style={styles.sectionTitle}>
      {questListVisible ? 'Active Quests ▲' : 'Active Quests ▼'}
    </Text>
    </TouchableOpacity>
      {/*TODO fix QuestList and userData parts here once necessary components are added*/}
      {/* {questListVisible && ( <QuestsList quests={userData?.quests || []} mode="active" />)} */}

      {/*TODO fix once necessary components for pastQuestList */}
      
    <TouchableOpacity 
      style={styles.section} 
      onPress={() => setPastQuestListVisible(!pastQuestListVisible)}
    >
      <Text style={styles.sectionTitle}>
        {pastQuestListVisible ? 'Completed ▲' : 'Completed ▼'}
      </Text>
    </TouchableOpacity>
      {/*{pastQuestListVisible && (<PastQuestsList pastquests={userData?.pastquests || []} mode="active" />*/}
      
    {/* Add Button */}
    <Pressable style={styles.addButton} onPress={() => router.push("/(quest)/create_quest")}>
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