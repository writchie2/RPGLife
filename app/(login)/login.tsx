/*
 * First page for login.
 *
 * TODO:
 * Move register account to own page.
 * Add alternate login options
 * Style and logo
 *
 */

import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../../FirebaseConfig";
import { sendEmailVerification } from "firebase/auth";

import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { router } from "expo-router";

import colors from "@/constants/colors";

// import Fonts
import { useFonts } from "expo-font";
import { Metamorphous_400Regular } from "@expo-google-fonts/metamorphous";
import { Alegreya_400Regular } from "@expo-google-fonts/alegreya";

const index = () => {
  // load fonts
  const [fontsLoaded] = useFonts({
    Metamorphous_400Regular,
    Alegreya_400Regular,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        if (auth.currentUser?.emailVerified) {
          router.replace("/(main)");
        } else {
          Alert.alert(
            "Login Failed",
            "Your email is not authenticated: " + auth.currentUser?.email,
            [
              {
                text: "OK",
                onPress: () => {
                  auth.signOut();
                },
              },
              {
                text: "Resend Email",
                onPress: () => {
                  try {
                    if (auth.currentUser) {
                      const verStatus = sendEmailVerification(auth.currentUser);
                    }
                  } catch (error: any) {
                    console.log(error);
                    Alert.alert(
                      "Failed to Send Email Verification",
                      error.message + "\nPlease contact support."
                    );
                  }
                  auth.signOut();
                },
              },
            ]
          );
        }
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert("Login Failed", error.message);
    }
  };

  const resetPassword = async () => {
    try {
      router.push("/(login)/password_reset");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  // ensure fonts are loaded
  if (!fontsLoaded) {
    return null; // or add a loading indicator in future!
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Image
          style={styles.logo}
          source={require("../../assets/images/RPGiconAlt-sm.png")}
        />
        <SafeAreaView style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput
              style={styles.inputField}
              placeholder="email..."
              placeholderTextColor={colors.textPlaceholder}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password:</Text>
            <TextInput
              style={styles.inputField}
              placeholder="password..."
              placeholderTextColor={colors.textPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </SafeAreaView>

        <TouchableOpacity style={styles.button} onPress={signIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => router.push("/(login)/register")}
        >
          <Text style={styles.buttonText2}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={resetPassword}>
          <Text style={styles.linkText}>Reset Password</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgPrimary, // A softer white for a modern, minimalist background
  },
  title: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 36,
    color: colors.text,
  },
  logo: {
    height: 200,
    aspectRatio: 1, // maintains correct image width -> aspectRation = width/height
    marginTop: 16,
    marginBottom: 10,
  },
  form: {
    backgroundColor: colors.bgSecondary,
    marginTop: 15,
    padding: 15,
    paddingTop: 18,
    paddingBottom: 10,
    borderRadius: 8,
    width: "90%",
    shadowColor: colors.shadowLight, // Shadow color
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 12,
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
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgSecondary,
    borderRadius: 100, // full rounded corners
    marginTop: 25,
    padding: 15,
    shadowColor: colors.shadow, // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  button2: {
    width: "56%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgPrimary,
    borderColor: colors.textLight,
    borderWidth: 1.5,
    borderRadius: 100, // full rounded corners
    marginTop: 25,
    padding: 15,
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
  buttonText2: {
    fontFamily: "Metamorphous_400Regular",
    color: colors.text, // match title color, slightly darker due to being on darker bg
    fontSize: 20, // Slightly larger for emphasis
  },
  link: {
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 100, // full rounded corners
    marginTop: 20,
    padding: 15,
  },
  linkText: {
    fontFamily: "Alegreya_400Regular",
    fontSize: 18,
    color: colors.textLight,
    borderBottomWidth: 0.5,
    borderColor: colors.textLight,
  },
});
