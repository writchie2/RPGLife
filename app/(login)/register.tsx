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
import { validatePassword } from "firebase/auth";
import React, { useState } from "react";
import { db } from "../../FirebaseConfig";
import { setDoc, doc, query, where } from "firebase/firestore";
import DatePickerComponent from "../../components/DatePickerComponent";

import { useEffect } from "react";
import { BackHandler } from "react-native";

// -TEST------------------------------

import { useFonts } from "expo-font";
import { Metamorphous_400Regular } from "@expo-google-fonts/metamorphous";

// -TEST- choose a font that works inside input
import { Alegreya_400Regular } from "@expo-google-fonts/alegreya";
import { Almendra_400Regular } from "@expo-google-fonts/almendra";
import { ArefRuqaa_400Regular } from "@expo-google-fonts/aref-ruqaa";
import { Laila_400Regular } from "@expo-google-fonts/laila";

// ------------------------------TEST-

export default function RegisterScreen() {
  // -TEST------------------------------
  // useFonts({ Metamorphous_400Regular});
  const [fontsLoaded] = useFonts({
    Metamorphous_400Regular,
    Alegreya_400Regular,
    Almendra_400Regular,
    ArefRuqaa_400Regular,
    Laila_400Regular,
  });

  // if (!fontsLoaded) {
  //   return null; // or a loading indicator
  // }
  // ------------------------------TEST-

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
        alert("Account created succesfully!");
        if (auth.currentUser?.uid) {
          await setDoc(doc(db, "users", auth.currentUser.uid), {
            username: userName,
            email: email,
            birthday: date.toDateString(),
          });
        } else {
          alert("Database did not create a new doc for new user");
        }
        auth.signOut();
        router.replace("/(login)");
      }
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  // -TEST- if else
  if (!fontsLoaded) {
    return null; // or a loading indicator -> makes sure fonts are loaded before opening screen
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Image
          style={styles.logo}
          source={require("../../assets/images/RPGicon-sm.png")}
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
                label="Birthday"
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
      // /*
      // <SafeAreaView style={styles.container}>
      //   <Text style={styles.title}>Create Account</Text>
      //   <SafeAreaView style={styles.formContainer}>
      //     <Text style={styles.label}>Username:</Text>
      //     <TextInput
      //       style={styles.textInputFull}
      //       placeholder="Username"
      //       placeholderTextColor={"#D3D3D3"}
      //       autoCapitalize="none"
      //       value={userName}
      //       onChangeText={setUserName}
      //     />
      //     <SafeAreaView style={styles.labelRow}>
      //       <Text style={styles.label}>Email:</Text>
      //       <Text style={styles.label}>Birthday:</Text>
      //     </SafeAreaView>
      //     <SafeAreaView style={styles.row}>
      //       <TextInput
      //         style={styles.textInputRow}
      //         placeholder="Email"
      //         placeholderTextColor={"#D3D3D3"}
      //         autoCapitalize="none"
      //         value={email}
      //         onChangeText={setEmail}
      //       />
      //       <DatePickerComponent
      //         style={styles.textInputRow}
      //         label="Birthday"
      //         dateSelected={dateSelected}
      //         onDateChange={(date: Date) => {
      //           setDate(date);
      //           setDateSelected(true);
      //         }}
      //       />
      //     </SafeAreaView>
      //     <SafeAreaView style={styles.labelRow}>
      //       <Text style={styles.label}>Password:</Text>
      //       <Text style={styles.label}>Confirm Password:</Text>
      //     </SafeAreaView>
      //     <SafeAreaView style={styles.row}>
      //       <TextInput
      //         style={styles.textInputRow}
      //         placeholder="Password"
      //         placeholderTextColor={"#D3D3D3"}
      //         value={password}
      //         onChangeText={setPassword}
      //         secureTextEntry
      //       />
      //       <TextInput
      //         style={styles.textInputRow}
      //         placeholder="Confirm Password"
      //         placeholderTextColor={"#D3D3D3"}
      //         value={confirmPassword}
      //         onChangeText={setConfirmPassword}
      //         secureTextEntry
      //       />
      //     </SafeAreaView>
      //   </SafeAreaView>
      //   <TouchableOpacity style={styles.button} onPress={signUp}>
      //     <Text style={styles.text}>Create</Text>
      //   </TouchableOpacity>
      // </SafeAreaView>
      // */
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: '#FAFAFA', // A softer white for a modern, minimalist background
    backgroundColor: "#E4EAD6", // main background color
    padding: 20,
  },
  title: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 36,
    color: "#394022E6",
  },
  logo: {
    height: 200,
    // width: 220,
    aspectRatio: 1.1, // maintains width aspectRation = width/height
    marginTop: 15,
    marginBottom: 5,
  },
  form: {
    backgroundColor: "#C2CFA0",
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    shadowColor: "#777", // Shadow color to match the button for a cohesive look
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
    // fontFamily: "ArefRuqaa_400Regular",
    // fontFamily: "Laila_400Regular",
    // fontFamily: "Almendra_400Regular",
    fontSize: 16,
    color: "#394022CC",
    paddingHorizontal: 10,
    backgroundColor: "#E4EAD6",
    height: 45,
    borderColor: "#656E4A",
    borderWidth: 2,
    borderRadius: 6,
  },
  inputDate: {
    // DONE INSIDE DATE-PICKER-COMPONENT
    // fontSize: 16,
    // color: "#394022CC",
    backgroundColor: "#E4EAD6",
    height: 45,
    borderColor: "#656E4A",
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 10,
    // width: "35%",
  },
  button: {
    width: "40%",
    marginVertical: 15,
    backgroundColor: "#C2CFA0", // A lighter indigo to complement the title color
    padding: 15,
    borderRadius: 100, // Matching rounded corners for consistency
    // borderWidth: 2,
    // borderColor: "#656E4A",
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
    color: "#394022", // Maintained white for clear visibility
    fontSize: 20, // Slightly larger for emphasis
  },
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     // backgroundColor: '#FAFAFA', // A softer white for a modern, minimalist background
//     backgroundColor: "#E4EAD6", // main background color
//     padding: 20,
//   },
//   formContainer: {
//     backgroundColor: "#C2CFA0",
//     padding: 15,
//     borderRadius: 8,
//     width: "100%",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between", // Optional, for spacing between inputs
//     gap: "05%",
//   },
//   labelRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     width: "100%",
//   },
//   label: {
//     fontFamily: "Metamorphous_400Regular",
//     fontSize: 16,
//     color: "#394022",
//   },
//   title: {
//     fontFamily: "Metamorphous_400Regular",
//     fontSize: 36,
//     color: "#394022",
//     // fontSize: 28, // A bit larger for a more striking appearance
//     // fontWeight: "800", // Extra bold for emphasis -NOTE- cant use it will remove font style
//     marginBottom: 40, // Increased space for a more airy, open feel
//     // color: "#1A237E", // A deep indigo for a sophisticated, modern look
//   },
//   textInputFull: {
//     height: 50, // Standard height for elegance and simplicity
//     width: "100%", // Full width for a more expansive feel
//     backgroundColor: "#FFFFFF", // Pure white for contrast against the container
//     borderColor: "#E8EAF6", // A very light indigo border for subtle contrast
//     borderWidth: 2,
//     borderRadius: 6, // Softly rounded corners for a modern, friendly touch
//     paddingHorizontal: 10, // Generous padding for ease of text entry
//     fontSize: 16, // Comfortable reading size
//     color: "#3C4858", // A dark gray for readability with a hint of warmth
//     shadowColor: "#9E9E9E", // A medium gray shadow for depth
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4, // Slightly elevated for a subtle 3D effect
//   },
//   textInputRow: {
//     height: 50, // Standard height for elegance and simplicity
//     width: "45%", // Full width for a more expansive feel
//     backgroundColor: "#FFFFFF", // Pure white for contrast against the container
//     borderColor: "#E8EAF6", // A very light indigo border for subtle contrast
//     borderWidth: 2,
//     borderRadius: 6, // Softly rounded corners for a modern, friendly touch
//     paddingHorizontal: 10, // Generous padding for ease of text entry
//     fontSize: 16, // Comfortable reading size
//     color: "#3C4858", // A dark gray for readability with a hint of warmth
//     shadowColor: "#9E9E9E", // A medium gray shadow for depth
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4, // Slightly elevated for a subtle 3D effect
//   },
//   button: {
//     width: "90%",
//     marginVertical: 15,
//     backgroundColor: "#5C6BC0", // A lighter indigo to complement the title color
//     padding: 20,
//     borderRadius: 15, // Matching rounded corners for consistency
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#5C6BC0", // Shadow color to match the button for a cohesive look
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   text: {
//     color: "#FFFFFF", // Maintained white for clear visibility
//     fontSize: 18, // Slightly larger for emphasis
//     fontWeight: "600", // Semi-bold for a balanced weight
//   },
// });
