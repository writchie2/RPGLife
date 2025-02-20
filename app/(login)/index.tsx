/*
* First page for login. 
*
* TODO: 
* Move register account to own page.
* Add alternate login options
* Style and logo
* 
*/

import { Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import React,{ useState, useEffect } from 'react'
import { auth } from '../../FirebaseConfig'
import { sendEmailVerification } from "firebase/auth";

import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth'
import { router } from 'expo-router'


const index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user){
        if (auth.currentUser?.emailVerified){
          router.replace('/(tabs)');
        }
        else{
          Alert.alert('Login Failed', 'Your email is not authenticated: ' + auth.currentUser?.email, [
            {text: 'OK', onPress : () => {auth.signOut()}},
            {text: "Resend Email", onPress: () => {
              try {
                if (auth.currentUser) {
                  const verStatus = sendEmailVerification(auth.currentUser)
                }
              } catch (error: any) {
                  console.log(error);
                  Alert.alert("Failed to Send Email Verification", error.message + "\nPlease contact support.");
                }
              auth.signOut();}}
          ])
        }
      } 
    } catch (error: any) {
      console.log(error)
      Alert.alert('Login Failed', error.message)
    }
  }

  const resetPassword = async () => {
    try {
      router.push('/(login)/password_reset');
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.textInput} placeholder="email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.textInput} placeholder="password" value={password} onChangeText={setPassword} secureTextEntry/>
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(login)/register')}>
        <Text style={styles.text}>Make Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={resetPassword}>
        <Text style={styles.text}>Reset Password</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

export default index

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