// contexts/UserContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchUserData } from "@/utils/firestoreUtils";
import { auth } from "../FirebaseConfig";
import { saveUserData, getUserData } from "../utils/storageUtils";
import { UserData, Skill, Quest, Checkpoint } from "@/utils/types";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  addDoc,
  deleteDoc,
  getDocs,
  where,
  getDoc,
  FieldValue,
  deleteField,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { toMidnight } from "@/utils/toMidnight";

interface UserContextType {
  userData: UserData | null;
  setTheme: (themeName: string) => void;
  setCharacterTitle: (title: string) => void;
  setAvatar: (index: number) => void;
  addSkill: (
    skillName: string,
    description: string,
    primaryTrait: string,
    secondaryTrait: string,
    experience: string
  ) => void;
  addQuest: (
    questName: string,
    questDescription: string,
    dueDate: Date,
    difficulty: string,
    primarySkill: string,
    secondarySkill: string,
    repeatable: Boolean,
    completionReward: string
  ) => void;
  archiveSkill: (id: string) => void;
  activateSkill: (id: string) => void;
  deleteQuest: (id: string) => void;
  deleteSkill: (id: string) => void;
  completeQuest: (id: string) => void;
  repeatQuest: (id: string) => void;
  resetAccount: () => void;
  editSkillName: (id: string, newName: string) => void;
  editSkillDescription: (id: string, newDescription: string) => void;
  editSkillTraits: (
    id: string,
    newPrimary: string,
    newSecondary: string
  ) => void;
  editQuestName: (id: string, newQuestName: string) => void;
  editQuestDescription: (id: string, newQuestDescription: string) => void;
  editQuestSkills: (
    id: string,
    newQuestPrimarySkill: string,
    newQuestSecondarySkill: string
  ) => void;
  editQuestRepeatable: (id: string, newQuestRepeatable: boolean) => void;
  addCheckpoint: (
    checkpointName: string,
    checkpointDescription: string,
    questID: string
  ) => void;
  completeCheckpoint: (questID: string, checkpointID: string) => void;
  deleteCheckpoint: (questID: string, checkpointID: string) => void;
  editCheckpointName: (
    questID: string,
    checkpointID: string,
    newName: string
  ) => void;
  editCheckpointDescription: (
    questID: string,
    checkpointID: string,
    newDewscription: string
  ) => void;
  firstLogin: () => void;
  alterOverallEXP: (alterAmount: number) => void;
  deteriorateSkill: (deteriorateAmmount: number, id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode; // ReactNode can represent any valid React child, including strings, numbers, JSX, etc.
}

// Create a provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [updatedCheckpoints, setUpdatedCheckpoints] = useState<Checkpoint[]>(
    []
  );

  /* 
        EXP FUNCTIONS
*/

  // Function alters an amount to the user's strengthEXP.
  // Input: alterAmount (number added to strengthEXP)
  const alterStrengthEXP = async (alterAmount: number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (!userSnap.exists()) {
          console.error("Error: User document not found.");
          return;
        }

        const currentStrengthEXP = userSnap.data().strengthEXP;
        let newTotal = currentStrengthEXP + alterAmount;
        if (newTotal < 0) {
          newTotal = 0;
        }

        await updateDoc(userDoc, {
          strengthEXP: newTotal,
        });
      }
    } catch (error) {
      console.error("Error altering strength exp:", error);
    }
  };

  // Function alters an amount to the user's vitalityEXP.
  // Input: alterAmount (number added to vitalityEXP)
  const alterVitalityEXP = async (alterAmount: number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (!userSnap.exists()) {
          console.error("Error: User document not found.");
          return;
        }

        const currentVitalityEXP = userSnap.data().vitalityEXP;
        let newTotal = currentVitalityEXP + alterAmount;
        if (newTotal < 0) {
          newTotal = 0;
        }

        await updateDoc(userDoc, {
          vitalityEXP: newTotal,
        });
      }
    } catch (error) {
      console.error("Error altering vitality exp avatar:", error);
    }
  };

  // Function alters an amount to the user's agilityEXP.
  // Input: alterAmount (number added to agilityEXP)
  const alterAgilityEXP = async (alterAmount: number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (!userSnap.exists()) {
          console.error("Error: User document not found.");
          return;
        }

        const currentAgilityEXP = userSnap.data().agilityEXP;
        let newTotal = currentAgilityEXP + alterAmount;
        if (newTotal < 0) {
          newTotal = 0;
        }

        await updateDoc(userDoc, {
          agilityEXP: newTotal,
        });
      }
    } catch (error) {
      console.error("Error altering agility exp:", error);
    }
  };

  // Function alters an amount to the user's staminaEXP.
  // Input: alterAmount (number added to staminaEXP)
  const alterStaminaEXP = async (alterAmount: number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (!userSnap.exists()) {
          console.error("Error: User document not found.");
          return;
        }

        const currentStaminaEXP = userSnap.data().staminaEXP;
        let newTotal = currentStaminaEXP + alterAmount;
        if (newTotal < 0) {
          newTotal = 0;
        }

        await updateDoc(userDoc, {
          staminaEXP: newTotal,
        });
      }
    } catch (error) {
      console.error("Error altering stamina exp:", error);
    }
  };

  // Function alters an amount to the user's intelligenceEXP.
  // Input: altereAmount (number added to intelligenceEXP)
  const alterIntelligenceEXP = async (alterAmount: number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (!userSnap.exists()) {
          console.error("Error: User document not found.");
          return;
        }

        const currentIntelligenceEXP = userSnap.data().intelligenceEXP;
        let newTotal = currentIntelligenceEXP + alterAmount;
        if (newTotal < 0) {
          newTotal = 0;
        }

        await updateDoc(userDoc, {
          intelligenceEXP: newTotal,
        });
      }
    } catch (error) {
      console.error("Error altering intelligence exp:", error);
    }
  };

  // Function alters an amount to the user's charismaEXP.
  // Input: alterAmount (number added to charismaEXP)
  const alterCharismaEXP = async (alterAmount: number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (!userSnap.exists()) {
          console.error("Error: User document not found.");
          return;
        }

        const currentCharismaEXP = userSnap.data().charismaEXP;
        let newTotal = currentCharismaEXP + alterAmount;
        if (newTotal < 0) {
          newTotal = 0;
        }

        await updateDoc(userDoc, {
          charismaEXP: newTotal,
        });
      }
    } catch (error) {
      console.error("Error altering charisma exp:", error);
    }
  };

  // Function alters an amount to the user's overallEXP.
  // Input: alterAmount (number added to charismaEXP)
  const alterOverallEXP = async (alterAmount: number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (!userSnap.exists()) {
          console.error("Error: User document not found.");
          return;
        }

        const currentEXP = userSnap.data().exp;
        let newTotal = currentEXP + alterAmount;
        if (newTotal < 0) {
          newTotal = 0;
        }

        await updateDoc(userDoc, {
          exp: newTotal,
        });
      }
    } catch (error) {
      console.error("Error altering overall skill:", error);
    }
  };

  // Function that alters the exp of a skill
  // Calls the alterTrait function to alter the traits' exp
  // Input: alterAmount (number added to charismaEXP)
  const alterSkillEXP = async (alterAmount: number, skillName: string) => {
    if (!userData || !auth.currentUser) return;
    try {
      const skillsRef = collection(db, "users", auth.currentUser.uid, "skills");
      const q = query(skillsRef, where("name", "==", skillName));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const skillDoc = querySnapshot.docs[0].ref;

        const skill = userData.skills?.find(
          (skill) => skill.name === skillName
        );
        if (!skill) {
          console.log("Tried altering exp to a skill that doesn't exist");
          return;
        }

        const currentEXP = skill.exp;
        let newTotal = currentEXP + alterAmount;
        if (newTotal < 0) {
          newTotal = 0;
        }

        await updateDoc(skillDoc, {
          exp: newTotal,
        });
        if (currentEXP > 0 && newTotal == 0) {
          alterTraitEXP(
            -1 * currentEXP,
            skill.primaryTrait,
            skill.secondaryTrait || ""
          );
        } else if (currentEXP == 0) {
          //No deterioration.
        } else {
          alterTraitEXP(
            alterAmount,
            skill.primaryTrait,
            skill.secondaryTrait || ""
          );
        }
      } else {
        console.log(`No skill found with name: ${skillName}`);
      }
    } catch (error) {
      console.error("Error altering skill exp:", error);
    }
  };

  const deteriorateSkill = async (deteriorateAmmount: number, id: string) => {
    if (!auth.currentUser || !userData) return;
    try {
      if (auth.currentUser) {
        const skill = userData.skills?.find((skill) => skill.id === id);
        const currentDeteriorate = skill?.deteriorateCount ?? 0;
        const skillDoc = doc(db, "users", auth.currentUser.uid, "skills", id);
        await updateDoc(skillDoc, {
          deteriorateCount: deteriorateAmmount + currentDeteriorate,
        });
        alterSkillEXP(-500 * deteriorateAmmount, skill?.name || "");
      }
    } catch (error) {
      console.error("Error archiving skill:", error);
    }
  };

  // Function called by the alterSkillEXP function that handles altering the exp of traits for a skill
  // If there is only a primary skill 100% goes to that, if there are two, the are split up 75% and 25%
  // Input: alterAmount (number added to skillEXP and traits), primary (string with primary trait name), secondary (string with secondary trait name)
  const alterTraitEXP = async (
    alterAmount: number,
    primary: string,
    secondary: string
  ) => {
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
          alterStrengthEXP(alterAmount * 0.75);
          break;
        case "Vitality":
          alterVitalityEXP(alterAmount * 0.75);
          break;
        case "Agility":
          alterAgilityEXP(alterAmount * 0.75);
          break;
        case "Stamina":
          alterStaminaEXP(alterAmount * 0.75);
          break;
        case "Intelligence":
          alterIntelligenceEXP(alterAmount * 0.75);
          break;
        case "Charisma":
          alterCharismaEXP(alterAmount * 0.75);
          break;
      }
      switch (secondary) {
        case "Strength":
          alterStrengthEXP(alterAmount * 0.25);
          break;
        case "Vitality":
          alterVitalityEXP(alterAmount * 0.25);
          break;
        case "Agility":
          alterAgilityEXP(alterAmount * 0.25);
          break;
        case "Stamina":
          alterStaminaEXP(alterAmount * 0.25);
          break;
        case "Intelligence":
          alterIntelligenceEXP(alterAmount * 0.25);
          break;
        case "Charisma":
          alterCharismaEXP(alterAmount * 0.25);
          break;
      }
    }
  };

  /*
        SKILL FUNCTIONS
  */

  // Function that creates a new document in the "skills" collection of Firebase representing a new skill
  // Validation of inputs is handled in the function that calls it in the CreateSkillModal
  // skillName, primaryTrait, and experiecne are required. The others are optional and may be blank strings
  const addSkill = async (
    skillName: string,
    description: string,
    primaryTrait: string,
    secondaryTrait: string,
    experience: string
  ) => {
    if (!auth.currentUser) {
      return;
    }

    // Right now "novice" = 0 exp, "adept" = 1000 exp, "master" = 2200 exp
    // This can all change when we re-balance how exp works
    let calcEXP = 0;
    if (experience === "adept") {
      calcEXP = 6105;
    }
    if (experience === "master") {
      calcEXP = 15932;
    }

    try {
      const skillsCollectionRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "skills"
      );

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

      alterTraitEXP(calcEXP, primaryTrait, secondaryTrait);
    } catch (error) {
      console.error("Error altering skill:", error);
    }
  };

  // Function that sets the boolean field 'active' in a skill to false.
  // Validation of skill meeting requirements to be archived is handled in the function that calls it in SkillViewModal
  // Input: id (string of the skill's id)
  const archiveSkill = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      if (auth.currentUser) {
        const skillDoc = doc(db, "users", auth.currentUser.uid, "skills", id);
        await updateDoc(skillDoc, {
          active: false,
          archiveDate: toMidnight(new Date()),
          deteriorateCount: 0,
        });
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
        const skillDoc = doc(db, "users", auth.currentUser.uid, "skills", id);
        await updateDoc(skillDoc, {
          active: true,
          archiveDate: deleteField(),
          deteriorateCount: deleteField(),
        });
      }
    } catch (error) {
      console.error("Error activating skill:", error);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      const skill = userData?.skills?.find((skill) => skill.id === id);
      if (!skill) {
        return;
      }

      await alterTraitEXP(
        skill.exp * -1,
        skill.primaryTrait,
        skill.secondaryTrait
      );

      const docRef = doc(db, "users", auth.currentUser.uid, "skills", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting quest:", error);
    }
  };

  const editSkillName = async (id: string, newName: string) => {
    try {
      if (auth.currentUser) {
        const skillDoc = doc(db, "users", auth.currentUser.uid, "skills", id);
        await updateDoc(skillDoc, {
          name: newName,
        });
      }
    } catch (error) {
      console.error("Error editing name:", error);
    }
  };

  const editSkillDescription = async (id: string, newDescription: string) => {
    try {
      if (auth.currentUser) {
        const skillDoc = doc(db, "users", auth.currentUser.uid, "skills", id);
        await updateDoc(skillDoc, {
          description: newDescription,
        });
      }
    } catch (error) {
      console.error("Error editing name:", error);
    }
  };

  const editSkillTraits = async (
    id: string,
    newPrimary: string,
    newSecondary: string
  ) => {
    try {
      if (auth.currentUser) {
        const skill = userData?.skills?.find((skill) => skill.id === id);
        if (!skill) {
          return;
        }

        await alterTraitEXP(
          skill.exp * -1,
          skill.primaryTrait,
          skill.secondaryTrait
        );

        const skillDoc = doc(db, "users", auth.currentUser.uid, "skills", id);
        await updateDoc(skillDoc, {
          primaryTrait: newPrimary,
          secondaryTrait: newSecondary,
        });

        await alterTraitEXP(skill.exp, newPrimary, newSecondary);
      }
    } catch (error) {
      console.error("Error editing name:", error);
    }
  };

  /*
        QUEST FUNCTIONS
  */

  // Function that creates a new document in the "quests" collection of Firebase representing a new quest
  // Validation of inputs is handled in the function that calls it in the CreateQuestModal
  // questName, primarySkill, dueDate, difficulty, and repeatable are required. The others are optional and may be blank strings
  const addQuest = async (
    questName: string,
    questDescription: string,
    dueDate: Date,
    difficulty: string,
    primarySkill: string,
    secondarySkill: string,
    repeatable: Boolean,
    completionReward: string
  ) => {
    if (!auth.currentUser) {
      return;
    }
    try {
      const questsCollectionRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "quests"
      );

      const newQuest: Record<string, any> = {
        name: questName,
        description: questDescription,
        dueDate: toMidnight(dueDate),
        difficulty: difficulty,
        primarySkill: primarySkill,
        secondarySkill: secondarySkill,
        reward: completionReward,
        active: true,
        repeatable: repeatable,
      };

      const docRef = await addDoc(questsCollectionRef, newQuest);
      console.log("Quest added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding quest:", error);
    }
  };

  // Function that deletes a quest document from the "quests" collection
  // Validation of quest meeting requirements to be deleted is handled in the function that calls it in QuestViewModal
  // Input: id (string of the quest's id)
  const deleteQuest = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, "users", auth.currentUser.uid, "quests", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting quest:", error);
    }
  };

  // Function that sets a quest's 'active' field to false and rewards exp to skills and overall exp
  // Validation of quest meeting requirements to be completed is handled in the function that calls it in QuestViewModal
  // Input: id (string of the quest's id)
  const completeQuest = async (id: string) => {
    if (!auth.currentUser || !userData) return;
    try {
      const docRef = doc(db, "users", auth.currentUser.uid, "quests", id);
      const quest = userData.quests?.find((quest) => quest.id === id);
      if (!quest) {
        console.log("Tried to complete a quest that doesn't exist!");
        return;
      }

      // Double check the quest is active
      // The button should not appear when quest is inactive, so this shouldnt happen
      if (quest.active == false) {
        console.log("Cannot complete a 'completed' quest!");
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
      } else {
        alterSkillEXP(expGain * 0.75, quest.primarySkill);
        alterSkillEXP(expGain * 0.25, quest.secondarySkill);
      }
      alterOverallEXP(expGain);

      await updateDoc(docRef, {
        active: false,
      });
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };

  // Function rewards exp to skills and overall exp based on a quests difficulty
  // Almost identicle to completing a quest, only the quest is still set as active
  // Validation of quest meeting requirements to be completed is handled in the function that calls it in QuestViewModal
  // Input: id (string of the quest's id)
  const repeatQuest = async (id: string) => {
    if (!auth.currentUser || !userData) return;
    try {
      const docRef = doc(db, "users", auth.currentUser.uid, "quests", id);
      const quest = userData.quests?.find((quest) => quest.id === id);
      if (!quest) {
        console.log("Tried to repeate a quest that doesn't exist!");
        return;
      }

      // Double check the quest is active
      // The button should not appear when quest is inactive, so this shouldnt happen
      if (quest.active == false) {
        console.log("Cannot repeat a 'completed' quest!");
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
      } else {
        alterSkillEXP(expGain * 0.75, quest.primarySkill);
        alterSkillEXP(expGain * 0.25, quest.secondarySkill);
      }
      alterOverallEXP(expGain);
    } catch (error) {
      console.error("Error repeating quest:", error);
    }
  };

  const editQuestName = async (id: string, newQuestName: string) => {
    try {
      if (auth.currentUser) {
        const questDoc = doc(db, "users", auth.currentUser.uid, "quests", id);
        await updateDoc(questDoc, { name: newQuestName });
      }
    } catch (error) {
      console.error("Error with editing Quest Name: ", error);
    }
  };

  const editQuestDescription = async (
    id: string,
    newQuestDescription: string
  ) => {
    try {
      if (auth.currentUser) {
        const questDoc = doc(db, "users", auth.currentUser.uid, "quests", id);
        await updateDoc(questDoc, { description: newQuestDescription });
      }
    } catch (error) {
      console.error("Error with editing Quest Description: ", error);
    }
  };

  const editQuestRepeatable = async (
    id: string,
    newQuestRepeatable: boolean
  ) => {
    try {
      if (auth.currentUser) {
        const questDoc = doc(db, "users", auth.currentUser.uid, "quests", id);
        await updateDoc(questDoc, { repeatable: newQuestRepeatable });
      }
    } catch (error) {
      console.error("Error with editing Quest Repeatability: ", error);
    }
  };

  const editQuestSkills = async (
    id: string,
    newQuestPrimarySkill: string,
    newQuestSecondarySkill: string
  ) => {
    try {
      if (auth.currentUser) {
        const questDoc = doc(db, "users", auth.currentUser.uid, "quests", id);
        await updateDoc(questDoc, {
          primarySkill: newQuestPrimarySkill,
          secondarySkill: newQuestSecondarySkill,
        });
      }
    } catch (error) {
      console.error("Error with editing Quest Skills: ", error);
    }
  };

  const addCheckpoint = async (
    checkpointName: string,
    checkpointDescription: string,
    questID: string
  ) => {
    if (!auth.currentUser) {
      return;
    }
    try {
      const questsCollectionRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "quests",
        questID,
        "checkpoints"
      );

      const newCheckpoint: Record<string, any> = {
        name: checkpointName,
        description: checkpointDescription,
        active: true,
        createdAt: toMidnight(new Date()),
      };

      const docRef = await addDoc(questsCollectionRef, newCheckpoint);
      console.log("Checkpoint added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding checkpoint:", error);
    }
  };

  const completeCheckpoint = async (questID: string, checkpointID: string) => {
    if (!auth.currentUser || !userData) return;
    try {
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "quests",
        questID,
        "checkpoints",
        checkpointID
      );
      const quest = userData.quests?.find((quest) => quest.id === questID);
      const checkpoint = quest?.checkpoints?.find(
        (checkpoint) => checkpoint.id === checkpointID
      );
      if (!checkpoint) {
        console.log("Tried to complete a checkpoint that doesn't exist!");
        return;
      }

      await updateDoc(docRef, {
        active: false,
      });
    } catch (error) {
      console.error("Error completing checkpoint:", error);
    }
  };

  const editCheckpointName = async (
    questID: string,
    checkpointID: string,
    newName: string
  ) => {
    try {
      if (auth.currentUser) {
        const checkpointDoc = doc(
          db,
          "users",
          auth.currentUser.uid,
          "quests",
          questID,
          "checkpoints",
          checkpointID
        );
        await updateDoc(checkpointDoc, { name: newName });
      }
    } catch (error) {
      console.error("Error with editing Quest Name: ", error);
    }
  };

  const editCheckpointDescription = async (
    questID: string,
    checkpointID: string,
    newDescription: string
  ) => {
    try {
      if (auth.currentUser) {
        const checkpointDoc = doc(
          db,
          "users",
          auth.currentUser.uid,
          "quests",
          questID,
          "checkpoints",
          checkpointID
        );
        await updateDoc(checkpointDoc, { description: newDescription });
      }
    } catch (error) {
      console.error("Error with editing Quest Name: ", error);
    }
  };

  const deleteCheckpoint = async (questID: string, checkpointID: string) => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "quests",
        questID,
        "checkpoints",
        checkpointID
      );
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting checkpoint:", error);
    }
  };

  /*
        SETTING FUNCTIONS
*/

  // Function updates the user's document to change the theme selected
  // Input: string (the theme used/selected in settings)
  const setTheme = async (themeName: string) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDoc, {
          theme: themeName,
        });
      }
    } catch (error) {
      console.error("Error altering app theme:", error);
    }
  };

  // Function updates the user's document to change the characterTitle selected
  // Input: string (the title used in UserHeader)
  const setCharacterTitle = async (title: string) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDoc, {
          characterTitle: title,
        });
      }
    } catch (error) {
      console.error("Error altering character title:", error);
    }
  };

  // Function updates the user's document to change the index of their avatar icon
  // Input: index (for avatar array in UserHeader)
  const setAvatar = async (index: number) => {
    if (!userData) return;
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDoc, {
          avatarIndex: index,
        });
      }
    } catch (error) {
      console.error("Error altering avatar:", error);
    }
  };

  // Function deletes all skill, quests, and resets all exp to 0
  const resetAccount = async () => {
    if (!auth.currentUser || !userData) return;
    try {
      const userUID = auth.currentUser.uid;
      const userDoc = doc(db, "users", userUID);
      await updateDoc(userDoc, {
        exp: 0,
        strengthEXP: 0,
        vitalityEXP: 0,
        agilityEXP: 0,
        staminaEXP: 0,
        intelligenceEXP: 0,
        charismaEXP: 0,
      });

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
    } catch (error) {
      console.error("Error resetting account:", error);
    }
  };

  const firstLogin = async () => {
    if (!auth.currentUser || !userData) return;
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    updateDoc(userDocRef, {
      firstLoginComplete: true,
      lastLogin: toMidnight(new Date()),
    });
  };

  /*
        LISTENER (unsuscribe) FUNCTIONS
  */

  useEffect(() => {
    if (!auth.currentUser) return;

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const questsCollectionRef = collection(
      db,
      "users",
      auth.currentUser.uid,
      "quests"
    );
    const skillsCollectionRef = collection(
      db,
      "users",
      auth.currentUser.uid,
      "skills"
    );

    let checkpointUnsubscribers: Record<string, () => void> = {}; // Store checkpoint listeners

    // Subscribes to user document
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setUserData((prev) => ({
          username: data.username,
          birthday: toMidnight(data.birthdate?.toDate?.()),
          email: data.email,
          lastLogin: toMidnight(data.lastLogin?.toDate?.()) || null,
          firstLoginComplete: data.firstLoginComplete ?? null,
          strengthEXP: data.strengthEXP,
          vitalityEXP: data.vitalityEXP,
          agilityEXP: data.agilityEXP,
          staminaEXP: data.staminaEXP,
          intelligenceEXP: data.intelligenceEXP,
          charismaEXP: data.charismaEXP,
          exp: data.exp,
          avatarIndex: data.avatarIndex,
          characterTitle: data.characterTitle,
          theme: data.theme,
          quests: prev?.quests || [],
          skills: prev?.skills || [],
        }));
      } else {
        console.error("User document does not exist.");
      }
    });

    // Subscribes to quests collection
    const unsubscribeQuests = onSnapshot(
      questsCollectionRef,
      (querySnapshot) => {
        const updatedQuests = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            description: data.description || "",
            difficulty: data.difficulty || "Easy",
            primarySkill: data.primarySkill || "",
            secondarySkill: data.secondarySkill || "",
            dueDate: toMidnight(data.dueDate?.toDate?.()) || null, // Convert Firestore Timestamp
            active: data.active ?? true,
            repeatable: data.repeatable ?? false,
            reward: data.reward || "",
            checkpoints: [],
          } as Quest;
        });

        // Cleanup old checkpoint listeners before adding new ones
        Object.values(checkpointUnsubscribers).forEach((unsubscribe) =>
          unsubscribe()
        );
        checkpointUnsubscribers = {}; // Reset stored unsubscribers

        // Listen to checkpoints inside each quest
        updatedQuests.forEach((quest: Quest) => {
          const checkpointsRef = collection(
            db,
            "users",
            auth.currentUser!.uid,
            "quests",
            quest.id,
            "checkpoints"
          );

          const unsubscribeCheckpoints = onSnapshot(
            checkpointsRef,
            (checkpointSnapshot) => {
              const newCheckpoints = checkpointSnapshot.docs.map((doc) => {
                const data = doc.data();

                return {
                  id: doc.id,
                  name: data.name,
                  description: data.description,
                  active: data.active,
                  createdAt:
                    toMidnight(data.createdAt?.toDate?.()) ||
                    toMidnight(new Date()),
                } as Checkpoint;
              });
              setUserData((prev) => {
                if (!prev) return prev;

                return {
                  ...prev,
                  quests: prev.quests?.map((q) =>
                    q.id === quest.id
                      ? {
                          ...q,
                          checkpoints: newCheckpoints.map(
                            (checkpoint: Checkpoint) => ({
                              id: checkpoint.id,
                              name: checkpoint.name || "",
                              description: checkpoint.description || "",
                              active: checkpoint.active ?? true,

                              createdAt: checkpoint.createdAt
                                ? toMidnight(new Date(checkpoint.createdAt))
                                : toMidnight(new Date()),
                            })
                          ) as Checkpoint[],
                        }
                      : q
                  ),
                };
              });
            }
          );

          checkpointUnsubscribers[quest.id] = unsubscribeCheckpoints; // Store for cleanup
        });

        setUserData((prev) =>
          prev ? { ...prev, quests: updatedQuests } : null
        );
      }
    );

    // Subscribes to skills collection
    const unsubscribeSkills = onSnapshot(
      skillsCollectionRef,
      (querySnapshot) => {
        const updatedSkills = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            description: data.description || "",
            primaryTrait: data.primaryTrait || "",
            secondaryTrait: data.secondaryTrait || "",
            exp: data.exp || 0,
            active: data.active ?? true,
            archiveDate: toMidnight(data.archiveDate?.toDate?.()) || null,
            deteriorateCount: data.deteriorateCount || 0,
          } as Skill;
        });

        setUserData((prev) =>
          prev ? { ...prev, skills: updatedSkills as Skill[] } : null
        );
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeQuests();
      unsubscribeSkills();
      Object.values(checkpointUnsubscribers).forEach((unsubscribe) =>
        unsubscribe()
      ); // Cleanup checkpoints
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        setAvatar,
        setCharacterTitle,
        setTheme,
        addSkill,
        addQuest,
        archiveSkill,
        activateSkill,
        deleteQuest,
        completeQuest,
        resetAccount,
        editSkillName,
        editSkillDescription,
        editSkillTraits,
        deleteSkill,
        editQuestName,
        editQuestDescription,
        editQuestRepeatable,
        editQuestSkills,
        addCheckpoint,
        completeCheckpoint,
        deleteCheckpoint,
        editCheckpointName,
        editCheckpointDescription,
        repeatQuest,
        firstLogin,
        alterOverallEXP,
        deteriorateSkill,
      }}
    >
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
