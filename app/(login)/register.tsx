/*
* Where a user can create an account
*
* TODO: 
* Add alternate register options
* Style and logo
* 
*/
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { router } from 'expo-router'
import { Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import { auth } from '../../FirebaseConfig'
import { validatePassword } from 'firebase/auth'
import React, { useState } from 'react'
import { db } from '../../FirebaseConfig'
import { setDoc, doc, query, where } from 'firebase/firestore';
import DatePickerComponent from "../../components/DatePickerComponent";

import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function RegisterScreen() {
    useEffect(() => {
        const backAction = () => {
          router.back(); // Navigate back to login
          return true; // Prevent default behavior
        };
    
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    
        return () => backHandler.remove(); // Cleanup
      }, []);
    
    const [userName, setUserName] = useState('');
    //const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState(new Date());
    const [dateSelected, setDateSelected] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

  
const signUp = async () => {

    if(userName.trim().length === 0  || email.trim().length ===0 || password.trim().length === 0 || !dateSelected)
    {
      alert('Please fill out all fields!');
      return;
    }
    if (!(password === confirmPassword))
    {
      alert('Passwords do not match!');
      return;
    }
    const status = await validatePassword(auth, password);
    if (!status.isValid) {
      alert('Password does not meet requirements!');
      // This stuff we can use later to show a more detailed message
      const needsLowerCase = status.containsLowercaseLetter !== true;
      const needsUpperCase = status.containsUppercaseLetter !== true;
      const needsNumericCase = status.containsNumericCharacter !== true;
      const needsSpecialCase = status.containsNonAlphanumericCharacter !== true;
    }

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user)
      {
        
        alert("Account created succesfully!");
        if(auth.currentUser?.uid){
          alert('we got here' + auth.currentUser.uid);
          await setDoc(doc(db, "users", auth.currentUser.uid), {
            username: userName,
            email: email,
            birthday: date.toDateString()
          });
          
      }
      else {
        alert("Database did not create a new doc for new user");
          }
        auth.signOut();
        router.replace('/(login)');
      }
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
    }
  }

  return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Create a new account</Text>
        
        <TextInput style={styles.textInputFull} placeholder="User Name" placeholderTextColor={'#D3D3D3'} autoCapitalize='none' value={userName} onChangeText={setUserName} />
  
        <SafeAreaView style={styles.row}>
          <TextInput style={styles.textInputRow} placeholder="Email" placeholderTextColor={'#D3D3D3'} autoCapitalize='none' value={email} onChangeText={setEmail} />
          <DatePickerComponent style={styles.textInputRow} label="Birthday" dateSelected={dateSelected} onDateChange={(date: Date) => {setDate(date); setDateSelected(true); }}/>
        </SafeAreaView>
        <SafeAreaView style={styles.row}>
          <TextInput style={styles.textInputRow} placeholder="Password" placeholderTextColor={'#D3D3D3'} value={password} onChangeText={setPassword} secureTextEntry/>
          <TextInput style={styles.textInputRow} placeholder="Confirm Password" placeholderTextColor={'#D3D3D3'} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry/>
        </SafeAreaView>
        <TouchableOpacity style={styles.button} onPress={signUp}>
          <Text style={styles.text}>Create</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
}

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FAFAFA', // A softer white for a modern, minimalist background
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Optional, for spacing between inputs
      padding: 10,
      gap: '05%',
    },
    title: {
      fontSize: 28, // A bit larger for a more striking appearance
      fontWeight: '800', // Extra bold for emphasis
      marginBottom: 40, // Increased space for a more airy, open feel
      color: '#1A237E', // A deep indigo for a sophisticated, modern look
    },
    textInputFull: {
      height: 50, // Standard height for elegance and simplicity
      width: '85%', // Full width for a more expansive feel
      backgroundColor: '#FFFFFF', // Pure white for contrast against the container
      borderColor: '#E8EAF6', // A very light indigo border for subtle contrast
      borderWidth: 2,
      borderRadius: 15, // Softly rounded corners for a modern, friendly touch
      marginVertical: 15,
      paddingHorizontal: 25, // Generous padding for ease of text entry
      fontSize: 16, // Comfortable reading size
      color: '#3C4858', // A dark gray for readability with a hint of warmth
      shadowColor: '#9E9E9E', // A medium gray shadow for depth
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4, // Slightly elevated for a subtle 3D effect
    },
    textInputRow: {
      height: 50, // Standard height for elegance and simplicity
      width: '40%', // Full width for a more expansive feel
      backgroundColor: '#FFFFFF', // Pure white for contrast against the container
      borderColor: '#E8EAF6', // A very light indigo border for subtle contrast
      borderWidth: 2,
      borderRadius: 15, // Softly rounded corners for a modern, friendly touch
      marginVertical: 15,
      paddingHorizontal: 25, // Generous padding for ease of text entry
      fontSize: 16, // Comfortable reading size
      color: '#3C4858', // A dark gray for readability with a hint of warmth
      shadowColor: '#9E9E9E', // A medium gray shadow for depth
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4, // Slightly elevated for a subtle 3D effect
    },
    button: {
      width: '90%',
      marginVertical: 15,
      backgroundColor: '#5C6BC0', // A lighter indigo to complement the title color
      padding: 20,
      borderRadius: 15, // Matching rounded corners for consistency
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#5C6BC0', // Shadow color to match the button for a cohesive look
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
      elevation: 5,
    },
    text: {
      color: '#FFFFFF', // Maintained white for clear visibility
      fontSize: 18, // Slightly larger for emphasis
      fontWeight: '600', // Semi-bold for a balanced weight
    }
  });