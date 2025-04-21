import React, { useState } from "react";
import { auth } from "@/FirebaseConfig";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext" // used for themes, replaces colors import
import { useUserData } from "@/contexts/UserContext";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, validatePassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface EditPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const colors = useTheme(); // used for themes, replaces colors import
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.1)", // Darkened background for modal
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      flex: 0.3,
      width: "90%",
      backgroundColor: colors.bgPrimary,
      borderRadius: 10,
      justifyContent: "space-between",
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    scrollContainer: {
      marginBottom: 20,
      alignItems: "center",
    },
    titleContainer: {
      backgroundColor: colors.bgTertiary,
      //width: "100%",
      //justifyContent: "center",
      alignItems: "center",
      padding: 18,
      borderRadius: 10,
      //marginBottom:"2%"
    },
    input: {
      marginTop: 20,
      padding: 12,
      backgroundColor: colors.bgDropdown,
      borderRadius: 10,
      fontSize: 18,
      fontFamily: "Alegreya_400Regular",
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.borderInput,
    },
    titleText: {
      fontFamily: "Metamorphous_400Regular",
      fontSize: 30,
      color: colors.text,
    },
    contentText: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.text,
      marginTop: 10,
      textAlign: "center",
    },
    closeButtonContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    closeButton: {
      width: 53,
      height: 53,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgSecondary,
      borderRadius: 100,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
    icons: {
      fontFamily: "MaterialIconsRound_400Regular",
      fontSize: 30,
      color: colors.text,
    },
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [verified, setVerified] = useState(false);

  const verifyHandler = async  () => {
    try {
    const user = auth.currentUser;
    if(!user){
      return;
    }
    const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
    await reauthenticateWithCredential(user, credential);
    } catch (error: any) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/missing-password") {
        Alert.alert("Password Incorrect", "If you don't know your password, logout and choose \"Reset Password\"")
        setCurrentPassword("");
        return;
        
      } else {
        Alert.alert("Something Went Wrong", "Please try again later. If problem persists, reach out to support.")
        console.log(error.code);
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
        setVerified(false);
        onClose();
        return;
      }
      
    }
    setVerified(true);
  };

  const changePasswordHandler = async  () => {
    const user = auth.currentUser
    if(!user){
      return;
    }

    if(newPassword !== newPasswordConfirm){
      Alert.alert("Passwords Do Not Match", "Try again or cancel")
      setNewPassword("");
      setNewPasswordConfirm("");
      return;
    }
    
    const status = await validatePassword(auth, newPassword);
    if (!status.isValid) {
      const needsLowerCase = status.containsLowercaseLetter !== true;
      const needsUpperCase = status.containsUppercaseLetter !== true;
      const needsNumericCase = status.containsNumericCharacter !== true;
      const needsSpecialCase = status.containsNonAlphanumericCharacter !== true;

      let errors = [];

      if (newPassword.length < 8) errors.push("at least 8 characters");
      if (needsUpperCase) errors.push("one uppercase letter");
      if (needsLowerCase) errors.push("one lowercase letter");
      if (needsNumericCase) errors.push("one number");
      if (needsSpecialCase) errors.push("one special character");

      const errorMessage =
        "Your password must contain " + errors.join(", ") + ".";
      Alert.alert("Error", errorMessage);
      setNewPassword("");
      setNewPasswordConfirm("");
      return;
    }
    try {
      await updatePassword(user, newPassword);
    } catch (error:any) {
      console.error("Password update failed:", error);
    }

    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setVerified(false);
    Alert.alert("Success", "Password Changed")
    onClose();
    return;

  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setCurrentPassword("");
          setNewPassword("");
          setNewPasswordConfirm("");
          setVerified(false);
          onClose();
        }}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
            {!verified &&(
              <View>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>Current Password</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password..."
                  placeholderTextColor={colors.textPlaceholder}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                />

                <View style={styles.closeButtonContainer}>
                  <TouchableOpacity
                    onPress={verifyHandler}
                    style={styles.closeButton}
                  >
                    <Text style={styles.icons}>login</Text>
                  </TouchableOpacity>
                </View>
              </View>)}

              {verified &&(
                <View>
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Change Password</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="New Password..."
                    placeholderTextColor={colors.textPlaceholder}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm..."
                    placeholderTextColor={colors.textPlaceholder}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={newPasswordConfirm}
                    onChangeText={setNewPasswordConfirm}
                    secureTextEntry
                  />

                  <View style={styles.closeButtonContainer}>
                    <TouchableOpacity
                      onPress={changePasswordHandler}
                      style={styles.closeButton}
                    >
                      <Text style={styles.icons}>save</Text>
                    </TouchableOpacity>
                  </View>
              </View>)}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditPasswordModal;
