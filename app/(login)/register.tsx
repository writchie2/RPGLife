/*
* Where a user can create an account
*
* TODO: 
* Move register account to own page.
* Add alternate register options
* Expand current options to ask for more info (name, phone number)
* Style and logo
* 
*/
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { router } from 'expo-router'
import { Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import { auth } from '../../FirebaseConfig'
import React, { useState } from 'react'

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
    

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user)
      {
        alert("Account created succesfully!");
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
        <TextInput style={styles.textInput} placeholder="email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.textInput} placeholder="password" value={password} onChangeText={setPassword} secureTextEntry/>
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
    title: {
      fontSize: 28, // A bit larger for a more striking appearance
      fontWeight: '800', // Extra bold for emphasis
      marginBottom: 40, // Increased space for a more airy, open feel
      color: '#1A237E', // A deep indigo for a sophisticated, modern look
    },
    textInput: {
      height: 50, // Standard height for elegance and simplicity
      width: '90%', // Full width for a more expansive feel
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