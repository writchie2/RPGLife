import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Pressable, ScrollViewBase, TouchableOpacity, FlatList } from "react-native";

import { Skill } from '../utils/types';

interface SkillsListProps {
    skills: Skill[];
    mode: string;
  }
  //Component that returns a Flat List with skills from a given skill array
  const SkillsList: React.FC<SkillsListProps> = ({ 
    skills, // Array of skills from UserData interface
    mode // "active", "inactive", or "all"
  }) => {
    
    //Item that will be rendered for each skill
    //TO DO: styling
    //TO DO: change press action to route to quest page
    const renderItem = ({ item }: { item: Skill }) => (
      <TouchableOpacity style={styles.skillItem} onPress={() => alert("You selected skill with id:" + item.id)}>
        <Text style={styles.skillName}>{item.name}</Text>
        <Text style={styles.skillDescription}>{item.description}</Text>
        <Text style={styles.skillTrait}>Trait: {item.trait}</Text>
        <Text style={styles.expTrait}>Level {Math.floor((item.exp || 1)/ 100)} {(item.exp || 0) % 100} exp</Text>
      </TouchableOpacity>
    );

    let chosenSkills: Skill[] = skills;
      if (mode === "active"){
        chosenSkills = chosenSkills.filter((skill) => skill.active);
      }
      else if(mode === "inactive"){
        chosenSkills = chosenSkills.filter((skill) => !skill.active);
      }

      //If no skills are chosen, output text.
      if (chosenSkills.length == 0) {
        return(
            <View style={styles.skillItem}>
              <Text>No skills available</Text>
            </View>
            );
      }
      
  
    return (
      <FlatList
        data={chosenSkills}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    );
  };
  
  const styles = StyleSheet.create({
    listContainer: {
      padding: 16,
    },
    skillItem: {
      padding: 10,
      marginBottom: 12,
      borderRadius: 8,
      backgroundColor: '#f0f0f0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    skillName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    skillDescription: {
      marginTop: 5,
      fontSize: 14,
      color: '#555',
    },
    skillTrait: {
      marginTop: 5,
      fontSize: 12,
      color: '#888',
    },
    expTrait: {
      marginTop: 5,
      fontSize: 12,
      color: '#888',
    },
  });
  
  export default SkillsList;