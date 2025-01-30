/*
* Quest Tab Screen that will show all active and completed quests
* Existing code is boilerplate code that will need to be altered. 
*
* TODO: 
* Impliment database loading of quests
* Create action buttons to alter or delete quests 
* Styling
* 
*/

import { StyleSheet, Image, FlatList, Alert, TouchableOpacity, SafeAreaView, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../../FirebaseConfig';
import { getDownloadURL, ref, uploadBytes, listAll, deleteObject } from 'firebase/storage';

import { User, onAuthStateChanged } from 'firebase/auth';

export default function QuestTabScreen() {
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Storage</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C6BC0',
    shadowColor: '#5C6BC0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});