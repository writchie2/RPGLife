import React, { useState } from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import colors from "@/constants/colors";
import { useUserData } from '@/contexts/UserContext';
import { Quest } from '@/utils/types';
import QuestsList from './QuestsList';


interface ReturnModalProps {
    visible: boolean;
    onClose: () => void; 
}

const ReturnModal: React.FC<ReturnModalProps> = ({
visible,
onClose,
}) => {
    const { userData, alterOverallEXP} = useUserData();



    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(now.getDate() + 7);

    let overdueQuests: Quest[] = (userData?.quests || []).filter((quest) => {
        const dueDate = quest.dueDate; 
        return quest.active && dueDate instanceof Date && dueDate.getTime() < now.setHours(0, 0, 0, 0);
    });

    let dueSoonQuests: Quest[] = (userData?.quests || []).filter((quest) => {
        const dueDate = quest.dueDate; 
        return (
            quest.active &&
            dueDate instanceof Date &&
            dueDate.getTime() >= now.setHours(0, 0, 0, 0) && 
            dueDate.getTime() <= sevenDaysLater.setHours(0, 0, 0, 0) 
        );
      });

    const calcQuestExpLoss = (quests: Quest[]): number => {
        
        const now = new Date();
        let totalOverdueDays = 0;
    
        quests.forEach((quest) => {
        const dueDate = quest.dueDate;
        if(!userData?.lastLogin) return -1;
        if(userData.lastLogin.getTime() < dueDate.getTime()){
            const overdueTime = now.getTime() - userData.lastLogin.getTime();
            const overdueDays = Math.floor(overdueTime / (1000 * 3600 * 24)); // Convert time to days
            
            // Ensure overdue days are positive, i.e., quest is overdue
            if (overdueDays > 0) {
                totalOverdueDays += overdueDays;
            }
        } 
        else {
            const overdueTime = now.getTime() - dueDate.getTime();
            const overdueDays = Math.floor(overdueTime / (1000 * 3600 * 24)); // Convert time to days
            
            // Ensure overdue days are positive, i.e., quest is overdue
            if (overdueDays > 0) {
                totalOverdueDays += overdueDays;
            }
        }
            
        
        });
    
        return totalOverdueDays * 100;
    };

    // To do, impliment Skill deterioration 
    const archivedSkills = (userData?.skills || []).filter((skill) => !skill.active);
    for (let skill of archivedSkills) {
        const { archiveDate, exp, id } = skill;
        if(!archiveDate || !userData?.lastLogin) return 0;
        const daysSinceArchived = Math.floor((userData.lastLogin?.getTime() - archiveDate?.getTime()) / (1000 * 60 * 60 * 24));
    }
    

    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Welcome back,</Text>
                        <Text style={styles.titleText}>{userData?.username}!</Text>
                    </View>
                    {(overdueQuests.length > 0) &&(
                    <View>
                        <Text style={styles.contentText}>You have {overdueQuests.length} {overdueQuests.length == 1? "quest": "quests"} overdue!</Text>
                        <Text style={styles.contentText}>You lost {calcQuestExpLoss(overdueQuests)} exp since your last login. Start completing those quests!</Text>
                        {/* Quests Section */}
                        <View style={styles.dropdownContainer}>
                            <View style={styles.section}>
                                <View style={styles.sectionTitleContainer}>
                                    <Text style={styles.sectionTitle}>Overdue Quests</Text>
                                </View>
                            </View>
                            <QuestsList
                            quests={userData?.quests || []}
                            mode="overdue"
                            />
                        </View>
                    </View>)}
                    {(overdueQuests.length <= 0) &&(
                    <View>
                        <Text style={styles.contentText}>Great job, you have no quests overdue!</Text>
                    </View>)}
                    
                    {(dueSoonQuests.length > 0) &&(
                    <View>
                        <View style={styles.dropdownContainer}>
                            <View style={styles.section}>
                                <View style={styles.sectionTitleContainer}>
                                    <Text style={styles.sectionTitle}>Quests Due Soon</Text>
                                </View>
                            </View>
                            <QuestsList
                            quests={dueSoonQuests}
                            mode="active"
                            />
                        </View>
                    </View>)}

                    {(dueSoonQuests.length <= 0) &&(
                    <View>
                        <Text style={styles.contentText}>You have no quests due soon.</Text>
                        <Text style={styles.contentText}>Better start making some!</Text>
                    </View>)}
                        
                    <Text style={styles.contentText}>Coming soon...</Text>
                    <Text style={styles.contentText}>Archived skills will lose exp too</Text>
                </ScrollView>
                <View style={styles.closeButtonContainer}>
                    <TouchableOpacity 
                        onPress={ () => {
                            // Lower skills of archived skills 
                            alterOverallEXP(-1 * calcQuestExpLoss(overdueQuests))
                            onClose();
                        }} 
                        style={styles.closeButton}>
                        <Text style={styles.icons}>close</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.0)', // Darkened background for modal
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: .8,
        width: '90%',
        backgroundColor: colors.bgPrimary,
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    scrollContainer: {
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    titleText: {
        fontFamily: 'Metamorphous_400Regular',
        fontSize: 30,
        color: colors.text,
    },
    contentText: {
        fontFamily: 'Alegreya_400Regular',
        fontSize: 18,
        color: colors.text,
        marginTop: 10,
        textAlign: 'center',
    },
    closeButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
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

    dropdownContainer: {
        position: "relative",
        // marginBottom: 20,
        marginBottom: 40, // need to increase to compensate for scrollContainer Top Padding, also looks better?
        pointerEvents: 'none'
      },
    section: {
        zIndex: 1,
        backgroundColor: colors.bgTertiary,
        padding: 10,
        borderRadius: 8,
        height: 60,
        justifyContent: "center",
    },
    sectionTitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontFamily: "Metamorphous_400Regular",
        fontSize: 24,
        color: colors.text,
    },
    titleContainer: {
        //backgroundColor: colors.bgTertiary,
        // width: "100%",
        // justifyContent: "center",
        alignItems: "center",
        padding: 18,
        borderRadius: 10,
      },
});
export default ReturnModal;