// Default stuff
const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

// Backgrounds
// const bgMain = "#f1f3de";
// const bgMain = "#e7ecda";
// const bgPrimary = "#E4EAD6";
// const bgPrimary = "#e7ecda"; // 10% lighter (make dropdown and go with lighter color, make tertiary = secondary?)
const bgPrimary = "#f1f3de"; // even lighter
const bgSecondary = "#C2CFA0";
// const bgTertiary = "#C2C8A0"; // test lighter
// const bgTertiary = "#8E9970E6"; // 90% oppacity
// const bgTertiary = "#8E9970CC"; // 80% oppacity
// const bgTertiary = "#99a47a"; // color droppered to get color w/o opacity
// const bgTertiary = "#99a67e"; // Test
 const bgQuaternary = "#9ba77d"; // Best?! - Using this to test add Skill. I like it - Henry
const bgTertiary = "#C2CFA0"; // Secondary
// const bgDropdown = "#C2CFA0";
// const bgDropdown = "#C9D5AB";
// const bgDropdown = "#eaf3d3";
const bgDropdown = "#f0f7d7";
const cancel = "#BA6E6E";

// Text
const text = "#394022E6"; // 90% opacity
const textDark = "#394022";
const textLight = "#394022CC"; // 80% opacity

// Input fields
const textInput = "#394022CC";
// const textPlaceholder = "#39402260"; // ~38% opacity
const textPlaceholder = "#39402266"; // 40% opacity

// Borders
const borderInput = "#656E4A";
const borderLight = "#656E4A80"; // 50% opacity

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
  // bgMain,
  bgPrimary,
  bgSecondary,
  bgTertiary,
  bgQuaternary,
  bgDropdown,
  cancel,
  // Text:
  text,
  textDark,
  textLight,
  // Input fields:
  textInput,
  textPlaceholder,
  // Borders:
  borderInput,
  borderLight,
  // Shadows:
  shadow,
  shadowLight,
};
