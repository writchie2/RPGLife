import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import colors from "@/constants/colors";
import { router } from "expo-router";
import { auth } from "../FirebaseConfig";
import { useState } from "react";

interface NavigationModalProps {
  visible: boolean;
  onModalHide?: () => void;
  onClose: () => void;
}

const NavigationModal: React.FC<NavigationModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* TouchableWithoutFeedback to detect taps outside the modal. Also somewhat simulates slide to cancel for iOS. */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Image
                style={styles.logo}
                source={require("../assets/images/RPGiconLine-sm.png")}
              />
              {/* Home Button */}
              <TouchableOpacity
                style={[styles.navButton, { paddingTop: "0%" }]}
                onPress={() => {
                  router.push("/(main)");
                  setTimeout(() => {
                    onClose();
                  }, 100);
                }}
              >
                <Text style={styles.navButtonText}>Home</Text>
              </TouchableOpacity>

              {/* Character Button */}
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                  //router.push("/(main)/character");
                  setTimeout(() => {
                    onClose();
                  }, 100);
                }}
              >
                <Text style={styles.navButtonText}>Character</Text>
              </TouchableOpacity>

              {/* Skills Button */}
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                  router.push("/(main)/skills_main");
                  setTimeout(() => {
                    onClose();
                  }, 100);
                }}
              >
                <Text style={styles.navButtonText}>Skills</Text>
              </TouchableOpacity>

              {/* Quests Button */}
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                  router.push("/(main)/quests_main");
                  setTimeout(() => {
                    onClose();
                  }, 100);
                }}
              >
                <Text style={styles.navButtonText}>Quests</Text>
              </TouchableOpacity>

              {/* Achievements Button */}
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                  //router.push("/(main)/achievements");
                  setTimeout(() => {
                    onClose();
                  }, 100);
                }}
              >
                <Text style={styles.navButtonText}>Achievements</Text>
              </TouchableOpacity>

              {/* Settings Button */}
              <TouchableOpacity
                style={[styles.navButton, { borderTopWidth: 0 }]}
                onPress={() => {
                  router.push("/(main)/settings");
                  setTimeout(() => {
                    onClose();
                  }, 100);
                }}
              >
                <Text style={styles.navButtonText}>Settings</Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              {/* Signout Button */}
              <TouchableOpacity
                style={styles.signoutButton}
                onPress={() => {
                  auth.signOut();
                  router.replace("/(login)");
                  onClose();
                }}
              >
                <Text style={styles.signoutButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    // width: "90%",
    // height: "80%",
    // borderRadius: 10,
    width: "100%",
    height: "100%",
    backgroundColor: colors.bgPrimary,
    padding: 20,
    alignItems: "center",
  },
  navButton: {
    padding: "3%",
    marginTop: 0,
    backgroundColor: colors.bgPrimary,
    width: "100%",
    alignItems: "center",
    borderColor: colors.text,
    borderBottomWidth: 1,
  },
  navButtonText: {
    fontFamily: "Metamorphous_400Regular",
    fontSize: 42,
    color: colors.text,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.bgSecondary,
    width: 40,
    height: 40,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    //fontFamily: "Metamorphous_400Regular",
    // fontFamily: "Alegreya_400Regular",
    // fontFamily: "Alegreya_500Medium",
    color: colors.textDark,
    fontSize: 28,
  },
  signoutButton: {
    position: "absolute",
    width: "42%",
    bottom: 40,
    padding: 6,
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
  signoutButtonText: {
    fontFamily: "Metamorphous_400Regular",
    color: colors.textDark,
    fontSize: 20,
  },
  logo: {
    height: 150,
    resizeMode: "contain",
    width: "100%",
    marginTop: 4,
    marginBottom: 10,
    borderColor: colors.text,
    borderBottomWidth: 1,
  },
});

export default NavigationModal;
