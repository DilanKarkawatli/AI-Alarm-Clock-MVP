/*
 * Main page to handle alarm scheduling via communication with native code through "AlarmSetter.jsx"
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer } from 'expo-audio';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import AlarmSetter from '../../components/AlarmSetter';
import { voices } from '../../data/voices';

const screenWidth = Dimensions.get('window').width;

export default function MainApp() {
	const [wakeTime, setWakeTime] = useState(null);
	const router = useRouter();
	const [timerVisible, setTimerVisible] = useState(false);

	// #### ONBOARDING ####

	const [showOnboarding, setShowOnboarding] = useState(false);
	const [checkingOnboarding, setCheckingOnboarding] = useState(true);

	useEffect(() => {
	(async () => {
		const done = await AsyncStorage.getItem('user_data');
		setShowOnboarding(!done);
		setCheckingOnboarding(false);
	})();
	}, []);

	const handleOnboardingSubmit = async ({ name, email, goal }) =>  {
		// await AsyncStorage.setItem('user_data', 'true');
		await AsyncStorage.setItem('user_data', JSON.stringify({ name, email, goal }));

		setShowOnboarding(false);
	}

	const resetOnboarding = async () => {
		try {
			await AsyncStorage.removeItem('user_data');
			console.log('Onboarding reset successfully');
		} catch (error) {
			console.error("Failed to reset onboarding:", error);
		}
	};

	const loadWakeTime = async () => {
		const saved = await AsyncStorage.getItem('wakeTime');

		if (saved) {
			const date = new Date(saved); // Convert ISO string -> Date

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

	useEffect(() => {
		const sub = Notifications.addNotificationReceivedListener(() => {
			console.log("NOTIFICATION RECEIVED");
			playSelectedVoice();      // start alarm sound immediately
			router.push('/alarm-ring'); // show alarm UI
		});

		return () => sub.remove();
	}, []);

	const playSelectedVoice = async () => {
		try {
			const savedVoiceId = await AsyncStorage.getItem('selectedVoice');

			const voice = voices.find(v => v.id === savedVoiceId);

			if (!voice) return;

			const player = createAudioPlayer(voice.sound);
			playerRef.current = player;

			await player.play();

		} catch (error) {
			console.error("Error playing selected voice:", error);
		}
  };

  return (
    <SafeAreaView style={styles.container}>
		
		<View style={styles.topSection}>

			{wakeTime && (
				<Text style={styles.wakeTimeText}>
					{wakeTime}
				</Text>
			)}
	  
			<Pressable onLongPress={() => setTimerVisible(true)}>
				<Image 
					style={styles.image} 
					source={require('../../assets/images/clock-icon-1.png')}
				/>
			</Pressable>

			<Text style={styles.holdText}> Hold to set time </Text>
		</View>
		<View style={styles.bottomSection}>

			<Pressable
				style={({ pressed }) => [
					styles.buttonVoice,
					pressed && styles.buttonVoicePressed
				]}

				// style={styles.buttonVoice}
				onPress={() => router.push('/choose-voice')}>
				<Text style={styles.buttonTextVoice}>Choose Voice</Text>
			</Pressable>
			
			<Pressable
				style={({ pressed }) => [
					styles.buttonWakeUp,
					pressed && styles.buttonWakeUpPressed
				]}

				// style={styles.buttonWakeUp}
				onPress={() => router.push('/wake-reason')}>
				<Text style={styles.buttonTextWakeUp}>Your Goal</Text>
			</Pressable>

			<Pressable style={styles.buttonDev} onPress={resetOnboarding}>
				<Text>Reset Onboarding (Dev)</Text>
			</Pressable>
		</View>

	  <Modal
	  	visible={timerVisible}
		animationType="fade"
		transparent={true}
		presentationStyle="overFullScreen"
	  >
		<View style={styles.modalOverlay}>
			<View style={styles.modalContent}>
				<Text style={styles.modalTitle}>Alarm Clock</Text>
				<AlarmSetter 
					onAlarmChange={loadWakeTime}
					onClose={() => setTimerVisible(false)}
				/>
			</View>
		</View>
	  </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f2f2f2',
		// justifyContent: 'center',
		// alignItems: 'center',
		// paddingHorizontal: 40,
	},

	// Top section
	topSection: {
		marginTop: screenWidth * 0.23,
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: screenWidth * 0.65,
		height: screenWidth * 0.65,
		resizeMode: 'contain',
		marginTop: 10,
		marginBottom: 10,
		borderRadius: 100,
	},
	// text: {
	// 	fontSize: 24,
	// 	fontWeight: 'bold',
	// 	marginBottom: 10,
	// 	fontStyle: 'italic',
	// 	textAlign: 'center',
	// 	color: '#808080',
	// },

	// Bottom section
	bottomSection: {
		paddingVertical: 40,
		flex: 2,
		marginTop: screenWidth * 0.2,
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	buttonVoice: {
		backgroundColor: '#DB6828',
		paddingVertical: screenWidth * 0.03, // 15
		paddingHorizontal: 30,
		borderRadius: 10,
		marginBottom: 20,
		width: screenWidth * 0.65, //'100%',
		alignItems: 'center',
	},
	buttonVoicePressed: {
		backgroundColor: '#d3530d',
		paddingVertical: screenWidth * 0.03, // 15
		paddingHorizontal: 30,
		borderRadius: 10,
		marginBottom: 20,
		width: screenWidth * 0.65, //'100%',
		alignItems: 'center',
	},
	buttonWakeUp: {
		backgroundColor: '#78736F',
		paddingVertical: screenWidth * 0.03, // 15
		paddingHorizontal: 30,
		borderRadius: 10,
		marginBottom: 20,
		width: screenWidth * 0.65, //'100%',
		alignItems: 'center',
	},
	buttonWakeUpPressed: {
		backgroundColor: '#635f5b',
		paddingVertical: screenWidth * 0.03, // 15
		paddingHorizontal: 30,
		borderRadius: 10,
		marginBottom: 20,
		width: screenWidth * 0.65, //'100%',
		alignItems: 'center',
	},
	buttonTextVoice: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	buttonTextWakeUp: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	holdText: {
		fontSize: 14,
		fontWeight: 'italic',
		color: '#8d8d8d',
		marginBottom: 20,
	},
	onboarding: {
		align: "center",
		verticalPadding: 50
	},
	buttonDev: {
		align: 'center',
	},


	// Modal
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(126, 126, 126, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		width: '80%',
		backgroundColor: 'white',
		borderRadius: 10,
		padding: 20,
		alignItems: 'center',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	closeButton: {
		marginTop: 30,
		backgroundColor: 'lightgray',
		padding: 10,
		borderRadius: 5,
		width: '100%',
		alignItems: 'center',
	},
	wakeTimeText: {
		fontSize: moderateScale(80), //100
		fontWeight: 'bold',
		color: '#808080',
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 5,
		paddingVertical: 20,
		resizeMode: "contain",
	},
})