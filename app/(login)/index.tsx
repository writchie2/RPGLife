/*
 * Where a user can log in to their account
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useFonts } from "expo-font";
import { Metamorphous_400Regular } from "@expo-google-fonts/metamorphous";
import { useRouter } from "expo-router";

import colors from "@/constants/colors";

export default function LoginScreen() {
  const [fontsLoaded] = useFonts({ Metamorphous_400Regular });
  const router = useRouter();

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RPG LIFE</Text>
      <Image
        source={require("../../assets/images/RPGiconFull-sm.png")}
        style={styles.logo}
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/(login)/login")}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.push("/(login)/register")}
      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.guestText}>Continue as guest</Text>
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
  logo: {
    height: 190,
    aspectRatio: 2.2, // maintains correct image width -> aspectRation = width/height
    marginTop: 54,
    marginBottom: 42,
  },
  loginButton: {
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgSecondary,
    padding: 12,
    borderRadius: 100,
    marginTop: 25,
    shadowColor: colors.shadow, // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  loginText: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 20,
    color: colors.textDark,
  },
  signUpButton: {
    width: "38%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgPrimary,
    borderColor: colors.textLight,
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 100,
    marginTop: 25,
    shadowColor: colors.shadow, // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  signUpText: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 20,
    color: colors.text,
  },
  guestText: {
    marginTop: 20,
    fontFamily: "Alegreya_400Regular",
    fontSize: 16,
    color: colors.textLight,
    // borderBottomWidth: 0.5,
    // borderColor: colors.textLight,
  },
});
