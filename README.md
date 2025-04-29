Team info

Group name: Group 7
Groupmate names: Connor Brhely, Dillan Smith, Henry Ritchie, Ishika Patel, Magan Greenfield
Preferred communication: email writchie@uwm.edu
Overview
The RPG LIFE app helps a user (anyone in the community) with organization and motivation toward task completion, self-improvement, and skill learning through RPG gaming elements.  It gives a user a way to organize quests, skills, and achievements that they earn while they progress their character’s level.  The app also provides a user motivation via a rewards system.  A user earns XP by completing quests and when they level up, a reward is given.

Access Instructions

Go to https://nodejs.org/ and download the LTS version 
Go to https://code.visualstudio.com/download and download for your platform
Once Node.js is installed, run the following commands in Command Prompt/device terminal:
node -v
npm -v
Once those commands have completed, run this command in Command Prompt:
npm install --global yarn
Once those commands have completed, run this command in Command Prompt:
npm install --global expo-cli

In VSCode, select Clone Git Repository and use this link in the URL section:
https://github.com/writchie2/RPGLife.git 
Optionally, go to https://github.com/writchie2/RPGLife to download the repository as a zip file. Unzip the file into a folder. Open VSCode and select file -> open folder. Choose folder “RPGLife” that was unzipped. 

Once open, in VSCode select Terminal -> New Terminal. 
In the terminal that appears at the bottom, run the command:
yarn
While that is installing dependencies, go on a smartphone and install the app called “Expo Go”. You will need to create an account for it to work. 
Back on your computer, once the yarn command has finished, run the command: 
npx expo start
Once that command has completed, a QR code should appear in the terminal. Once you have created an account and logged in to Expo Go, go to your camera app and scan the QR code. The link will open Expo Go and begin running our application on your phone

Required Test Scenarios
1.	Create an account
2.	Create a skill
3.	Create a quest that is not repeatable
4.	Create a quest that is repeatable
5.	Edit the info on both created skills and quests
6.	Complete the quest 

Optional Test Scenarios
1.	Create a quest (not repeatable) that is due on the current date. Do not complete it. Log in the next day and confirm that you lost exp. 
2.	In settings, select Tester Mode. This will unlock all avatars, titles, and themes. 
3.	Complete enough quests to level up skills and traits and view the level up message
4.	Complete a variety of skills and view your statistics in the character screen 
5.	View your achievements in the achievement screen 
6.	Change your username
7.	Reset your password


