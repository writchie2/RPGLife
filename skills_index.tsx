/*
simple skeleton of the skills page
that shows active skills and archived skills
TODO later date: design and make the page look pretty
*/

import React, { useState, useEffec } from "react";
import { View, Text, Button, StyleSheet, Pressable, ScrollViewBase, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from '../../FirebaseConfig';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { getAuth } from 'firebase/auth';

const SkillsPage = () => {
    const [skills, setSkills] = useState([
        { name: "Workout", level: 5, exp: "5100/6000", traits: "STR, VIT", archived: false },
        { name: "Running", level: 3, exp: "2700/3300", traits: "AGI, VIT", archived: false },
        { name: "React Native", level: 4, exp: "3300/4600", traits: "INT", archived: false },
        { name: "Web Development", level: 11, exp: "14825/16500", traits: "INT", archived: false },
        { name: "Drawing", level: 2, exp: "1200/2000", traits: "CHR", archived: true },
    ]);

    const editSkill = (index) => {
        const newName = prompt("Edit Skill Name:", skills[index].name);
        if (newName) {
            const updatedSkills = [...skills];
            updatedSkills[index].name = newName;
            setSkills(updatedSkills);
        }
    };

    const archiveSkill = (index) => {
        const updatedSkills = [...skills];
        updatedSkills[index].archived = !updatedSkills[index].archived;
        setSkills(updatedSkills);
    };

    const addSkill = () => {
        const skillName = prompt("Enter new skill name:");
        if (skillName) {
            setSkills([...skills, { name: skillName, level: 1, exp: "0/1000", traits: "N/A", archived: false }]);
        }
    };

    return (
        <div>
            <h2>Active Skills</h2>
            <div>
                {skills.filter(skill => !skill.archived).map((skill, index) => (
                    <div key={index} className="skill-item">
                        <p><strong>{skill.name}</strong> (Level {skill.level})</p>
                        <p>EXP: {skill.exp}</p>
                        <p>Traits: {skill.traits}</p>
                        <button onClick={() => editSkill(index)}>Edit</button>
                        <button onClick={() => archiveSkill(index)}>Archive</button>
                    </div>
                ))}
            </div>

            <h2>Archived Skills</h2>
            <div>
                {skills.filter(skill => skill.archived).map((skill, index) => (
                    <div key={index} className="skill-item">
                        <p><strong>{skill.name}</strong> (Level {skill.level})</p>
                        <p>EXP: {skill.exp}</p>
                        <p>Traits: {skill.traits}</p>
                        <button onClick={() => editSkill(index)}>Edit</button>
                        <button onClick={() => archiveSkill(index)}>Unarchive</button>
                    </div>
                ))}
            </div>

            <button onClick={addSkill}>Add Skill</button>
        </div>
    );
};

export default SkillsPage;