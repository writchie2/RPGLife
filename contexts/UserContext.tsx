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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;  // ReactNode can represent any valid React child, including strings, numbers, JSX, etc.
  }

// Create a provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  
  
  const setAvatar = async (index: number) => {
    if (!userData) return;
    const updatedUser = { ...userData, avatarIndex: index };
    setUserData(updatedUser);

    try {
      await saveUserData(updatedUser);
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

  const addSkill = async (skillName: String, description: String, primaryTrait: String, secondaryTrait: String, experience: String) => {
    if (!auth.currentUser) {
      return;
    }
    let calcEXP = 0; 
    if (experience = "adept"){ calcEXP = 1000;}
    if (experience = "master"){ calcEXP = 2200;}
  
    try {
      const skillsCollectionRef = collection(db, "users", auth.currentUser.uid, "skills");
      
      const newSkill: Record<string, any> = {
        name: skillName,
        primaryTrait: primaryTrait,
        exp: calcEXP,
        active: true,
      };
  
      if (secondaryTrait !== "") {
        newSkill.secondaryTrait = secondaryTrait;
      }
      if (description !== "") {
        newSkill.description = description;
      }
      
  
      const docRef = await addDoc(skillsCollectionRef, newSkill);
      console.log("Skill added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  }

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
      };
  
      if (secondarySkill !== "") {
        newQuest.secondarySkill = secondarySkill;
      }
      if (repeatable !== false) {
        newQuest.repeatable = repeatable;
      }
      
  
      const docRef = await addDoc(questsCollectionRef, newQuest);
      console.log("Skill added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  }

  useEffect(() => {

    if (!auth.currentUser) return;

    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const questsCollectionRef = collection(db, 'users', auth.currentUser.uid, 'quests');
    const skillsCollectionRef = collection(db, 'users', auth.currentUser.uid, 'skills');

    // Subscribe to Firestore changes
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const updatedData = docSnapshot.data() as UserData;
        setUserData(updatedData);
        saveUserData(updatedData); // Update AsyncStorage cache
      } else {
        console.error("User document does not exist.");
      }
    });

    const unsubscribeQuests = onSnapshot(questsCollectionRef, (querySnapshot) => {
      const updatedQuests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserData((prev) => (prev ? { ...prev, quests: updatedQuests as Quest[] } : null));
    });

    const unsubscribeSkills = onSnapshot(skillsCollectionRef, (querySnapshot) => {
      const updatedSkills = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserData((prev) => (prev ? { ...prev, skills: updatedSkills as Skill[] } : null));
    
    });

    
    return () => {
      unsubscribeUser();
      unsubscribeQuests();
      unsubscribeSkills();
    }

  }, []);

  return (
    <UserContext.Provider value={{userData, setAvatar, addSkill, addQuest}}>
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