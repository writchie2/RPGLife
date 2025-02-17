/*
 * Where a user can create an account
 *
 * TODO:
 * Add alternate register options
 * Style and logo
 *
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { router } from "expo-router";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
} from "react-native";
import { auth } from "../../FirebaseConfig";
import { validatePassword, sendEmailVerification } from "firebase/auth";
import React, { useState } from "react";
import { db } from "../../FirebaseConfig";
import { setDoc, doc, query, where } from "firebase/firestore";
import DatePickerComponent from "../../components/DatePickerComponent";

import { useEffect } from "react";
import { BackHandler } from "react-native";

// import Fonts
import { useFonts } from "expo-font";
import { Metamorphous_400Regular } from "@expo-google-fonts/metamorphous";
import { Alegreya_400Regular } from "@expo-google-fonts/alegreya";

export default function RegisterScreen() {
  // load fonts
  const [fontsLoaded] = useFonts({
    Metamorphous_400Regular,
    Alegreya_400Regular,
  });

  useEffect(() => {
    const backAction = () => {
      router.back(); // Navigate back to login
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup
  }, []);

  const [userName, setUserName] = useState("");
  //const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

  const signUp = async () => {
    if (
      userName.trim().length === 0 ||
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      !dateSelected
    ) {
      alert("Please fill out all fields!");
      return;
    }
    if (!(password === confirmPassword)) {
      alert("Passwords do not match!");
      return;
    }
    const status = await validatePassword(auth, password);
    if (!status.isValid) {
      alert("Password does not meet requirements!");
      // This stuff we can use later to show a more detailed message
      const needsLowerCase = status.containsLowercaseLetter !== true;
      const needsUpperCase = status.containsUppercaseLetter !== true;
      const needsNumericCase = status.containsNumericCharacter !== true;
      const needsSpecialCase = status.containsNonAlphanumericCharacter !== true;
    }

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        const curUser = auth.currentUser;

        if (curUser?.uid) {
          await setDoc(doc(db, "users", curUser.uid), {
            username: userName,
            email: email,
            birthday: date.toDateString(),
          });
          try {
            const verStatus = sendEmailVerification(curUser);
          } catch (error: any) {
            console.log(error);
            alert(
              "Email verfication failed: " +
                error.message +
                "\nPlease contact support."
            );
          }
        } else {
          alert("Database did not create a new doc for new user");
        }

        alert(
          "Account created succesfully!\nVerification email sent to " +
            curUser?.email
        );
        auth.signOut();
        router.replace("/(login)");
      }
    } catch (error: any) {
      console.log(error);
      alert("Account creation failed: " + error.message);
    }
  };

  // ensure fonts are loaded
  if (!fontsLoaded) {
    return null; // or add a loading indicator in future!
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        {/* <Image
          style={styles.logo}
          source={require("../../assets/images/RPGicon-sm.png")}
        /> */}
        <Image
          style={styles.logo}
          source={require("../../assets/images/RPGiconLine-sm.png")}
        />

        <SafeAreaView style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username:</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Username..."
              placeholderTextColor={"#39402260"}
              autoCapitalize="none"
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroupRowLeft}>
              <Text style={styles.inputLabel}>Email:</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Email..."
                placeholderTextColor={"#39402260"}
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroupRowRight}>
              <Text style={styles.inputLabel}>Birthday:</Text>
              <DatePickerComponent
                style={styles.inputDate}
                label="mm/dd/yyyy"
                dateSelected={dateSelected}
                onDateChange={(date: Date) => {
                  setDate(date);
                  setDateSelected(true);
                }}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password:</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Password..."
              placeholderTextColor={"#39402260"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password:</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Confirm Password..."
              placeholderTextColor={"#39402260"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </SafeAreaView>
        <TouchableOpacity style={styles.button} onPress={signUp}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E4EAD6", // main background color
    padding: 20,
  },
  title: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 36,
    color: "#394022E6",
  },
  logo: {
    // height: 200,
    // aspectRatio: 1.1, // maintains correct image width -> aspectRation = width/height
    // marginTop: 15,
    // marginBottom: 5,
    height: 80,
    aspectRatio: 4.75, // maintains correct image width -> aspectRation = width/height
    marginTop: 20,
    marginBottom: 14,
  },
  form: {
    backgroundColor: "#C2CFA0",
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    shadowColor: "#777", // Shadow color
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  inputRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputGroupRowLeft: {
    width: "60%",
  },
  inputGroupRowRight: {
    width: "35%",
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 18,
    color: "#394022E6",
    marginBottom: 2,
  },
  inputField: {
    fontFamily: "Alegreya_400Regular",
    fontSize: 18,
    color: "#394022CC",
    paddingHorizontal: 10,
    backgroundColor: "#E4EAD6",
    height: 48,
    borderColor: "#656E4A",
    borderWidth: 2,
    borderRadius: 6,
  },
  inputDate: {
    // DONE INSIDE DATE-PICKER-COMPONENT
    // fontFamily: "Alegreya_400Regular",
    // fontSize: 18,
    // color: "#394022CC",
    backgroundColor: "#E4EAD6",
    height: 48,
    borderColor: "#656E4A",
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 10,
    // width: "35%", // handled by inputGroupRowRight style
  },
  button: {
    width: "40%",
    marginVertical: 15,
    backgroundColor: "#C2CFA0",
    padding: 15,
    borderRadius: 100, // full rounded corners
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#555", // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "Metamorphous_400Regular",
    color: "#394022", // match title color, slightly darker due to being on darker bg
    fontSize: 20, // Slightly larger for emphasis
  },
});
