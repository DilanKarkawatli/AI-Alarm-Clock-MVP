/*
 * Handles screen for changing the wake reason in the app
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { profileTemplate } from '../../data/profileTemplate';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WakeReason() {
	const router = useRouter();
	const [profile, setProfile] = useState(profileTemplate)
	const [savedGoal, setSavedGoal] = useState("");

	const handleChange = (text) => {
		setProfile(prev => ({
			...prev,
			wakeReason: text
		}))
	}

	const saveProfile = async () => {
		try {
			const userDataRaw = await AsyncStorage.getItem('user_data');
			const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

			const updatedProfile = {
				...userData,
				goal: profile.wakeReason,
			}
			
			await AsyncStorage.setItem('user_data', JSON.stringify(updatedProfile));
			setSavedGoal(updatedProfile.goal || '');
			console.log('Profile saved successfully:', updatedProfile);
		} catch (error) {
			console.error('Error saving profile:', error);
		}
	}

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const saved = await AsyncStorage.getItem('user_data');
				if (!saved) return;

				const parsed = JSON.parse(saved)
				const goalText = parsed.goal || '';

				setProfile(prev => ({
					...prev,
					wakeReason : goalText || ''}));
				setSavedGoal(goalText || '');
				} catch (error) {
				console.error('Error loading saved voice:', error);
			}
		}

		loadProfile();
	}, []);

	return (
		<LinearGradient 
		colors={["#ffffff", "#fff0d9"]}
		style={styles.container}
		>
			<Text style={styles.titleText}>Change your Goal</Text>

			<LinearGradient 
				style={styles.goalBox}
				colors={["#ffffff", "#e6e6e6"]}
			>
				<Text style={styles.goalTitle}>Goal:</Text> 
				
				<Text style={styles.goalText}>
					{savedGoal || "You haven't set a goal yet"}
				</Text>
			</LinearGradient>

			<TextInput
				style={styles.input}
				placeholder="Let the AI know what you want to accomplish"
				value={profile.wakeReason}
				onChangeText={handleChange}
				multiline
			/>

			<Pressable
				style={({ pressed }) => [
					styles.buttonWrapper,
					pressed && styles.buttonPressed,
				]}
				onPress={() => {
					saveProfile();
					router.back();
				}
				}
			>
				<LinearGradient
					colors={["#ffbf84", "#ff5900"]}
					end={{ x: 0.5, y: 1}}
					start={{ x: 0.5, y: 0}}
					style={styles.button}
				>
					<Text style={styles.buttonText}>Save</Text>
				</LinearGradient>
			</Pressable>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 30,
		paddingTop: 80,
		backgroundColor: '#f2f2f2',
	},
	titleText: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	input: {
		backgroundColor: '#ffffff',
		borderRadius: 10,
		padding: 15,
		fontSize: 12,
		minHeight: 220,
		textAlignVertical: 'top',
		marginBottom: 25,
	},
	buttonWrapper: {
		borderRadius: 20,
		elevation: 10,
	},
	button: {
		paddingVertical: 15,
		borderRadius: 10,
		width: '100%',
		alignItems: 'center',
	},
	buttonPressed: {
		transform: [{ scale: 0.97 }],
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	goalBox: {
		marginBottom: 30,
		backgroundColor: '#f2f2f2',
		padding: 20,
		borderRadius: 15,
		borderLeftWidth: 5,
		borderLeftColor: 'gray',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},

	goalTitle: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 10,
		color: '#666',
	},

	goalText: {
		fontSize: 12,
		fontWeight: '300',
		color: '#333',
		fontWeight: 'thin',
	},
})