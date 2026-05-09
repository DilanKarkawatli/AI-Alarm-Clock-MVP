import React from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

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
		<Text style={styles.buttonText}>Skip</Text>
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
  return (
	<View style={styles.container}>
	  <Onboarding
	  		// showSkip
			// SkipButtonComponent={Skip}
			// DoneButtonComponent={Begin}
	  		onSkip={() =>
					onDone({
						name: 'Ryan',
						goal: 'Wake up earlier',
					})
			}
			// onNext={() =>
			// 		onNext({
			// 		  name: 'Ryan',
			// 		  goal: 'Wake up earlier',
			// 		  })
			// 		}
			pages={[
				{
				backgroundColor: '#ffffff',
				title: 'The way you wake up shapes your entire day',
				subtitle: (''
					// <View style={styles.buttonContainer}>
					// 	<TouchableOpacity style={styles.beginButton}>
					// 	<Text style={styles.buttonText}>Begin</Text>
					// 	</TouchableOpacity>

					// 	<TouchableOpacity style={styles.skipButton}>
					// 	<Text style={styles.buttonText}>Skip</Text>
					// 	</TouchableOpacity>
					// </View>
				),
				image: <Image style={styles.img} source={require('../../assets/images/icon.png')} />,
				},
				{
				backgroundColor: '#ffffff',
				image: <Image style={styles.img2} source={require('../../assets/images/img_slide2.png')} />,
				title: 'This is where your wake-up alarm begins.',
				subtitle: '',
				},
				{
				backgroundColor: '#ffffff',
				image: <Image style={styles.img} source={require('../../assets/images/img_slide3.png')} />,
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
		backgroundColor: '#91908f',
		paddingVertical: 12,
		paddingHorizontal: 65,
		borderRadius: 12,
	},
	beginButton: {
		backgroundColor: '#ff7214',
		paddingVertical: 12,
		paddingHorizontal: 60,
		borderRadius: 12,
	}
})