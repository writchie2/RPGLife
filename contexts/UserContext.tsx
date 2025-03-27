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
      console.error("Error altering avatar:", error);
    }
  };

  // Function alters an amount to the user's strengthEXP.
  // Input: alterAmount (number added to strengthEXP)
  const alterStrengthEXP = async (alterAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          strengthEXP: (userData.strengthEXP + alterAmount)
        })
      }
    } catch (error) {
      console.error("Error altering strength exp:", error);
    }
  }

  // Function alters an amount to the user's vitalityEXP. 
  // Input: alterAmount (number added to vitalityEXP)
  const alterVitalityEXP = async (alterAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          vitalityEXP: (userData.vitalityEXP + alterAmount)
        })
      }
    } catch (error) {
      console.error("Error altering vitality exp avatar:", error);
    }
  }

  // Function alters an amount to the user's agilityEXP. 
  // Input: alterAmount (number added to agilityEXP)
  const alterAgilityEXP = async (alterAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          agilityEXP: (userData.agilityEXP + alterAmount)
        })
      }
    } catch (error) {
      console.error("Error altering agility exp:", error);
    }
  }

  // Function alters an amount to the user's staminaEXP. 
  // Input: alterAmount (number added to staminaEXP)
  const alterStaminaEXP = async (alterAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          staminaEXP: (userData.staminaEXP + alterAmount)
        })
      }
    } catch (error) {
      console.error("Error altering stamina exp:", error);
    }
  }

  // Function alters an amount to the user's intelligenceEXP. 
  // Input: altereAmount (number added to intelligenceEXP)
  const alterIntelligenceEXP = async (alterAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          intelligenceEXP: (userData.intelligenceEXP + alterAmount)
        })
      }
    } catch (error) {
      console.error("Error altering intelligence exp:", error);
    }
  }

  // Function alters an amount to the user's charismaEXP. 
  // Input: alterAmount (number added to charismaEXP)
  const alterCharismaEXP = async (alterAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          charismaEXP: (userData.charismaEXP + alterAmount),
        })
      }
    } catch (error) {
      console.error("Error altering charisma exp:", error);
    }
  }
  
  // Function alters an amount to the user's overallEXP. 
  // Input: alterAmount (number added to charismaEXP)
  const alterOverallEXP = async (alterAmount : number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userDoc, {
          exp: (userData.exp + alterAmount) 
        })
      }
    } catch (error) {
      console.error("Error altering overall skill:", error);
    }
  }
  
  // Function that alters the exp of a skill
  // Calls the alterTrait function to alter the traits' exp
  // Input: alterAmount (number added to charismaEXP)
  const alterSkillEXP = async (alterAmount : number, skillName: string) => {
    if (!userData || !auth.currentUser) return;
    try {
        const skillsRef = collection(db, "users", auth.currentUser.uid, "skills");
        const q = query(skillsRef, where("name", "==", skillName));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const skillDoc = querySnapshot.docs[0].ref;
          
          const skill = userData.skills?.find(skill => skill.name === skillName);
          if(!skill){
            console.log("Tried altering exp to a skill that doesn't exist");
            return
          }
          await updateDoc(skillDoc, {
            exp: (skill.exp + alterAmount) 
          })

          alterTraitEXP(alterAmount, skill.primaryTrait, skill.secondaryTrait || "")
        }
        else {
          console.log(`No skill found with name: ${skillName}`);
        }
    } catch (error) {
      console.error("Error altering skill exp:", error);
    }
  }

  // Function called by the alterSkillEXP function that handles altering the exp of traits for a skill
  // If there is only a primary skill 100% goes to that, if there are two, the are split up 75% and 25%
  // Input: alterAmount (number added to skillEXP and traits), primary (string with primary trait name), secondary (string with secondary trait name)
  const alterTraitEXP = async (alterAmount : number, primary : string, secondary : string) => {
    // If there is no secondary trait, the primary trait gets the entirety of the exp.
    if (secondary === "") {
      switch (primary) {
      case "Strength":
        alterStrengthEXP(alterAmount);
        break;
      case "Vitality":
        alterVitalityEXP(alterAmount);
        break;
      case "Agility":
        alterAgilityEXP(alterAmount);
        break;
      case "Stamina":
        alterStaminaEXP(alterAmount);
        break;
      case "Intelligence":
        alterIntelligenceEXP(alterAmount);
        break;
      case "Charisma":
        alterCharismaEXP(alterAmount);
        break;
      }
    }
    // If there is a secondary trait, the primary trait gets 60% of the exp and secondary trait gets 40%
    else {
      switch (primary) {
        case "Strength":
          alterStrengthEXP((alterAmount * 0.75));
          break;
        case "Vitality":
          alterVitalityEXP((alterAmount * 0.75));
          break;
        case "Agility":
          alterAgilityEXP((alterAmount * 0.75));
          break;
        case "Stamina":
          alterStaminaEXP((alterAmount * 0.75));
          break;
        case "Intelligence":
          alterIntelligenceEXP((alterAmount * 0.75));
          break;
        case "Charisma":
          alterCharismaEXP((alterAmount * 0.75));
          break;
        }
        switch (secondary) {
          case "Strength":
            alterStrengthEXP((alterAmount * 0.25));
            break;
          case "Vitality":
            alterVitalityEXP((alterAmount * 0.25));
            break;
          case "Agility":
            alterAgilityEXP((alterAmount * 0.25));
            break;
          case "Stamina":
            alterStaminaEXP((alterAmount * 0.25));
            break;
          case "Intelligence":
            alterIntelligenceEXP((alterAmount * 0.25));
            break;
          case "Charisma":
            alterCharismaEXP((alterAmount * 0.25));
            break;
          }
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
        secondaryTrait: secondaryTrait,
        description: description,
        exp: calcEXP,
        active: true,
      };
      
      
      // Add the record to FireBase as a new document in the "skills" collection
      const docRef = await addDoc(skillsCollectionRef, newSkill);
      console.log("Skill added with ID:", docRef.id);
      
      // Removed adding overall exp when skill is created. 
      //alterOverallEXP(calcEXP);
    } catch (error) {
      console.error("Error altering skill:", error);
    }
  }

  // Function that sets the boolean field 'active' in a skill to false.
  // Validation of skill meeting requirements to be archived is handled in the function that calls it in SkillViewModal
  // Input: id (string of the skill's id)
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
  
  // Function that sets the boolean field 'active' in a skill to true.
  // Validation of skill meeting requirements to be archived is handled in the function that calls it in SkillViewModal
  // Input: id (string of the skill's id)
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
  
  // Function that creates a new document in the "quests" collection of Firebase representing a new quest
  // Validation of inputs is handled in the function that calls it in the CreateQuestModal 
  // questName, primarySkill, dueDate, difficulty, and repeatable are required. The others are optional and may be blank strings
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
        secondarySkill: secondarySkill,
        reward: completionReward,
        active: true,
        repeatable: repeatable
      };
       
      const docRef = await addDoc(questsCollectionRef, newQuest);
      console.log("Quest added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding quest:", error);
    }
  }

  // Function that deletes a quest document from the "quests" collection
  // Validation of quest meeting requirements to be deleted is handled in the function that calls it in QuestViewModal
  // Input: id (string of the quest's id)
  const deleteQuest = async(id: string) => {
    if (!auth.currentUser) return;
    try {
        const docRef = doc(db, "users", auth.currentUser.uid, "quests", id)
        await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting quest:", error);
    }
  };

  // Function that sets a quest's 'active' field to false and rewards exp to skills and overall exp
  // Validation of quest meeting requirements to be completed is handled in the function that calls it in QuestViewModal
  // Input: id (string of the quest's id)
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
          alterSkillEXP(expGain, quest.primarySkill);
        }
        else {
          alterSkillEXP((expGain *0.75), quest.primarySkill);
          alterSkillEXP((expGain *0.25), quest.secondarySkill);
        }
        alterOverallEXP(expGain);
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
