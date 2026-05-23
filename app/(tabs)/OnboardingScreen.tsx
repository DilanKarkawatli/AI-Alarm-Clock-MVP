// import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import GoalBox from '../../components/onboarding/GoalBox';
import NameBox from '../../components/onboarding/NameBox';
import NotificationComponent from '../../components/onboarding/NotificationComponent';
import ScrollVoice from '../../components/onboarding/ScrollVoice';
import TimeSet from '../../components/onboarding/TimeSet';
import { generateAlarmAudio, setAlarm } from '../../service/AlarmService';

// type == custom typescript datastructure blueprint
type User = {
	onDone: (data: {
		name: string;
		goal: string;
		wakeTime: string;
	}) => void;
};

// Custom skip button
const Skip = ({ ...props }) => (
	<TouchableOpacity style={styles.skipButton} {...props}>
		<Text style={styles.skipText}>Skip</Text>
	</TouchableOpacity>
);

// Begin button
const Begin = ({ ...props }) => (
	<TouchableOpacity style={styles.beginButton} {...props}>
		<Text style={styles.buttonText}>Begin</Text>
	</TouchableOpacity>
);

// "{ onDone }: User" tells onDone what typescript type it is
export default function OnboardingScreen({ onDone }: User) {
  const onboardingRef = useRef(null);

  return (
	<View style={styles.container}>
	  <Onboarding
	  		// ### CUSTOMIZATION ###
	  		showSkip
			showDone
			SkipButtonComponent={Skip}
			// DoneButtonComponent={Begin}
			// bottomBarHeight={0}
			bottomBarColor="#fff"
			showPagination={true}
			showNext={false}
			imageContainerStyles={{
				paddingBottom: 40,
			}}
			containerStyles={{
				paddingHorizontal: 24,
			}}
			titleStyles={{
				fontSize: 32,
				fontWeight: '700',
				color: '#111',
			}}
			subTitleStyles={{
				fontSize: 18,
				color: '#666',
			}}
	  		onSkip={() =>
					onDone({
						name: 'Friend',
						goal: 'Wake up earlier',
						wakeTime: ''
					})
			}
			onDone={() =>
				onDone({
					name: 'Friend',
					goal: 'Wake up earlier',
					wakeTime: ''
				})
			}
			ref={onboardingRef}
			pages={[
				{
					backgroundColor: '#ffffff',

					title: '', //'The way you wake up shapes your entire day'
					
					subtitle: '',

					image: (
						<View style={styles.customPage}>
							<Text style={styles.title}>
								The way you wake up shapes your entire day
							</Text>

							{/* 
							<Image
								style={styles.img3}
								source={require('../../assets/images/icon.png')}
							/> */}

							<TouchableOpacity 
								style={styles.beginButton}
								onPress={() => onboardingRef.current.goNext()}
							>
								<Text style={styles.beginText}>Begin</Text>
							</TouchableOpacity>
						</View>
					),
				},
				{
					backgroundColor: '#F2F2F2',
					image: (
						<View>
							<Text style={styles.title}>
								This is where your wake-up alarm begins
							</Text>

							<NameBox 
								onNext={() => onboardingRef.current.goNext()}
							/>
						</View>
					),
					title: '',
					subtitle: '',
				},
				{
					backgroundColor: '#F2F2F2',
					image: (
						<View>
							<Text style={styles.title}>
								What do you need to hear every morning?
							</Text>

							<GoalBox 
								onNext={() => onboardingRef.current.goNext()}
							/>
						</View>
					),
					title: '',
					subtitle: '',
				},
				{
					backgroundColor: '#F2F2F2',
					image: (
						<View>
							<Text style={styles.title}>
								Choose the voice that wakes you
							</Text>

							<ScrollVoice
								onNext={() => onboardingRef.current.goNext()}
							/>
						</View>
					),
					title: '',
					subtitle: '',
				},
				{
					backgroundColor: '#ffffff',
					image: (
						<View>
							<Text style={styles.title}>
								When does your day begin?
							</Text>

							<TimeSet
								onNext={async () => {
									const name = await AsyncStorage.getItem('username');
        							const goal = await AsyncStorage.getItem('goal');
        							const wakeTime = await AsyncStorage.getItem('wakeTime');

									await AsyncStorage.setItem(
										'user_data',
										JSON.stringify({ name, goal, wakeTime })
									);

									if (!wakeTime) {
										return 
									}

									const wakeTimeDate = new Date(wakeTime)
									
									// #### [] SET TIME (REPLACE ALARMSETTER)
									await generateAlarmAudio();
									await setAlarm(wakeTimeDate, false);

									// [] Make name & goal not null, i.e. store the values from onboarding, easy
									console.log(name)
									console.log(goal)
									console.log("Waketime passed through: ", wakeTime)
									
									onboardingRef.current.goNext()
								}}
							/>
						</View>
					),
					title: '',
					subtitle: '',
				},
				{
					backgroundColor: '#ffffff',
					image: (
						<View>
							<Text style={styles.title}>
								Your mornings will sound like this:
							</Text>

							{/* #### TO BE IMPLEMENTED #### */}

							<NotificationComponent
								onDone={async () => {
									const name = await AsyncStorage.getItem('username');
        							const goal = await AsyncStorage.getItem('goal');
        							const wakeTime = await AsyncStorage.getItem('wakeTime');

									// [] Make name & goal not null, i.e. store the values from onboarding, easy
									// console.log(name)
									// console.log(goal)
									// console.log("Waketime passed through: ", wakeTime)
									onDone({
										name: name || '',
										goal: goal || '',
										wakeTime: wakeTime || '',
									})
								}}
							/>
						</View>
					),
					title: '',
					subtitle: '',
				},
			]}
		/> 
	</View>
  )
}

const styles = StyleSheet.create({
	container: {
			flex: 1,
		},
	img: {
		width: '80%',
		height: 300,
		resizeMode: 'contain',
		marginBottom: 30
	},
	img2: {
		width: '80%',
		height: 300,
		borderRadius: 30,
		resizeMode: 'contain',
	},
	buttonContainer: {
		marginTop: 20,
		alignItems: 'center',
		gap: 12,
	},
	buttonText: {
		color: '#fff',
  		fontWeight: '700',
	},
	skipButton: {
		backgroundColor: '#6b6b6b',
		paddingVertical: 12,
		paddingHorizontal: 40,
		marginLeft: 10,
		borderRadius: 12,
	},
	skipText: {
		color: '#ffffff',
  		fontWeight: '700',
	},
	beginButton: {
		backgroundColor: '#ff7214',
		paddingVertical: 12,
		paddingHorizontal: 60,
		borderRadius: 12,
	},
	customPage: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},

	title: {
		fontSize: 30,
		fontWeight: '700',
		textAlign: 'center',
		paddingTop: 140,
		marginBottom: 40,
		color: '#111',
	},

	img3: {
		width: 200,
		height: 300,
		resizeMode: 'contain',
		marginBottom: 30,
	},

	beginText: {
		color: '#fff',
  		fontWeight: '700',
	},

	container_namebox: {
		backgroundColor: '#ffe7cc',
		padding: 24,
		borderRadius: 24,
		width: '90%',
		alignSelf: 'center',
	}
})