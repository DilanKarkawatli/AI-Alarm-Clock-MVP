// import { useFonts } from 'expo-font';
import React, { useRef } from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import GoalBox from '../../components/onboarding/GoalBox';
import NameBox from '../../components/onboarding/NameBox';

// const [fontsLoaded] = useFonts({
//     Poppins: require('./assets/fonts/Poppins-Regular.ttf'),
//     'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
//   });

// if (!fontsLoaded) {
// 	return null;
// }

// type == custom typescript datastructure blueprint
type User = {
	onDone: (data: {
		name: string;
		goal: string;
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
						name: 'Ryan',
						goal: 'Wake up earlier',
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
					backgroundColor: '#ffffff',

					image: <NameBox 
						onNext={() => onboardingRef.current.goNext()}
					/>,

					title: 'This is where your wake-up alarm begins.',

					subtitle: '',
				},
				{
					backgroundColor: '#ffffff',
					image: <GoalBox 
						onNext={() => onboardingRef.current.goNext()}
					/>,
					title: 'What do you need to hear every morning?',
					subtitle: '',
				},
				{
					backgroundColor: '#ffffff',
					image: <Image style={styles.img} source={require('../../assets/images/icon.png')} />,
					title: 'Choose the voice that wakes you.',
					subtitle: '',
				},
				{
					backgroundColor: '#ffffff',
					image: <Image style={styles.img} source={require('../../assets/images/icon.png')} />,
					title: 'When does your day begin?',
					subtitle: '',
				},
				{
					backgroundColor: '#ffffff',
					image: <Image style={styles.img} source={require('../../assets/images/icon.png')} />,
					title: 'Your mornings will sound like this.',
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
	}
})