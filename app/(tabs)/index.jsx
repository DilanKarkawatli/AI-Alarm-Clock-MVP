/*
 * Main page to handle alarm scheduling via communication with native code through "AlarmSetter.jsx"
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import Onboarding from '../../components/Onboarding';
import MainApp from './MainApp';
import OnboardingScreen from './OnboardingScreen';

export default function App() {
	// #### ONBOARDING: Controls which screen is shown ####
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [loading, setLoading] = useState(true);

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

	const handleOnboardingSubmit = async ({ name, email, goal }) =>  {
		// await AsyncStorage.setItem('user_data', 'true');
		await AsyncStorage.setItem('user_data', JSON.stringify({ name, email, goal }));

		// Hide onboarding
		setShowOnboarding(false);
	}

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