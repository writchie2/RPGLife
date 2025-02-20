/*
* Where a user can log in to their account
*/

import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { Metamorphous_400Regular } from "@expo-google-fonts/metamorphous";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [fontsLoaded] = useFonts({ Metamorphous_400Regular });
  const router = useRouter();

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RPG LIFE</Text>
      <Image source={require("../../assets/images/rpg-icons.png")} style={styles.logo} />
      <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/login")}> 
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/signup")}> 
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
    backgroundColor: "#E4EAD6",
  },
  title: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 36,
    color: "#394022",
  },
  logo: {
    height: 120,
    width: 120,
    marginVertical: 20,
  },
  loginButton: {
    backgroundColor: "#A3A77D",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginVertical: 10,
  },
  loginText: {
    fontSize: 18,
    color: "#394022",
  },
  signUpButton: {
    borderColor: "#394022",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  signUpText: {
    fontSize: 18,
    color: "#394022",
  },
  guestText: {
    fontStyle: "italic",
    marginTop: 10,
    color: "#394022",
  },
});
