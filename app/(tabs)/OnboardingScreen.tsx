import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

// type == custom typescript datastructure blueprint
type User = {
	onDone: (data: {
		name: string;
		goal: string;
	}) => void;
};

// "{ onDone }: User" tells onDone what typescript type it is
export default function OnboardingScreen({ onDone }: User) {
  return (
	<View style={styles.container}>
	  <Onboarding
			onDone={() =>
					onDone({
					  name: 'Ryan',
					  goal: 'Wake up earlier',
					  })
					}
			pages={[
				{
				backgroundColor: '#fdc7c7',
				image: <Image style={styles.img} source={require('../../assets/images/icon.png')} />,
				title: 'Onboarding',
				subtitle: 'Done with React Native Onboarding Swiper',
				},
				{
				backgroundColor: '#b1ff4a',
				image: <Image style={styles.img} source={require('../../assets/images/icon.png')} />,
				title: 'Onboarding',
				subtitle: 'Done with React Native Onboarding Swiper',
				},
				{
				backgroundColor: '#c0c0c0',
				image: <Image style={styles.img} source={require('../../assets/images/icon.png')} />,
				title: 'Onboarding',
				subtitle: 'Done with React Native Onboarding Swiper',
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
})