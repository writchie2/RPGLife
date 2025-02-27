/*
 * Where user can reset password if forgotten
 *
 * TODO:
 * Impliment using Firebase
 * Possibly create another confirmation page depending on implimentation
 *
 */
import React, { useState } from "react";
import { auth } from "../../FirebaseConfig";
import { router } from "expo-router";
import UserHeader from "@/components/UserHeader";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
} from "react-native";
import {
  getAuth,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  verifyPasswordResetCode,
  EmailAuthCredential,
} from "@firebase/auth";

import { useEffect } from "react";
import { BackHandler } from "react-native";

import colors from "@/constants/colors";

export default function Settings() {
    useEffect(() => {
            const backAction = () => {
              router.back(); // Navigate back to login
              return true; // Prevent default behavior
            };
        
            const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        
            return () => backHandler.remove(); // Cleanup
          }, []);

    return (
        
      <View style={styles.headerContainer}>
        <UserHeader></UserHeader>
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Image
            style={styles.logo}
            source={require("../../assets/images/RPGiconShield.png")}
            />
            <TouchableOpacity style={styles.button} onPress={() => router.push("/(main)")}>
            <Text style={styles.buttonText}>Go Home</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    headerContainer:{
        flex: 1,
        backgroundColor: colors.bgPrimary,
        alignItems: "center",
    },
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: colors.bgPrimary,
    },
    title: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 36,
      color: colors.text,
      marginBottom: 15, // Increased space for a more airy, open feel
    },
    logo: {
      height: 200,
      aspectRatio: 1, // maintains correct image width -> aspectRation = width/height
      // marginTop: 5,
      marginBottom: 10,
    },
    form: {
      backgroundColor: colors.bgSecondary,
      marginTop: 15,
      padding: 15,
      borderRadius: 8,
      width: "90%",
      shadowColor: colors.shadowLight, // Shadow color
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
    inputGroup: {
      marginBottom: 8,
    },
    inputLabel: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 18,
      color: colors.text,
      marginBottom: 2,
    },
    inputField: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.textInput,
      paddingHorizontal: 10,
      backgroundColor: colors.bgPrimary,
      height: 48,
      borderColor: colors.borderInput,
      borderWidth: 2,
      borderRadius: 6,
    },
    button: {
      width: "56%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgSecondary,
      borderRadius: 100, // full rounded corners
      marginTop: 25,
      padding: 18,
      shadowColor: colors.shadow, // Shadow color to match the button for a cohesive look
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonText: {
      fontFamily: "Metamorphous_400Regular",
      color: colors.textDark, // match title color, slightly darker due to being on darker bg
      fontSize: 20, // Slightly larger for emphasis
    },
  });