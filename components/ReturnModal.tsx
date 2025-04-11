import React, { useState } from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import colors from "@/constants/colors";
import { useUserData } from '@/contexts/UserContext';
import { Quest, Skill } from '@/utils/types';
import QuestsList from './QuestsList';
import SkillsList from './SkillsList';


interface ReturnModalProps {
    visible: boolean;
    onClose: () => void; 
}

const ReturnModal: React.FC<ReturnModalProps> = ({
visible,
onClose,
}) => {
    const { userData, alterOverallEXP, deteriorateSkill} = useUserData();

    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(now.getDate() + 7);

    let overdueQuests: Quest[] = (userData?.quests || []).filter((quest) => {
        const dueDate = quest.dueDate; 
        return quest.active &&  Math.floor(dueDate.getTime() - now.setHours(0, 0, 0, 0)) > 0;
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

    const calcQuestDaysOverdue = (quests: Quest[]): number => {
        
        const now = new Date();
        let totalOverdueDays = 0;
    
        quests.forEach((quest) => {
        const dueDate = quest.dueDate;
        if(!userData?.lastLogin) return -1;
        if(userData.lastLogin.getTime() < dueDate.getTime()){
            const overdueTime = now.getTime() - userData.lastLogin.getTime();
            const overdueDays = Math.floor(overdueTime / (1000 * 3600 * 24));
            if (overdueDays > 0) {
                totalOverdueDays += overdueDays;
            }
        } 
        else {
            const overdueTime = now.getTime() - dueDate.getTime();
            const overdueDays = Math.floor(overdueTime / (1000 * 3600 * 24)); 
            if (overdueDays > 0) {
                totalOverdueDays += overdueDays;
            }
        }
        });
        return totalOverdueDays;
    };

    
    const deterioratedSkills = userData?.skills?.filter((skill) => {
        const { archiveDate, deteriorateCount } = skill;
      
        if (!archiveDate || !userData?.lastLogin) return false;
      
        const lastDeteriorateDate = new Date(archiveDate); 
        lastDeteriorateDate.setDate(lastDeteriorateDate.getDate() + 7 * (deteriorateCount || 0));
      
        const daysSinceLastDeteriorate = Math.floor(
          (userData.lastLogin.getTime() - lastDeteriorateDate.getTime()) / (1000 * 60 * 60 * 24)
        );
      
        return daysSinceLastDeteriorate >= 7;
      
      }) || []

        const handleDeterioration = (skills: Skill[]) => {
            skills.forEach((skill) => {
            const { archiveDate, deteriorateCount, id } = skill;
        
            if (!archiveDate || !userData?.lastLogin) return;
        
            const lastDeteriorateDate = new Date(archiveDate);
            lastDeteriorateDate.setDate(
                lastDeteriorateDate.getDate() + (7 * (deteriorateCount || 0))
            );
        
            const daysSinceLastDeteriorate = Math.floor(
                (userData.lastLogin.getTime() - lastDeteriorateDate.getTime()) / (1000 * 60 * 60 * 24)
            );
        
            const deteriorateNeeded = Math.floor(daysSinceLastDeteriorate / 7);
        
            if (deteriorateNeeded > 0) {
                deteriorateSkill(deteriorateNeeded, id);
            }
            });
        };

    

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
                    <View style={styles.contentContainer}>
                        <Text style={styles.contentText}>You have {overdueQuests.length} {overdueQuests.length == 1? "quest": "quests"} overdue!</Text>
                        <Text style={styles.contentText}>You lost {calcQuestDaysOverdue(overdueQuests) * 100} exp since your last login. Start completing those quests!</Text>
                        
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
                    <View style={styles.contentContainer}>
                        <Text style={styles.contentText}>Great job, you have no quests overdue!</Text>
                    </View>)}
                    
                    {(dueSoonQuests.length > 0) &&(
                    <View style={styles.contentContainer}>
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
                    <View style={styles.contentContainer}>
                        <Text style={styles.contentText}>You have no quests due soon.</Text>
                        <Text style={styles.contentText}>Better start making some!</Text>
                    </View>)}
                        
                    {(deterioratedSkills.length > 0) &&(
                    <View style={styles.contentContainer}>
                        <Text style={styles.contentText}>You have {deterioratedSkills.length} {deterioratedSkills.length == 1? "skill": "skills"} deteriorating!</Text>
                        <Text style={styles.contentText}>Skills lose 500 exp every week they are archived! Re-Activate them and start some quests!</Text>
                        <View style={styles.dropdownContainer}>
                            <View style={styles.section}>
                                <View style={styles.sectionTitleContainer}>
                                    <Text style={styles.sectionTitle}>Deteriorated Skills</Text>
                                </View>
                            </View>
                            <SkillsList
                            skills={userData?.skills || []}
                            mode="deteriorate"
                            />
                        </View>
                    </View>)}

                </ScrollView>
                <View style={styles.closeButtonContainer}>
                    <TouchableOpacity 
                        onPress={ () => {
                            handleDeterioration(deterioratedSkills);
                            alterOverallEXP(-100 * calcQuestDaysOverdue(overdueQuests))
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
    contentContainer: {
        marginTop:20,
        backgroundColor: colors.bgDropdown, 
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scrollContainer: {
        paddingTop: 20,
        //paddingHorizontal: 20,
        width: "100%"
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
        backgroundColor: colors.bgTertiary,
        width: "100%",
        // justifyContent: "center",
        alignItems: "center",
        padding: 18,
        borderRadius: 10,
      },
});
export default ReturnModal;