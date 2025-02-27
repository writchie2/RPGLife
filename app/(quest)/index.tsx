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



export default function QuestPage() {
  const user = auth.currentUser;

  const usersCollection = collection(db, 'users');
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace('/(login)');
  });

  const [questListVisible, setQuestListVisible] = useState(false);
  const [pastQuestListVisible, setPastQuestListVisible] = useState(false);

  return (
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quests</Text>
        </View>

        {/* copying home page quest style for now*/}
        <TouchableOpacity 
        style={styles.section} 
        onPress={() => setQuestListVisible(!questListVisible)}
        >
        <Text style={styles.sectionTitle}>
          {questListVisible ? 'Hide Quests ▲' : 'Quests ▼'}
        </Text>
        </TouchableOpacity>
        {/*TODO fix QuestList and userData parts here once necessary components are added*/}
         {/* {questListVisible && ( <QuestsList quests={userData?.quests || []} mode="active" />)} */}

      {/*TODO add additional drop menu for past quests, also fix once necessary components are added */}
      
      <TouchableOpacity 
        style={styles.section} 
        onPress={() => setPastQuestListVisible(!pastQuestListVisible)}
        >
        <Text style={styles.sectionTitle}>
          {pastQuestListVisible ? 'Hide Past Quests ▲' : 'Past Quests ▼'}
        </Text>
        </TouchableOpacity>
        {/*{pastQuestListVisible && (<PastQuestsList pastquests={userData?.pastquests || []} mode="active" />*/}
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgPrimary,
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