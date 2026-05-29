/*
 * Main page to handle alarm scheduling via communication with native code through "AlarmSetter.jsx"
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer } from 'expo-audio';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale } from 'react-native-size-matters';
import AlarmSetter from '../../components/AlarmSetter';
import AnalogClock from '../../components/AnalogClock';
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
    <LinearGradient 
		style={styles.container}
		colors={["#fcefe7", "#ffeadc"]}
		>
		<View style={styles.topSection}>

			{wakeTime && (
				<Text style={styles.wakeTimeText}>
					{wakeTime}
				</Text>
			)}

			<Pressable onLongPress={() => setTimerVisible(true)}>
				{/* <Image 
					style={styles.image} 
					source={require('../../assets/images/clock-icon-1.png')}
				/> */}
				<AnalogClock style={styles.clock} />
			</Pressable>

			<Text style={styles.holdText}> Hold to set time </Text>
		</View>
		<View style={styles.bottomSection}>

			<Pressable
				style={({ pressed }) => [
					styles.buttonWrapper,
					pressed && styles.buttonPressed
				]}

				onPress={() => router.push('/choose-voice')}
			>

				<LinearGradient
					colors={["#ffbf84", "#ff5900"]}
					end={{ x: 0.5, y: 1}}
					start={{ x: 0.5, y: 0}}
					style={styles.buttonVoice}
				>
					<Text style={styles.buttonTextVoice}>Choose Voice</Text>
				</LinearGradient>
			</Pressable>
			
			<Pressable
				style={({ pressed }) => [
					styles.buttonWrapper,
					pressed && styles.buttonPressed
				]}

				onPress={() => router.push('/wake-reason')}>


				<LinearGradient
					style={styles.buttonWakeUp}
					colors={["#f3e7db", "#fcf3eb"]}
					end={{ x: 0.5, y: 1}}
					start={{ x: 0.5, y: 0}}
				
				>
					<Text style={styles.buttonTextWakeUp}>Your Goal</Text>
				</LinearGradient>
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
			<LinearGradient 
				colors={["#fcefe7", "#ffeadc"]}
				style={styles.modalContent}
			>
				<Text style={styles.modalTitle}>Alarm Clock</Text>
				<AlarmSetter 
					onAlarmChange={loadWakeTime}
					onClose={() => setTimerVisible(false)}
				/>
			</LinearGradient>
		</View>
	  </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
	// #### Structure Components
	container: {
		flex: 1,
		backgroundColor: '#f2f2f2',
	},
	topSection: {
		marginTop: screenWidth * 0.32,
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
	},
	bottomSection: {
		paddingVertical: 50,
		flex: 2,
		marginTop: screenWidth * 0.2,
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	image: {
		width: screenWidth * 0.65,
		height: screenWidth * 0.65,
		resizeMode: 'contain',
		marginBottom: 10,
		borderRadius: 100,
	},

	// #### Buttons
	buttonWrapper: {
		borderRadius: 20,
		marginBottom: 15,

		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.25,
		shadowRadius: 12,

		elevation: 14,
	},
	buttonVoice: {
		paddingVertical: screenWidth * 0.035,
		paddingHorizontal: 30,
		borderRadius: 18,
		alignItems: 'center',
		width: screenWidth * 0.65, //'100%',
	},
	buttonWakeUp: {
		paddingVertical: screenWidth * 0.035, // 15
		paddingHorizontal: 30,
		borderRadius: 18,
		width: screenWidth * 0.65, //'100%',
		alignItems: 'center',
	},
	buttonPressed: {
		transform: [{ scale: 0.97 }],
	},

	// #### Text
	buttonTextVoice: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	buttonTextWakeUp: {
		color: 'black',
		fontSize: 16,
		fontWeight: 'bold',
	},
	holdText: {
		fontSize: 14,
		fontWeight: 'italic',
		color: '#999999',
		marginTop: 24,
	},
	onboarding: {
		align: "center",
		verticalPadding: 50
	},
	buttonDev: {
		align: 'center',
	},
	wakeTimeText: {
		fontSize: moderateScale(70), //100
		fontWeight: '500',
		color: '#1f1e1e',
		paddingVertical: 20,
		resizeMode: "contain",
	},

	//#### Modal
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(126, 126, 126, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		width: '80%',
		backgroundColor: 'white',
		borderRadius: 20,
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
})