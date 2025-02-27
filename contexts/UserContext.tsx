// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchUserData } from '@/utils/firestoreUtils';
import { auth } from "../FirebaseConfig"
import { saveUserData, getUserData } from '../utils/storageUtils';
import { UserData } from '@/utils/types';


// Create a context with undefined as the default value
const UserContext = createContext< UserData | null | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;  // ReactNode can represent any valid React child, including strings, numbers, JSX, etc.
  }

// Create a provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {

    const loadUserData = async () => {
    
      if (!auth.currentUser) {
        console.error('User ID is undefined, cannot fetch user data.');
        return;
      }
      
      try {
        let data = await getUserData(); // Try AsyncStorage first
        if (!data || data.email !== auth.currentUser.email) {
            console.log('No cached data for user, fetching from Firestore...');
            data = await fetchUserData(auth.currentUser.uid); // Fetch from Firestore
            if (data) {
              await saveUserData(data); // Cache it for next time
            }
          }

          setUserData(data);
        } catch (error) {
          console.error('Error loading user data:', error);
      };
    };
    loadUserData();
  }, []);

  return (
    <UserContext.Provider value={userData}>
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