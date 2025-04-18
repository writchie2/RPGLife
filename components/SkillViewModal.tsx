import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import calcEXP from "@/utils/calcEXP";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import

import { useEffect } from "react";

import { useUserData } from "@/contexts/UserContext";
import EditSkillModal from "./EditSkillModal";

interface SkillViewModalProps {
  visible: boolean;
  onModalHide?: () => void;
  onClose: () => void;
  id: string;
}

/*
TODO:
Implement archive skill button functionality
styling
*/
const SkillViewModal: React.FC<SkillViewModalProps> = ({
  visible,
  onClose,
  id,
}) => {

    const colors = useTheme(); // used for themes, replaces colors import
    const styles = StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: colors.bgPrimary,
          justifyContent: "flex-end",
          alignItems: "center",
        },
    
        // CONTAINERS ===============================
        scrollContainer: {
            paddingTop: 20,
            alignItems: "center",
            justifyContent: "flex-start",
        },
        modalContainer: {
            flex: 1,
            width: "90%",
            backgroundColor: colors.bgPrimary,
            borderRadius: 10,
            //padding: 20,
            justifyContent: "space-between",
        },
        scrollLine: {
            // marginHorizontal: 15,
            borderBottomWidth: 1,
            borderColor: colors.borderLight,
          },
        skillContainer: {
            width: "100%",
            marginHorizontal: 20,
            marginBottom: 10, // needed so if scrolling required doesnt cut off shadow
            borderRadius: 10,
            backgroundColor: colors.bgDropdown,
            // Shadow effect
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 3,
            
          },
        skillDetailsContainer: {
            flexGrow: 1,
            marginHorizontal: 10,
        },
        pageTitle: {
            width: "100%",
            alignItems: "center",
            paddingTop: 60,
            paddingBottom: 20,
        },
        titleContainer: {
            backgroundColor: colors.bgTertiary,
            //width: "100%",
            //justifyContent: "center",
            alignItems: "center",
            padding: 18,
            borderRadius:10,
            //marginBottom:"2%"
        },
        descriptionContainer: {
            marginVertical: 20,
            paddingVertical: 10,
            borderTopWidth: 0.5,
            borderColor: colors.borderLight,
            
        },
        fieldContainer: {
            marginBottom: "4%",
        },
        closeButtonContainer: {
            alignItems: "center",
            padding: 20,
        },
        skillButtonsContainer: {
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            marginTop: 20,
            borderTopWidth: 0.5,
            borderColor: colors.borderLight,
            marginHorizontal: 10,
            paddingVertical: 20,
          },
        
        //EXP--------------------------
        expRow: {
            flexDirection: 'row',  
            alignItems: 'center',  
            width:"100%",
            justifyContent: 'space-between',
            paddingTop: 20
        },
        expRowLeft: {
          justifyContent: "center",
          alignItems: "center",
          flex: 0.2,
          backgroundColor: colors.bgQuaternary,
          width: "90%",
          marginLeft: 10,
          aspectRatio: 1,
          borderRadius: 40,
          borderWidth: 3,
          borderColor: colors.borderInput,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
        expRowRight: {
          justifyContent: "center",
          flex: 1,
          flexDirection: "row",
        },
        expBarContainer: {
          alignItems: "flex-end",
          width: "90%",
        },
        levelText: {
          fontFamily: "Alegreya_500Medium",
          fontSize: 50,
          color: colors.textDark,
          lineHeight: 60,
        },
        expBar: {
          marginTop: 5,
          height: 12,
          backgroundColor: colors.bgPrimary,
          borderWidth: 1,
          borderColor: colors.borderInput,
          borderRadius: 99,
          justifyContent: "center",
          overflow: "hidden",
          width: "100%",
        },
        expTrait: {
          fontFamily: "Alegreya_500Medium",
          marginTop: 2,
          fontSize: 14,
          color: colors.textLight,
        },
        //BUTTONS--------------------------
        
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
        closeButton: {
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
        archiveButton: {
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
            paddingVertical: "3%",
            paddingHorizontal: 20,
        },
        deleteButton: {
            width: 53,
            height: 53,
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
        // TEXT & ICONS =============================
        icons: {
            fontFamily: "MaterialIconsRound_400Regular",
            fontSize: 30,
            color: colors.text,
          },
        buttonText: {
            fontFamily: "Metamorphous_400Regular",
            color: colors.textDark, 
            fontSize: 20,
        },
        contentText: {
            fontFamily: "Alegreya_400Regular",
            // fontSize: 24,
            },
        pageTitleText: {
            fontFamily: "Metamorphous_400Regular",
            fontSize: 30,
            color: colors.text,
        },
            
        titleText: {
            fontFamily: "Metamorphous_400Regular",
            fontSize: 36,
            color: colors.text,
        },
        
        descriptionText: {
            fontFamily: "Alegreya_400Regular",
            fontSize: 24,
            color: colors.text,
        },
        
        fieldText: {
            fontFamily: "Alegreya_500Medium",
            fontSize: 22,
            color: colors.text,
        },
      });
    
    const { userData, archiveSkill, activateSkill, deleteSkill } = useUserData();
    
    const skill = userData?.skills?.find(skill => skill.id === id);
    const [skillEditVisible, setSkillEditVisible] = useState(false);
    const [skillID, setSkillID] = useState("");
    

    const archiveHandler = () => {
        Alert.alert(
              "Confirm Archive",
              "This will set your skill as inactive. You can reactivate it at any time.\nYou will keep gained trait exp, but it will deteriorate over time!",
              [
                  {
                      text: "Confirm",
                      onPress: () => {
                        if (userData && skill){
                            const matchingQuests = userData.quests?.filter(
                                (quest) => (quest.primarySkill === skill.name && quest.active)|| (quest.secondarySkill === skill.name && quest.active)
                            );
                            if (matchingQuests && matchingQuests?.length > 0) {
                                let activeQuests = [];
                                activeQuests.push("There are quests active with this skill:\n\n");
                                matchingQuests.map((quest, index) => (
                                    activeQuests.push(`${index + 1}: ${quest.name}\n`)
                                ));
                                activeQuests.push("\nPlease complete these quests or delete them.");
                                const questMessage = activeQuests.join("");
                                Alert.alert("Error!", questMessage);
                            } else {
                                archiveSkill(skill.id);
                                onClose();   
                            }
                        }       
                      },
                  },
                  {
                      text: "Cancel",
                      onPress: () => {
                      },
                  },
              ]);
    };

    const deleteHandler = () => {
        Alert.alert(
              "Confirm Delete",
              "This will delete your skill and any trait experience gained for it!",
              [
                  {
                      text: "Confirm",
                      onPress: () => {
                        if (userData && skill){
                            const matchingQuests = userData.quests?.filter(
                                (quest) => (quest.primarySkill === skill.name && quest.active)|| (quest.secondarySkill === skill.name && quest.active)
                            );
                            if (matchingQuests && matchingQuests?.length > 0) {
                                let activeQuests = [];
                                activeQuests.push("There are quests active with this skill:\n\n");
                                matchingQuests.map((quest, index) => (
                                    activeQuests.push(`${index + 1}: ${quest.name}\n`)
                                ));
                                activeQuests.push("\nPlease complete these quests or delete them.");
                                const questMessage = activeQuests.join("");
                                Alert.alert("Error!", questMessage);
                            } else {
                                deleteSkill(skill.id);
                                onClose();   
                            }
                        }       
                      },
                  },
                  {
                      text: "Cancel",
                      onPress: () => {
                      },
                  },
              ]);
        
};
    const activateHandler = () => {
        if (userData && skill){
            activateSkill(skill.id);
            onClose();
        }
    };

    return (
        <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        >
            {/* TouchableWithoutFeedback to detect taps outside the modal. Also somewhat simulates slide to cancel for iOS. */}    
            
                <View style={styles.overlay} >
                    <TouchableWithoutFeedback onPress={onClose}>
                        <View style={styles.pageTitle}>
                            <Text style={styles.pageTitleText}>- Skill Details -</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    
                        <View style={styles.modalContainer}>
                            <View style={styles.scrollLine}></View>
                            {/* ScrollView makes the form scrollable if it does not fit fully on a small screen */} 
                                <ScrollView 
                                    contentContainerStyle={styles.scrollContainer} 
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                >
                                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                        <View style={styles.skillContainer}>
                                            {/* Title */}
                                            <View style={styles.titleContainer}>
                                                <Text style={styles.titleText}>{skill?.name}</Text>
                                            </View>
                                            <View style={styles.expRow}>
                                                <View style={styles.expRowLeft}>
                                                    <Text style={styles.levelText}>
                                                    {calcEXP(skill?.exp || 0).level}
                                                    </Text>
                                                </View>
                                                <View style={styles.expRowRight}>
                                                    <View style={styles.expBarContainer}>
                                                        <View style={styles.expBar}>
                                                            <View
                                                            style={{
                                                                height: "100%",
                                                                width: `${
                                                                (calcEXP(skill?.exp || 0).progressEXP / calcEXP(skill?.exp || 1).neededEXP) *
                                                                100
                                                                }%`,
                                                                backgroundColor: colors.text,
                                                                borderRadius: 99,
                                                            }}
                                                            ></View>
                                                        </View>
                                                        <Text style={styles.expTrait}>
                                                            {calcEXP(skill?.exp || 0).progressEXP}/{calcEXP(skill?.exp || 1).neededEXP} exp 
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.skillDetailsContainer}>
                                                <View style={styles.descriptionContainer}>
                                                    <Text style={styles.descriptionText}>{skill?.description === ""? "Skill Details" : skill?.description}</Text>
                                                </View>
                                                <View style={styles.fieldContainer}>
                                                    <Text style={styles.fieldText}>Traits:{" "}
                                                        <Text style={styles.contentText}>
                                                            {skill?.primaryTrait}
                                                            {skill?.secondaryTrait && `, ${skill?.secondaryTrait}`}
                                                        </Text>
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.skillButtonsContainer}>
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => deleteHandler()}
                                                >
                                                    <Text style={styles.icons}>delete</Text>
                                                </TouchableOpacity>


                                                {skill?.active ? (
                                                    <TouchableOpacity style={styles.archiveButton} onPress={() => archiveHandler()}>
                                                        <Text style={styles.buttonText}>Archive Skill</Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity style={styles.archiveButton} onPress={() => activateHandler()}>
                                                        <Text style={styles.buttonText}>Activate Skill</Text>
                                                    </TouchableOpacity>
                                                )}

                                                <TouchableOpacity
                                                    style={styles.editButton}
                                                    onPress={() => {
                                                        if (skill){
                                                            setSkillID(skill.id);
                                                            setSkillEditVisible(true);
                                                        }
                                                    }}
                                                >
                                                    <Text style={styles.icons}>edit</Text>
                                                </TouchableOpacity>
                                                <EditSkillModal 
                                                visible={skillEditVisible} 
                                                id={skillID} 
                                                onClose={() => {
                                                    setSkillEditVisible(false); 
                                                    setSkillID("");
                                                    }}
                                                ></EditSkillModal>

                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>    
                                </ScrollView>
                            {/* Close Button */}
                            
                                <View style={styles.closeButtonContainer}>
                                    <TouchableOpacity 
                                        style={ styles.closeButton} 
                                        onPress={() =>{
                                            onClose();
                                        }}
                                    >
                                        <Text style={styles.icons}>close</Text>
                                    </TouchableOpacity>
                                    
                                </View>
                        </View>
                </View>
        </Modal>
    );
};

  

  const { userData, archiveSkill, activateSkill, deleteSkill } = useUserData();

  const skill = userData?.skills?.find((skill) => skill.id === id);
  const [skillEditVisible, setSkillEditVisible] = useState(false);
  const [skillID, setSkillID] = useState("");

  const archiveHandler = () => {
    Alert.alert(
      "Confirm Archive",
      "This will set your skill as inactive. You can reactivate it at any time.\nYou will keep gained trait exp, but it will deteriorate over time!",
      [
        {
          text: "Confirm",
          onPress: () => {
            if (userData && skill) {
              const matchingQuests = userData.quests?.filter(
                (quest) =>
                  (quest.primarySkill === skill.name && quest.active) ||
                  (quest.secondarySkill === skill.name && quest.active)
              );
              if (matchingQuests && matchingQuests?.length > 0) {
                let activeQuests = [];
                activeQuests.push(
                  "There are quests active with this skill:\n\n"
                );
                matchingQuests.map((quest, index) =>
                  activeQuests.push(`${index + 1}: ${quest.name}\n`)
                );
                activeQuests.push(
                  "\nPlease complete these quests or delete them."
                );
                const questMessage = activeQuests.join("");
                Alert.alert("Error!", questMessage);
              } else {
                archiveSkill(skill.id);
                onClose();
              }
            }
          },
        },
        {
          text: "Cancel",
          onPress: () => {},
        },
      ]
    );
  };

  const deleteHandler = () => {
    Alert.alert(
      "Confirm Delete",
      "This will delete your skill and any trait experience gained for it!",
      [
        {
          text: "Confirm",
          onPress: () => {
            if (userData && skill) {
              const matchingQuests = userData.quests?.filter(
                (quest) =>
                  (quest.primarySkill === skill.name && quest.active) ||
                  (quest.secondarySkill === skill.name && quest.active)
              );
              if (matchingQuests && matchingQuests?.length > 0) {
                let activeQuests = [];
                activeQuests.push(
                  "There are quests active with this skill:\n\n"
                );
                matchingQuests.map((quest, index) =>
                  activeQuests.push(`${index + 1}: ${quest.name}\n`)
                );
                activeQuests.push(
                  "\nPlease complete these quests or delete them."
                );
                const questMessage = activeQuests.join("");
                Alert.alert("Error!", questMessage);
              } else {
                deleteSkill(skill.id);
                onClose();
              }
            }
          },
        },
        {
          text: "Cancel",
          onPress: () => {},
        },
      ]
    );
  };
  const activateHandler = () => {
    if (userData && skill) {
      activateSkill(skill.id);
      onClose();
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* TouchableWithoutFeedback to detect taps outside the modal. Also somewhat simulates slide to cancel for iOS. */}

      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.pageTitle}>
            <Text style={styles.pageTitleText}>- Skill Details -</Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <View style={styles.scrollLine}></View>
          {/* ScrollView makes the form scrollable if it does not fit fully on a small screen */}
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.skillContainer}>
                {/* Title */}
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>{skill?.name}</Text>
                </View>
                <View style={styles.expRow}>
                  <View style={styles.expRowLeft}>
                    <Text style={styles.levelText}>
                      {calcEXP(skill?.exp || 0).level}
                    </Text>
                  </View>
                  <View style={styles.expRowRight}>
                    <View style={styles.expBarContainer}>
                      <View style={styles.expBar}>
                        <View
                          style={{
                            height: "100%",
                            width: `${
                              (calcEXP(skill?.exp || 0).progressEXP /
                                calcEXP(skill?.exp || 1).neededEXP) *
                              100
                            }%`,
                            backgroundColor: colors.text,
                            borderRadius: 99,
                          }}
                        ></View>
                      </View>
                      <Text style={styles.expTrait}>
                        {calcEXP(skill?.exp || 0).progressEXP}/
                        {calcEXP(skill?.exp || 1).neededEXP} exp
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.skillDetailsContainer}>
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>
                      {skill?.description === ""
                        ? "Skill Details"
                        : skill?.description}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldText}>
                      Traits:{" "}
                      <Text style={styles.contentText}>
                        {skill?.primaryTrait}
                        {skill?.secondaryTrait && `, ${skill?.secondaryTrait}`}
                      </Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.skillButtonsContainer}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteHandler()}
                  >
                    <Text style={styles.icons}>delete</Text>
                  </TouchableOpacity>

                  {skill?.active ? (
                    <TouchableOpacity
                      style={styles.archiveButton}
                      onPress={() => archiveHandler()}
                    >
                      <Text style={styles.buttonText}>Archive Skill</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.archiveButton}
                      onPress={() => activateHandler()}
                    >
                      <Text style={styles.buttonText}>Activate Skill</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      if (skill) {
                        setSkillID(skill.id);
                        setSkillEditVisible(true);
                      }
                    }}
                  >
                    <Text style={styles.icons}>edit</Text>
                  </TouchableOpacity>
                  <EditSkillModal
                    visible={skillEditVisible}
                    id={skillID}
                    onClose={() => {
                      setSkillEditVisible(false);
                      setSkillID("");
                    }}
                  ></EditSkillModal>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
          {/* Close Button */}

          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                onClose();
              }}
            >
              <Text style={styles.icons}>close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SkillViewModal;
