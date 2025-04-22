import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserData } from "@/contexts/UserContext";

// THEMES
// DEFAULT THEME
const defaultTheme = {
  bgPrimary: "#f1f3de",
  bgSecondary: "#C2CFA0",
  bgTertiary: "#C2CFA0",
  bgQuaternary: "#9ba77d",
  bgDropdown: "#f0f7d7",
  cancel: "#d6a47c",
  button3: "#e2d98b",
  text: "#394022E6",
  textDark: "#394022",
  textLight: "#394022CC",
  textInput: "#394022CC",
  textPlaceholder: "#39402266",
  borderInput: "#656E4A",
  borderLight: "#656E4A80",
  shadow: "#555",
  shadowLight: "#777",
  graphStart: "#C2CFA0",
  graphEnd: "#f4fadf",
  graphLine: "#f8ffe3",
  graphStroke: "#b0be8b",
  graphStrokeMain: "#9ba77d",
  mode: "light"
};

// Dark THEME
const darkTheme = {
  bgPrimary: "#2E3224",         
  bgSecondary: "#3E4431",       
  bgTertiary: "#4A5240",        
  bgQuaternary: "#5A6350",      
  bgDropdown: "#3A3F2F",        

  cancel: "#a86450",            
  button3: "#c9bc66",           

  text: "#f4fadf",              
  textDark: "#f1f3de",          
  textLight: "#f4fadfcc",       
  textInput: "#f4fadfcc",
  textPlaceholder: "#f4fadf66", 

  borderInput: "#8a9772",       
  borderLight: "#8a977280",     

  shadow: "#111",               
  shadowLight: "#333",          

  graphStart: "#5a6350",        
  graphEnd: "#3E4431",          
  graphLine: "#8a9772",         
  graphStroke: "#a1b484",       
  graphStrokeMain: "#c2cfa0",
  mode: "dark",   
};

// STRENGTH THEME
const strengthTheme = {
  ...defaultTheme,
  // bgPrimary: "#221f22",
  bgPrimary: "#262629",
  // bgPrimary: "#2a2a2d",
  // bgPrimary: "#303033",
  // bgPrimary: "#55565a",
  // bgPrimary: "#a4a4a8",
  // bgPrimary: "#afafb0",
  // bgPrimary: "#b5b5b9",
  // bgPrimary: "#e2e3e6",
  bgSecondary: "#b5b5b9",
  bgTertiary: "#b5b5b9",
  bgQuaternary: "#b5b5b9",
  bgDropdown: "#e2e3e6",
  cancel: "#d6a47c",
  button3: "#e2d98b",
  // textDark: "#861f22",
  textDark: "#962427",
  text: "#962427e6",
  textLight: "#962427cc",
  textInput: "#962427cc",
  textPlaceholder: "#96242766",
  // borderInput: "#7f4143",
  borderInput: "#833134",
  borderLight: "#83313480",
  shadow: "#555",
  shadowLight: "#777",
  graphStart: "#a46b6d",
  graphEnd: "#f0e7e7",
  graphLine: "#ffe3e3",
  graphStroke: "#b06b6e",
  graphStrokeMain: "#8f474a",
  mode: "dark" 
};

const vitalityTheme = {
  ...defaultTheme,
  bgPrimary: "#262629",
  bgSecondary: "#b5b5b9",
  bgTertiary: "#b5b5b9",
  bgQuaternary: "#b5b5b9",
  bgDropdown: "#e2e3e6",
  cancel: "#d6a47c",
  button3: "#e2d98b",
  // textDark: "#3893b0",
  textDark: "#247d9a",
  text: "#247d9a",
  textLight: "#247d9acc",
  textInput: "#247d9acc",
  textPlaceholder: "#247d9a66",
  borderInput: "#2b6881",
  borderLight: "#2b688180",
  shadow: "#555",
  shadowLight: "#777",
  graphStart: "#6b89a4",
  graphEnd: "#e7ebf0",
  graphLine: "#e3f1ff",
  graphStroke: "#6a94b0",
  graphStrokeMain: "#47708f",
  mode: "dark" 
};
const agilityTheme = {
  ...defaultTheme,
  bgPrimary: "#262629",
  bgSecondary: "#b5b5b9",
  bgTertiary: "#b5b5b9",
  bgQuaternary: "#b5b5b9",
  bgDropdown: "#e2e3e6",
  cancel: "#d6a47c",
  button3: "#e2d98b",
  // textDark: "#167734",
  // textDark: "#58921e",
  textDark: "#456d00",
  text: "#456d00",
  textLight: "#456d00cc",
  textInput: "#456d00cc",
  textPlaceholder: "#456d0066",
  // borderInput: "#2e643e",
  borderInput: "#48642d",
  borderLight: "#48642d99", // 60%
  shadow: "#555",
  shadowLight: "#777",
  graphStart: "#8da46b",
  graphEnd: "#f3f6f0",
  graphLine: "#f3ffe3",
  graphStroke: "#859e64",
  graphStrokeMain: "#708f47",
  mode: "dark" 
};
const intelligenceTheme = {
  ...defaultTheme,
  bgPrimary: "#262629",
  bgSecondary: "#b5b5b9",
  bgTertiary: "#b5b5b9",
  bgQuaternary: "#b5b5b9",
  bgDropdown: "#e2e3e6",
  cancel: "#d6a47c",
  button3: "#e2d98b",
  // textDark: "#6d128f",
  // textDark: "#7e448a",
  // textDark: "#824092",
  textDark: "#824092",
  text: "#824092",
  textLight: "#824092cc",
  textInput: "#824092cc",
  textPlaceholder: "#82409266",
  borderInput: "#673273",
  borderLight: "#67327380",
  shadow: "#555",
  shadowLight: "#777",
  graphStart: "#8b6494",
  graphEnd: "#efe7f0",
  graphLine: "#fce3ff",
  graphStroke: "#9d65aa",
  graphStrokeMain: "#81478f",
  mode: "dark" 
};
const charismaTheme = {
  ...defaultTheme,
  // bgPrimary: "#ffe292",
  bgPrimary: "#262629",
  bgSecondary: "#b5b5b9",
  bgTertiary: "#b5b5b9",
  bgQuaternary: "#b5b5b9",
  bgDropdown: "#e2e3e6",
  cancel: "#d6a47c",
  button3: "#e2d98b",
  // textDark: "#8b7c39",
  // textDark: "#857126",
  // textDark: "#816c2f",
  textDark: "#816c2f",
  text: "#816c2fe6",
  textLight: "#816c2fcc",
  textInput: "#816c2fcc",
  textPlaceholder: "#816c2f66",
  // borderInput: "#5c5221",
  borderInput: "#60522b",
  borderLight: "#60522b99",
  shadow: "#555",
  shadowLight: "#777",
  graphStart: "#9a8646",
  graphEnd: "#f0ede7",
  graphLine: "#fff5e3",
  graphStroke: "#bfac66",
  graphStrokeMain: "#a89346",
  mode: "dark" 
};

const adventurerTheme = {
  bgPrimary: "#eaf3fb",         
  bgSecondary: "#bfd7ea",       
  bgTertiary: "#bfd7ea",        
  bgQuaternary: "#96b7d6",      
  bgDropdown: "#dcebf7",

  cancel: "#e2a8a8",            
  button3: "#b6d4f0",           

  text: "#2b3c50e6",            
  textDark: "#2b3c50",          
  textLight: "#2b3c50cc",       
  textInput: "#2b3c50cc",
  textPlaceholder: "#2b3c5066", 

  borderInput: "#5e7897",       
  borderLight: "#5e789780",

  shadow: "#4a5d75",            
  shadowLight: "#6d8199",       

  graphStart: "#bfd7ea",        
  graphEnd: "#f1f8ff",          
  graphLine: "#d4e6f5",         
  graphStroke: "#a4c5e4",       
  graphStrokeMain: "#7baad1",   
  mode: "light",
};

const heroicTheme = {
  bgPrimary: "#fbeeee",         
  bgSecondary: "#e7b6b6",       
  bgTertiary: "#e7b6b6",        
  bgQuaternary: "#d98b8b",      
  bgDropdown: "#f9dede",        

  cancel: "#a57b7b",            
  button3: "#f3c4c4",          

  text: "#4d2e2ee6",            
  textDark: "#4d2e2e",          
  textLight: "#4d2e2ecc",       
  textInput: "#4d2e2ecc",
  textPlaceholder: "#4d2e2e66", 

  borderInput: "#7e4b4b",       
  borderLight: "#7e4b4b80",

  shadow: "#5c3a3a",            
  shadowLight: "#8a5e5e",

  graphStart: "#e7b6b6",        
  graphEnd: "#fdecec",          
  graphLine: "#f7d4d4",         
  graphStroke: "#d49a9a",       
  graphStrokeMain: "#c77e7e",   
  mode: "light"
};

const lordTheme = {
  bgPrimary: "#f3efff",         
  bgSecondary: "#c8b7e6",       
  bgTertiary: "#c8b7e6",        
  bgQuaternary: "#a98dd1",      
  bgDropdown: "#eae2f9",        

  cancel: "#b69fc9",            
  button3: "#d7c6f1",           

  text: "#3b2f4fe6",            
  textDark: "#3b2f4f",          
  textLight: "#3b2f4fcc",       
  textInput: "#3b2f4fcc",
  textPlaceholder: "#3b2f4f66", 

  borderInput: "#715c99",       
  borderLight: "#715c9980",

  shadow: "#4e3a66",            
  shadowLight: "#766298",

  graphStart: "#c8b7e6",        
  graphEnd: "#f5f2ff",          
  graphLine: "#ede3ff",         
  graphStroke: "#b59bdc",       
  graphStrokeMain: "#a78cd1",  
  mode: "light"
};

const overlordTheme = {
  bgPrimary: "#FF6F61",         
  bgSecondary: "#FF9E2C",       
  bgTertiary: "#D87A2D",        
  bgQuaternary: "#AB5E3C",      
  bgDropdown: "#F8C3A4",        

  cancel: "#F26522",            
  button3: "#FFB347",           
  text: "#3E1C1D",              
  textDark: "#1F1A17",          
  textLight: "#9E6A5A",         
  textInput: "#F5E2C8",         
  textPlaceholder: "#7F5A4A",   

  borderInput: "#FF9F43",       
  borderLight: "#FFB08C",       

  shadow: "#8B3D2F",            
  shadowLight: "#F1C2A3",       

  graphStart: "#FF6A00",        
  graphEnd: "#FBC04D",          
  graphLine: "#D65A31",         
  graphStroke: "#FF7E2D",       
  graphStrokeMain: "#FF9E2C",
  mode: "light"
};

const demigodTheme = {
  bgPrimary: "#0D1A1F",         
  bgSecondary: "#3A2D6F",       
  bgTertiary: "#5A4383",        
  bgQuaternary: "#3F4E56",      
  bgDropdown: "#2C4F55",        

  cancel: "#8B2C4A",            
  button3: "#4F8D95",           
  text: "#F4B56B",              
  textDark: "#D78C4E",           
  textLight: "#E0A64B",          
  textInput: "#C88C55",
  textPlaceholder: "#A1C1D3",   

  borderInput: "#6A4C8C",       
  borderLight: "#7C5C88",      

  shadow: "#1C1E23",            
  shadowLight: "#8D6D8D",       

  graphStart: "#8E9DCD",        
  graphEnd: "#4D6E7C",          
  graphLine: "#6A4C9C",         
  graphStroke: "#A1C1D9",       
  graphStrokeMain: "#5A3F74",
  mode: "dark"
};



const getTheme = (themeName: string) => {
  switch (themeName) {
    case "Strength":
      return strengthTheme;
    case "Vitality":
      return vitalityTheme;
    case "Agility":
      return agilityTheme;
    case "Intelligence":
      return intelligenceTheme;
    case "Charisma":
      return charismaTheme;
    case "Dark":
      return darkTheme;
    case "Adventurer":
      return adventurerTheme;
    case "Heroic":
      return heroicTheme;
    case "Lord":
      return lordTheme;
    case "Overlord":
      return overlordTheme;
    case "Demigod":
      return demigodTheme;
    case "Default":
    default:
      return defaultTheme;
  }
};

const currentTheme = createContext(defaultTheme);

export const ThemeContext = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useUserData();
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    if (userData?.theme) {
      const selectedTheme = getTheme(userData.theme);
      setTheme(selectedTheme);
    }
  }, [userData?.theme]);

  return (
    <currentTheme.Provider value={theme}>{children}</currentTheme.Provider>
  );
};

export const useTheme = () => useContext(currentTheme);
