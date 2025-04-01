import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Checkpoint } from "../utils/types";
import colors from "@/constants/colors";
import CreateCheckpointModal from "./CreateCheckpointModal";
import EditCheckpointModal from "./EditCheckpointModal";
import { useUserData } from "@/contexts/UserContext";

interface CheckPointsListProps {
  checkpoints: Checkpoint[];
  questID: string;
}

//Component that returns a Flat List with checkpoints from a given checkpoint array
const CheckPointsList: React.FC<CheckPointsListProps> = ({
  checkpoints, // Array of checkpoints from UserData interface
  questID // The ID for the quest the checkpoints belong to
}) => {
  
  const [createCheckpointModalVisible, setCreateCheckpointModalVisible] = useState(false);
  const [editCheckpointModalVisible, setEditCheckpointModalVisible] = useState(false);
  const [checkpointID, setCheckpointID] = useState("");

  const { userData, completeCheckpoint, deleteCheckpoint } = useUserData();
  const quest = userData?.quests?.find(quest => quest.id === questID);

  
  // Handles rendering of each checkpoint
  // If the checkpoint is inactive, then styling will be overrided to be greyed out
  // Handlers for button presses also defined here
  const renderItem = ({ item }: { item: Checkpoint }) => {
  
      const completeHandler = async() => {
        alert("You completed " + item.name);
        completeCheckpoint(quest?.id || "", item.id)
      }

    const deleteHandler = async() => {
      Alert.alert("Confirm Delete:", item.name, [
        {
          text: "Confirm",
          onPress: () => {  
            deleteCheckpoint(quest?.id || "", item.id)
          },
        },
        {
          text: "Cancel",
          onPress: () => {},
        },
      ]);
      
    }
    // If the item (checkpoint) and quest are both active, then the checkpoint will be rendered as interactable
    // Clicking on the checkpoint item itself will bring up an edit screen if checkpoint is active.
    // If either are inactive, the checkpoint will not be interactable 
    if(item.active && quest?.active){
      return (
      <TouchableOpacity
        style={styles.checkpointItem}
        onPress={() => {
          setCheckpointID(item.id);
          setEditCheckpointModalVisible(true);
        }}
      >
        <View style={styles.checkpointRow}>
          
          {/* Name and Description */}
          <View style={styles.checkpointContent}>
            <Text style={styles.checkpointName}>{item.name}</Text>
            <View style={styles.checkpointDetailsContainer}>
              <Text style={styles.checkpointDescription}>
                {item.description ? item.description : "Checkpoint Details"}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            
            {/* Complete */}
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => {
                completeHandler();
              }}
            >
              <Text style={styles.icons}>check</Text>
            </TouchableOpacity>
            
            {/* Delete */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                deleteHandler();
              }}
            >
              <Text style={styles.icons}>delete</Text>
            </TouchableOpacity>

          </View>
        </View>
      </TouchableOpacity>
    );}
    // Checkpoint is inactive, buttons stop working and color is changed
    else{
      return (
        <TouchableOpacity
          style={styles.checkpointItemFinished}
          onPress={() => {
            // Do nothing, checkpoint inactive
          }}
        >
          <View style={styles.checkpointRow}>

            {/* Name and Description */}
            <View style={styles.checkpointContent}>
              <Text style={styles.checkpointName}>{item.name}</Text>
              <View style={styles.checkpointDetailsContainer}>
                <Text style={styles.checkpointDescription}>
                  {item.description ? item.description : "Checkpoint Details"}
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              
              {/* Complete */}
              <TouchableOpacity
              style={[styles.completeButton, { backgroundColor: "#e0e0e0" }]}
              onPress={() => {
                //Do nothing, checkpoint inactive
              }}
              >
                <Text style={styles.icons}>check</Text>
              </TouchableOpacity>
            
            {/* Two different options for delete button when inactive:
                Quest active - Checkpoint can still be deleted
                Quest inactive - Checkpoint cannot be deleted, must delete the whole quest */}
            
            {/* Delete, active quest */}
            {quest?.active &&<TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                deleteHandler();
              }}
            >
              <Text style={styles.icons}>delete</Text>
            </TouchableOpacity>}
            
            {/* Delete, inactive quest */}
            {!quest?.active &&<TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: "#e0e0e0" }]}
              onPress={() => {
                // Do nothing
              }}
            >
              <Text style={styles.icons}>delete</Text>
            </TouchableOpacity>}
          </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  // Sorts the checkpoints by date created so they are in order
  const sortedCheckpoints = [...checkpoints].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );


  return (
    <View style={styles.list}>
      
      
      <CreateCheckpointModal
          visible={createCheckpointModalVisible}
          questID={questID}
          onClose={() => setCreateCheckpointModalVisible(false)}
      >
      </CreateCheckpointModal>

      <EditCheckpointModal
        visible={editCheckpointModalVisible}
        questID={questID}
        checkpointID = {checkpointID}
        onClose={() => {
          setEditCheckpointModalVisible(false);
          setCheckpointID("");
        }}
      ></EditCheckpointModal>

      {/* Add button renders before checkpoint list, only appears when quest is active */}
      <View style={styles.addButtonContainer}>
        {quest?.active &&
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setCreateCheckpointModalVisible(true);
          }}
        >
          <Text style={styles.icons}>add</Text>
        </TouchableOpacity>}
      </View>
      
      {/* If there are no checkpoints, show text */}
      {sortedCheckpoints.length == 0 &&
       <View style={styles.checkpointItem}>
            <Text style={styles.checkpointName}>No Checkpoints available</Text>
        </View>
      }

      {/* Render list if checkpoints */}
      {sortedCheckpoints.length != 0 &&
      <FlatList
        data={sortedCheckpoints}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    position: "relative",
    top: -60,
    marginBottom: -60,
    zIndex: 0,
    borderRadius: 8,
    width: "100%",
    paddingTop: 50,
    backgroundColor: colors.bgDropdown,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
   
  addButtonContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 12,
  },
  checkpointContent: {
    flex: .7
  },
  buttonRow: {
    flex: .3,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
   
  checkpointRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    
  },
  checkpointDetailsContainer: {
  },
  checkpointItem: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 10,
    backgroundColor: "transparent",
    borderBottomWidth: 0.5,
    borderColor: colors.borderLight,
  },
  checkpointItemFinished: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
    borderBottomWidth: 0.5,
    borderColor: colors.borderLight,
    opacity: 0.5
  },
  checkpointName: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 20,
    color: colors.text,
  },
  checkpointDescription: {
    fontFamily: "Alegreya_500Medium",
    marginTop: 4,
    fontSize: 16,
    color: colors.textLight,
  },
  editButton: {
    width: 53,
    height: 53,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgSecondary,
    borderRadius: 100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  completeButton: {
    margin:5,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgSecondary,
    borderRadius: 100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteButton: {
    margin:5,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cancel,
    borderRadius: 100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  icons: {
    // fontFamily: "MaterialIcons_400Regular",
    fontFamily: "MaterialIconsRound_400Regular",
    fontSize: 28,
    color: colors.text,
  },
});

export default CheckPointsList;
