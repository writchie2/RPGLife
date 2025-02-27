import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, Quest, Skill } from '../utils/types';

const USER_DATA_KEY = 'user_data';


//Inputs: UserData object
//Ouputs: None
//Function saves a copy of the user data locally so it can be used
//Without querying database
export const saveUserData = async (userData: UserData | null) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

//Inputs: None
//Ouputs: UserData object
//Function loads a copy of the user data stored locally so it can be used
//without querying database
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const storedData = await AsyncStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

//Inputs: None
//Ouputs: None
//Function removes the locally stored copy of user data.
export const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };