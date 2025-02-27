import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { Quest } from '../utils/types';

interface QuestsListProps {
  quests: Quest[];
  mode: string;
}

//Component that returns a Flat List with quests from a given quest array
const QuestsList: React.FC<QuestsListProps> = ({ 
  quests, // Array of quests from UserData interface
  mode // "active", "inactive", or "all"
}) => {
  
  //Item that will be rendered for each quest
  //TO DO: styling
  //TO DO: change press action to route to quest page
  const renderItem = ({ item }: { item: Quest }) => (
    <TouchableOpacity style={styles.questItem} onPress={() => alert("You selected quest with id:" + item.id)}>
      <Text style={styles.questName}>{item.name}</Text>
      <Text style={styles.questDescription}>{item.description}</Text>
      <Text style={styles.questDetails}>
        Difficulty: {item.difficulty} | Due: {item.dueDate}
      </Text>
      <Text style={styles.questSkills}>
        Primary Skill: {item.primarySkill} {item.secondarySkill ? "| Secondary Skill: " + item.secondarySkill : '' }
      </Text>
      <Text style={styles.questRepeatability}>
        Repeatable: {item.repeatable ? 'Yes' : 'No'}
      </Text>
    </TouchableOpacity>
  );

  let chosenQuests: Quest[] = quests;
  if (mode === "active"){
    chosenQuests = quests.filter((quest) => quest.active);
  }
  else if(mode === "inactive"){
    chosenQuests = quests.filter((quest) => !quest.active);
  }

  //If no quests are chosen, output text.
  if (chosenQuests.length == 0) {
    return(
    <View style={styles.questItem}>
      <Text>No quests available</Text>
    </View>
    );
  }

  return (
    <FlatList
      data={chosenQuests}
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
  questItem: {
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
  questName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  questDescription: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  questDetails: {
    marginTop: 5,
    fontSize: 12,
    color: '#888',
  },
  questSkills: {
    marginTop: 5,
    fontSize: 12,
    color: '#888',
  },
  questRepeatability: {
    marginTop: 5,
    fontSize: 12,
    color: '#888',
  },
});

export default QuestsList;