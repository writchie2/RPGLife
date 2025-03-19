// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchUserData } from '@/utils/firestoreUtils';
import { auth } from "../FirebaseConfig"
import { saveUserData, getUserData } from '../utils/storageUtils';
import { UserData, Skill, Quest  } from '@/utils/types';
import { doc, updateDoc, onSnapshot, collection, query, addDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';



interface UserContextType {
  userData: UserData | null;
  setAvatar: (index: number) => void;
  addSkill: (skillName: String, description: String, primaryTrait: String, secondaryTrait: String, experience: String) => void;
  addQuest: (questName: String, questDescription: String, dueDate: Date, difficulty: String, primarySkill: String, secondarySkill: String, repeatable: Boolean, completionReward: string) => void;
  archiveSkill: (id: string) => void;
  activateSkill: (id: string) => void;
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
      console.error("Error updating avatar:", error);
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
      console.error("Error updating avatar:", error);
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
      console.error("Error updating avatar:", error);
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
      console.error("Error updating avatar:", error);
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
      console.error("Error updating avatar:", error);
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
      console.error("Error updating avatar:", error);
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
      console.error("Error updating avatar:", error);
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

  return (
    <UserContext.Provider value={{userData, setAvatar, addSkill, addQuest, archiveSkill, activateSkill}}>
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
