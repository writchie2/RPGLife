// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchUserData } from '@/utils/firestoreUtils';
import { auth } from "../FirebaseConfig"
import { saveUserData, getUserData } from '../utils/storageUtils';
import { UserData, Skill, Quest  } from '@/utils/types';
import { doc, updateDoc, onSnapshot, collection, query, addDoc, deleteDoc, getDocs, where } from 'firebase/firestore';
import { db } from '../FirebaseConfig';



interface UserContextType {
  userData: UserData | null;
  setAvatar: (index: number) => void;
  addSkill: (skillName: String, description: String, primaryTrait: String, secondaryTrait: String, experience: String) => void;
  addQuest: (questName: String, questDescription: String, dueDate: Date, difficulty: String, primarySkill: String, secondarySkill: String, repeatable: Boolean, completionReward: string) => void;
  archiveSkill: (id: string) => void;
  activateSkill: (id: string) => void;
  deleteQuest: (id: string) => void;
  completeQuest: (id: string) => void;
  resetAccount: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;  // ReactNode can represent any valid React child, including strings, numbers, JSX, etc.
  }

// Create a provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Function updates the user's document to change the index of their avatar icon
  // Input: index (for avatar array in UserHeader)
  const setAvatar = async (index: number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          avatarIndex: index, 
        })
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  // Function adds an amount to the user's strengthEXP. 
  // This amount is also added to the user's overall exp
  // Input: increaseAmount (number added to strengthEXP)
  const addStrengthEXP = async (increaseAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          strengthEXP: (userData.strengthEXP + increaseAmount)
        })
      }
    } catch (error) {
      console.error("Error adding strength exp:", error);
    }
  }

  // Function adds an amount to the user's vitalityEXP. 
  // This amount is also added to the user's overall exp
  // Input: increaseAmount (number added to vitalityEXP)
  const addVitalityEXP = async (increaseAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          vitalityEXP: (userData.vitalityEXP + increaseAmount)
        })
      }
    } catch (error) {
      console.error("Error adding vitality exp avatar:", error);
    }
  }

  // Function adds an amount to the user's agilityEXP. 
  // This amount is also added to the user's overall exp
  // Input: increaseAmount (number added to agilityEXP)
  const addAgilityEXP = async (increaseAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          agilityEXP: (userData.agilityEXP + increaseAmount)
        })
      }
    } catch (error) {
      console.error("Error adding agility exp:", error);
    }
  }

  // Function adds an amount to the user's staminaEXP. 
  // This amount is also added to the user's overall exp
  // Input: increaseAmount (number added to staminaEXP)
  const addStaminaEXP = async (increaseAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          staminaEXP: (userData.staminaEXP + increaseAmount)
        })
      }
    } catch (error) {
      console.error("Error adding stamina exp:", error);
    }
  }

  // Function adds an amount to the user's intelligenceEXP. 
  // This amount is also added to the user's overall exp
  // Input: increaseAmount (number added to intelligenceEXP)
  const addIntelligenceEXP = async (increaseAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          intelligenceEXP: (userData.intelligenceEXP + increaseAmount)
        })
      }
    } catch (error) {
      console.error("Error adding intelligence exp:", error);
    }
  }

  // Function adds an amount to the user's charismaEXP. 
  // This amount is also added to the user's overall exp
  // Input: increaseAmount (number added to charismaEXP)
  const addCharismaEXP = async (increaseAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          charismaEXP: (userData.charismaEXP + increaseAmount),
        })
      }
    } catch (error) {
      console.error("Error adding charisma exp:", error);
    }
  }

  const addOverallEXP = async (increaseAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          exp: (userData.exp + increaseAmount) 
        })
      }
    } catch (error) {
      console.error("Error adding overall skill:", error);
    }
  }

  const addSkillEXP = async (increaseAmount : number, skillName: string) => {
    if (!userData || !auth.currentUser) return;
    try {
        const skillsRef = collection(db, "users", auth.currentUser.uid, "skills");
        const q = query(skillsRef, where("name", "==", skillName));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const skillDoc = querySnapshot.docs[0].ref;
          
          const skill = userData.skills?.find(skill => skill.name === skillName);
          if(!skill){
            console.log("Tried adding exp to a skill that doesn't exist");
            return
          }
          await updateDoc(skillDoc, {
            exp: (skill.exp + increaseAmount) 
          })
          // If there is no secondary trait, the primary trait gets the entirety of the exp. 
          if (skill.secondaryTrait === "") {
            switch (skill.primaryTrait) {
            case "Strength":
              addStrengthEXP(increaseAmount);
              break;
            case "Vitality":
              addVitalityEXP(increaseAmount);
              break;
            case "Agility":
              addAgilityEXP(increaseAmount);
              break;
            case "Stamina":
              addStaminaEXP(increaseAmount);
              break;
            case "Intelligence":
              addIntelligenceEXP(increaseAmount);
              break;
            case "Charisma":
              addCharismaEXP(increaseAmount);
              break;
            }
          }
          // If there is a secondary trait, the primary trait gets 60% of the exp and secondary trait gets 40%
          else {
            switch (skill.primaryTrait) {
              case "Strength":
                addStrengthEXP((increaseAmount * 0.6));
                break;
              case "Vitality":
                addVitalityEXP((increaseAmount * 0.6));
                break;
              case "Agility":
                addAgilityEXP((increaseAmount * 0.6));
                break;
              case "Stamina":
                addStaminaEXP((increaseAmount * 0.6));
                break;
              case "Intelligence":
                addIntelligenceEXP((increaseAmount * 0.6));
                break;
              case "Charisma":
                addCharismaEXP((increaseAmount * 0.6));
                break;
              }
              switch (skill.secondaryTrait) {
                case "Strength":
                  addStrengthEXP((increaseAmount * 0.4));
                  break;
                case "Vitality":
                  addVitalityEXP((increaseAmount * 0.4));
                  break;
                case "Agility":
                  addAgilityEXP((increaseAmount * 0.4));
                  break;
                case "Stamina":
                  addStaminaEXP((increaseAmount * 0.4));
                  break;
                case "Intelligence":
                  addIntelligenceEXP((increaseAmount * 0.4));
                  break;
                case "Charisma":
                  addCharismaEXP((increaseAmount * 0.4));
                  break;
                }
            }
        }
        else {
          console.log(`No skill found with name: ${skillName}`);
        }
    } catch (error) {
      console.error("Error adding skill exp:", error);
    }
  }

  // Function that creates a new document in the "skills" collection of Firebase representing a new skill
  // Validation of inputs is handled in the function that calls it in the CreateSkillModal 
  // skillName, primaryTrait, and experiecne are required. The others are optional and may be blank strings 
  const addSkill = async (skillName: String, description: String, primaryTrait: String, secondaryTrait: String, experience: String) => {
    if (!auth.currentUser) {
      return;
    }

    // Right now "novice" = 0 exp, "adept" = 1000 exp, "master" = 2200 exp
    // This can all change when we re-balance how exp works
    let calcEXP = 0; 
    if (experience === "adept"){ calcEXP = 1000;}
    if (experience === "master"){ calcEXP = 2200;}
  
    try {
      const skillsCollectionRef = collection(db, "users", auth.currentUser.uid, "skills");
      
      // New skill created as record with required fields
      const newSkill: Record<string, any> = {
        name: skillName,
        primaryTrait: primaryTrait,
        exp: calcEXP,
        active: true,
      };
      
      // If secondary trait or description are not blank, add them as a field. 
      if (secondaryTrait !== "") {
        newSkill.secondaryTrait = secondaryTrait;
      }
      if (description !== "") {
        newSkill.description = description;
      }
      
      // Add the record to FireBase as a new document in the "skills" collection
      const docRef = await addDoc(skillsCollectionRef, newSkill);
      console.log("Skill added with ID:", docRef.id);

      // Handles the experience gain when a new skill is created. 
      // The user can select their expereince level when creating a skill, and that exp
      // will be added to their overall exp and the respective traits

      // If there is no secondary trait, the primary trait gets the entirety of the exp. 
      if (secondaryTrait === "") {
        switch (primaryTrait) {
        case "Strength":
          addStrengthEXP(calcEXP);
          break;
        case "Vitality":
          addVitalityEXP(calcEXP);
          break;
        case "Agility":
          addAgilityEXP(calcEXP);
          break;
        case "Stamina":
          addStaminaEXP(calcEXP);
          break;
        case "Intelligence":
          addIntelligenceEXP(calcEXP);
          break;
        case "Charisma":
          addCharismaEXP(calcEXP);
          break;
        }
      }
      // If there is a secondary trait, the primary trait gets 60% of the exp and secondary trait gets 40%
      else {
        switch (primaryTrait) {
          case "Strength":
            addStrengthEXP((calcEXP * 0.6));
            break;
          case "Vitality":
            addVitalityEXP((calcEXP * 0.6));
            break;
          case "Agility":
            addAgilityEXP((calcEXP * 0.6));
            break;
          case "Stamina":
            addStaminaEXP((calcEXP * 0.6));
            break;
          case "Intelligence":
            addIntelligenceEXP((calcEXP * 0.6));
            break;
          case "Charisma":
            addCharismaEXP((calcEXP * 0.6));
            break;
          }
          switch (secondaryTrait) {
            case "Strength":
              addStrengthEXP((calcEXP * 0.4));
              break;
            case "Vitality":
              addVitalityEXP((calcEXP * 0.4));
              break;
            case "Agility":
              addAgilityEXP((calcEXP * 0.4));
              break;
            case "Stamina":
              addStaminaEXP((calcEXP * 0.4));
              break;
            case "Intelligence":
              addIntelligenceEXP((calcEXP * 0.4));
              break;
            case "Charisma":
              addCharismaEXP((calcEXP * 0.4));
              break;
            }
        }
      addOverallEXP(calcEXP);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  }

  const archiveSkill = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      if (auth.currentUser) {
        const skillDoc = doc(db, "users", auth.currentUser.uid, "skills", id)
        await updateDoc(skillDoc, {
          active: false
      })
      }
    } catch (error) {
      console.error("Error archiving skill:", error);
    }
  };
  
  const activateSkill = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      if (auth.currentUser) {
        const skillDoc = doc(db, "users", auth.currentUser.uid, "skills", id)
        await updateDoc(skillDoc, {
          active: true
      })
      }
    } catch (error) {
      console.error("Error activating skill:", error);
    }
  };
  

  const addQuest = async (questName: String, questDescription: String, dueDate: Date, difficulty: String, primarySkill: String, secondarySkill: String, repeatable: Boolean, completionReward: String) => {
    if (!auth.currentUser) {
      return;
    }
    try {
      const questsCollectionRef = collection(db, "users", auth.currentUser.uid, "quests");
      
      const newQuest: Record<string, any> = {
        name: questName,
        description: questDescription,
        dueDate: dueDate,
        difficulty: difficulty,
        primarySkill: primarySkill,
        reward: completionReward,
        active: true,
        repeatable: repeatable
      };
  
      if (secondarySkill !== "") {
        newQuest.secondarySkill = secondarySkill;
      }
      if (questDescription !== "") {
        newQuest.description = questDescription;
      }
      
  
      const docRef = await addDoc(questsCollectionRef, newQuest);
      console.log("Quest added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  }

  const deleteQuest = async(id: string) => {
    if (!auth.currentUser) return;
    try {
        const docRef = doc(db, "users", auth.currentUser.uid, "quests", id)
        await deleteDoc(docRef);
    } catch (error) {
      console.error("Error activating skill:", error);
    }
  };

  const completeQuest = async(id: string) => {
    if (!auth.currentUser || !userData) return;
    try {
        const docRef = doc(db, "users", auth.currentUser.uid, "quests", id)
        const quest = userData.quests?.find(quest => quest.id === id);
        if (!quest)
        {
            console.log("Tried to complete a quest that doesn't exist!");
            return;
        }

        let expGain = 150;
        if (quest.difficulty === "Normal") {
          expGain = 300;
        }
        if (quest.difficulty === "Hard") {
          expGain = 450;
        }

        if (!quest.secondarySkill) {
          addSkillEXP(expGain, quest.primarySkill);
        }
        else {
          addSkillEXP((expGain *0.6), quest.primarySkill);
          addSkillEXP((expGain *0.4), quest.secondarySkill);
        }
        addOverallEXP(expGain);
        await updateDoc(docRef, {
          active: false
      })
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };

  useEffect(() => {

    if (!auth.currentUser) return;

    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const questsCollectionRef = collection(db, 'users', auth.currentUser.uid, 'quests');
    const skillsCollectionRef = collection(db, 'users', auth.currentUser.uid, 'skills');

    // Subscribes to user document to detect changes made and update the local data when detected
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
    
        setUserData((prev) => {
          const updatedData: UserData = {
            username: data.username,
            birthday: data.birthdate?.toDate?.(),
            email: data.email,
            strengthEXP: data.strengthEXP,
            vitalityEXP: data.vitalityEXP,
            agilityEXP: data.agilityEXP,
            staminaEXP: data.staminaEXP,
            intelligenceEXP: data.intelligenceEXP,
            charismaEXP: data.charismaEXP,
            exp: data.exp,
            avatarIndex: data.avatarIndex,
            quests: prev?.quests || [], 
            skills: prev?.skills || [], 
          };
          saveUserData(updatedData);
          return updatedData;
        });
      } else {
        console.error("User document does not exist.");
      }
    });

    // Subscribes to quests collection to detect changes made and update the local data when detected
    const unsubscribeQuests = onSnapshot(questsCollectionRef, (querySnapshot) => {
      const updatedQuests = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate?.() || null, // Convert Firestore Timestamp to Date
      } as Quest;
    });
    
      setUserData((prev) => {
        if (!prev) return null;
        const updatedData: UserData = { ...prev, quests: updatedQuests };
        saveUserData(updatedData); // Save to AsyncStorage
        return updatedData;
      });
    });

    // Subscribes to skills collection to detect changes made and update the local data when detected
    const unsubscribeSkills = onSnapshot(skillsCollectionRef, (querySnapshot) => {
      const updatedSkills = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setUserData((prev) => {
        if (!prev) return null;
        const updatedData: UserData = { ...prev, skills: updatedSkills as Skill[] };
        // Save to AsyncStorage
        saveUserData(updatedData);
        return updatedData; 
      });
    });

    
    return () => {
      unsubscribeUser();
      unsubscribeQuests();
      unsubscribeSkills();
    }

  }, []);

  const resetAccount = async () => {
    if (!auth.currentUser || !userData) return;
    try {
      const userUID = auth.currentUser.uid;
      const userDoc = doc(db, "users", userUID)
      await updateDoc(userDoc, {
        exp: 0,
        strengthEXP: 0,
        vitalityEXP: 0,
        agilityEXP: 0,
        staminaEXP: 0,
        intelligenceEXP: 0,
        charismaEXP: 0,
      })
      
      const skillsCollectionRef = collection(db, "users", userUID, "skills");
      const skillsQuerySnapshot = await getDocs(skillsCollectionRef);
      
      const skillDeletePromises = skillsQuerySnapshot.docs.map((skillDoc) =>
        deleteDoc(doc(db, "users", userUID, "skills", skillDoc.id))
      );

    
      await Promise.all(skillDeletePromises);
      
      const questsCollectionRef = collection(db, "users", userUID, "quests");
      const questQuerySnapshot = await getDocs(questsCollectionRef);

      const questDeletePromises = questQuerySnapshot.docs.map((questDoc) =>
        deleteDoc(doc(db, "users", userUID, "quests", questDoc.id))
      );

    
      await Promise.all(questDeletePromises);
    } catch(error){
      console.error("Error resetting account:", error);
    }

  }

  return (
    <UserContext.Provider value={{userData, setAvatar, addSkill, addQuest, archiveSkill, activateSkill, deleteQuest, completeQuest, resetAccount}}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to access the user data
export const useUserData = () => {
    const context = useContext(UserContext);
    //console.log("Checking UserContext:", context);
    
    if (context === undefined) {
      //console.error("useUserData was called outside of UserProvider!");
      throw new Error("useUserData must be used within a UserProvider");
    }
    return context;
};
