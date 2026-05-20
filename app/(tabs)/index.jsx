/*
 * Main page to handle alarm scheduling via communication with native code through "AlarmSetter.jsx"
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import Onboarding from '../../components/Onboarding';
// import { generateAlarmAudio, setAlarm } from '../../service/AlarmService';
import MainApp from './MainApp';
import OnboardingScreen from './OnboardingScreen';


export default function App() {
	// #### ONBOARDING: Controls which screen is shown ####
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [loading, setLoading] = useState(true);
	const [wakeTime, setWakeTime] = useState(null);
	const [timerVisible, setTimerVisible] = useState(false);

	const loadWakeTime = async () => {
		const wakeTime = await AsyncStorage.getItem('wakeTime');

		if (wakeTime) {
			const date = new Date(wakeTime)

			const formatted = date.toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
						hour12: false,
			})

			setWakeTime(formatted);

			} else {
				setWakeTime(null);
			}
		};

	useEffect(() => {
		loadWakeTime();
	}, []);

	// useEffect() runs when screen first loads
	useEffect(() => {
		checkOnboarding();
	}, []);

	const checkOnboarding = async () => {
		try {
			// Grabs variables to store user data 
			const userData = await AsyncStorage.getItem('user_data');

			// user_data starts with false
			setShowOnboarding(!userData)

		} catch (e) {
			console.e("Error checking onboarding:", e);

		} finally {
			setLoading(false);
		}
	}

	const handleOnboardingSubmit = async ({ name, goal, wakeTime }) => {
		try {
			console.log("SUBMIT DATA:", JSON.stringify({ name, goal, wakeTime }));


			await AsyncStorage.setItem(
				'user_data',
				JSON.stringify({ name, goal, wakeTime })
			);

			console.log("USER DATA SAVED");

			// const wakeTimeDate = new Date(wakeTime)

			// // #### [] SET TIME (REPLACE ALARMSETTER)
			// generateAlarmAudio();
			// setAlarm(wakeTimeDate);
			// // cancelAlarm();


			setShowOnboarding(false);

			console.log("SHOW ONBOARDING SET FALSE");

		} catch (e) {
			console.error("HANDLE SUBMIT ERROR:", e);
		}
	};

	const resetOnboarding = async () => {
		try {
			await AsyncStorage.removeItem('user_data');

			console.log('Onboarding reset successfully');

			// Show onboarding again
			setShowOnboarding(true);

		} catch (error) {
			console.error("Failed to reset onboarding:", error);
		}
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
			<Text style={styles.loadingText}>
				Loading...
			</Text>
			</View>
		);
	}

  return showOnboarding ? (
	<OnboardingScreen onDone={handleOnboardingSubmit} /> // onDone waits until OnboardingScreen is done, then uses 'handleOnboardingSubmit'
) : (
	// <>
	// <AlarmSetterFunctionality
	// 	onAlarmChange={loadWakeTime}
	// 	onClose={() => setTimerVisible(false)}
	// />
	// <MainApp />
	// </>
	<MainApp />
  )
}

const styles = StyleSheet.create({
	

	// Loading Screen
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	loadingText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
})