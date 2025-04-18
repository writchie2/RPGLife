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
