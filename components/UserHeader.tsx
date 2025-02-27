import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import colors from "@/constants/colors";
import { router } from "expo-router";
import { auth } from '../FirebaseConfig';
import { useState } from "react";
import NavigationModal from './NavigationModal';
import { useUserData } from '@/contexts/UserContext';

interface UserHeaderProps {

}

const UserHeader: React.FC<UserHeaderProps> = ({

}) => {
    const userData = useUserData();
    const [navVisible, setNavVisible] = useState(false);
    return (
        <View style={styles.container}>
            <NavigationModal visible={navVisible} onClose={() => setNavVisible(false)}>
            </NavigationModal>
            <Image
                style={styles.avatar}
                source={require("../assets/images/RPGiconLine-sm.png")}
            />
            <View style={styles.userInfo}>
                <Text style={styles.username}>{userData?.username}</Text>
                <Text>Progress Bar (TO DO)</Text>
                <Text style={styles.level}>Level {Math.floor((userData?.exp || 1)/ 100)}</Text>
                <Text style={styles.experience}>{(userData?.exp || 0) % 100} exp</Text>
            </View>
            <TouchableOpacity style={styles.iconButton} onPress={() => alert("Need to implement")}>
                <Text style={styles.iconButtonText}>★</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={() => setNavVisible(true)}>
                <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 60,
        backgroundColor: "#c2c8a0",
        padding: 10,
        borderRadius: 10,
        width:"90%",
    },
    avatar: {
        width: 50,
        height: 50,
        backgroundColor: "#e4e7d1",
        borderRadius: 25,
        marginRight: 10,
    },
    userInfo: {
        
    },
    username: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4a503d",
    },
    level: {
        fontSize: 14,
        color: "#4a503d",
    },
    experience: {
        fontSize: 14,
        color: "#4a503d",
    },
    iconButton: {
        position: "absolute",
        top: 20,
        right: 60,
        backgroundColor: "#e4e7d1",
        padding: 10,
        borderRadius: 20,
    },
    iconButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4a503d",
    },
    menuButton: {
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "#e4e7d1",
        padding: 10,
        borderRadius: 20,
    },
    menuButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4a503d",
    },

});

export default UserHeader;