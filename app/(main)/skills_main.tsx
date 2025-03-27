/*
simple skeleton of the skills page
that shows active skills and archived skills
*/

import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Pressable, ScrollViewBase, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from '../../FirebaseConfig';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import SkillsList  from '../../components/SkillsList'
import { useUserData } from '@/contexts/UserContext';
import { BackHandler, Alert } from "react-native";


//import { fetchUserData } from '../../utils/firestoreUtils';
//import { saveUserData, getUserData } from '../../utils/storageUtils';
import { UserData, Skill, Checkpoint } from '../../utils/types';

import colors from "@/constants/colors";
import UserHeader from "@/components/UserHeader";
import CreateSkillModal from "@/components/CreateSkillModal";

// TODO Implement Skills Page functionality
export default function SkillsPage() {
  const user = auth.currentUser;
  const userData = useUserData();
  

  useEffect(() => {
            const backAction = () => {
              router.replace("/(main)"); // Navigate back to home
              return true; // Prevent default behavior
            };
            const backHandler = BackHandler.addEventListener(
                  "hardwareBackPress",
                  backAction
                );
                return () => backHandler.remove();
        }, []);

  const [skillsListVisible, setSkillsListVisible] = useState(false);
  const [pastSkillsListVisible, setPastSkillsListVisible] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);
  
  

  return (
    <View style={styles.container}>
    
        {/* User Header */}
        <UserHeader></UserHeader>

      
        <View>
            {/*section for skill lists*/}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
                style={styles.section} 
                onPress={() => setSkillsListVisible(!skillsListVisible)}
            > 
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>
                    {skillsListVisible ? 'Active Skills ▲' : 'Active Skills ▼'}
                  </Text>
               </View>
            </TouchableOpacity>
            {skillsListVisible && ( 
                
                <SkillsList skills={userData.userData?.skills || []} mode="active" />
                )} 

            </View>

            {/*Completed section*/}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
                style={styles.section} 
                onPress={() => setPastSkillsListVisible(!pastSkillsListVisible)}
            >
              <View style={styles.sectionTitleContailer}>
                <Text style={styles.sectionTitle}>
                    {pastSkillsListVisible ? 'Completed ▲' : 'Completed ▼'}
                </Text>
              </View>
            </TouchableOpacity>
            {pastSkillsListVisible && (
                <SkillsList skills={userData.userData?.skills || []} mode="inactive" />
                )}
        </View>
      </View>

        <CreateSkillModal visible={skillsModalVisible} onClose={() => setSkillsModalVisible(false)}></CreateSkillModal>
        
        {/* Add Button */}
        <Pressable style={styles.addButton} onPress={() => setSkillsModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
        </Pressable>
    </View>
    );
}

//styling, similar to home page:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
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
  title: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 48,
    color: colors.textDark,
  },
  sectionTitle: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 24,
    color: colors.text,
  },
  dropdownContainer:{
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
