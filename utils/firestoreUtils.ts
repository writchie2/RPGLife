import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { UserData, Quest, Skill } from '../utils/types';


// Inputs: userID string (auth.currentUser.uid)
// Output: object using UserData interface (defined in type.ts in same directory)
// Function queries firebase for document containing user information
// Then builds a data structure so that data can be accessed locally
export const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {
      // Reference to the user document
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        console.log('User not found');
        return null;
      }
  
      const userData = userSnap.data() as UserData;
  
      // Fetch quests collection
      const questsRef = collection(userRef, 'quests');
    const questsSnap = await getDocs(questsRef);
    userData.quests = questsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id, // Assigning the document ID
        name: data.name || '',
        dueDate: data.dueDate || '',
        description: data.description || '',
        difficulty: (data.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
        primarySkill: data.primarySkill || '',
        secondarySkill: data.secondarySkill || '',
        repeatable: data.repeatable ?? false, // Explicitly checking for boolean values
      } as Quest;
    });

    // Fetch skills collection
    const skillsRef = collection(userRef, 'skills');
    const skillsSnap = await getDocs(skillsRef);
    userData.skills = skillsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        trait: data.trait || '',
      } as Skill;
    });
  
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };
  