// Default stuff
const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

// Backgrounds
// const bgPrimary = "#E4EAD6";
const bgPrimary = "#e7ecda"; // 10% lighter
const bgSecondary = "#C2CFA0";

// Text
const text = "#394022E6"; // 90% opacity
const textDark = "#394022";
const textLight = "#394022CC"; // 80% opacity

// Input fields
const textInput = "#394022CC";
// const textPlaceholder = "#39402260"; // ~38% opacity
const textPlaceholder = "#39402266"; // 40% opacity
const borderInput = "#656E4A";

// Shadows
const shadow = "#555";
const shadowLight = "#777";

export default {
  // Default stuff
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
  // Backgrounds:
  bgPrimary,
  bgSecondary,
  // Text:
  text,
  textDark,
  textLight,
  // Input fields:
  textInput,
  textPlaceholder,
  borderInput,
  // Shadows:
  shadow,
  shadowLight,
};
