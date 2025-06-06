import { Timestamp } from "firebase/firestore";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";

// Define a quest structure
export interface Quest {
  id: string;
  name: string;
  dueDate: Date;
  description: string;
  difficulty: string;
  primarySkill: string;
  secondarySkill: string; // Optional secondary skill
  repeatable: boolean;
  reward: string;
  checkpoints?: Checkpoint[]; // Optional checkpoints list (can be empty)
  active: boolean;
}

// Define a skill structure
export interface Skill {
  id: string;
  name: string;
  description: string;
  primaryTrait: string;
  secondaryTrait: string;
  exp: number;
  active: boolean;
  archiveDate?: Date;
  deteriorateCount?: number;
}

// Define the structure of a Firestore user document
export interface UserData {
  username: string;
  birthday: Date;
  email: string;
  lastLogin?: Date | null;
  firstLoginComplete?: boolean | null;
  strengthEXP: number;
  vitalityEXP: number;
  agilityEXP: number;
  staminaEXP: number;
  intelligenceEXP: number;
  charismaEXP: number;
  exp: number;
  avatarIndex: number;
  characterTitle: string; // store selected character title
  theme: string; // store selected theme
  quests?: Quest[]; // Optional quests list (can be empty)
  skills?: Skill[]; // Optional skills list (can be empty)
  testerMode: boolean;
}

// Define a checkpoint structure
export interface Checkpoint {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: Date;
}
