/**
 * Screen to choose different voices
 */

import { useFocusEffect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text } from 'react-native';
import { voices } from '../../data/voices';

import { createAudioPlayer } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef } from 'react';
const screenWidth = Dimensions.get('window').width;

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function chooseVoice() {
	const [selectedVoice, setSelectedVoice] = useState(null);
	const soundRef = useRef(null);
	const router = useRouter();

	const playSound = async (soundFile) => {
		try {
			if (soundRef.current) {
				soundRef.current.pause();
				soundRef.current.remove();
			}

			const player = await createAudioPlayer(soundFile);
			soundRef.current = player;

			player.play();
		} catch (error) {
			console.error('Error playing sound:', error);
		}
	};

	const renderVoiceItem = ({ item }) => {
		const isSelected = selectedVoice === item.id; // isSelected = (voice == item.id) => isSelected = True/False
		
		return (
			<Pressable
				style={[styles.VoiceItem, isSelected && styles.selectedVoice]}
				onPress={async () => {
					setSelectedVoice(item.id);
					await AsyncStorage.setItem('selectedVoice', item.voiceKey);
					await AsyncStorage.setItem('selectedId', item.id);
					console.log('Selected voice:', item.voiceKey);
					playSound(item.sound);
				}}
			>
				<Image
					source={item.image}
					style={[styles.voiceImage, isSelected && styles.selectedImage]}
				/>
				
				<Text style={[styles.voiceText, isSelected && styles.selectedText]}>
					{item.name}
				</Text>
			</Pressable>
		)
	};

	useEffect(() => {
		const loadVoice = async () => {
			try {
				const savedVoice = await AsyncStorage.getItem('selectedVoice');
				const savedId = await AsyncStorage.getItem('selectedId');
				if (savedId) {
					setSelectedVoice(savedId);
					console.log('Loaded saved voice:', savedVoice);
				}
			} catch (error) {
				console.error('Error loading saved voice:', error);
			}
		}

		loadVoice();

		return () => {
			if (soundRef.current) {
				soundRef.current.remove();
			}
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			return () => {
				if (soundRef.current) {
					try {
						soundRef.current.pause();
						soundRef.current.remove();
						soundRef.current = null;
					} catch (error) {
						console.error('Error stopping sound on blur:', error);
					}
				}
			}
		}, [])
	)

	return (
		<LinearGradient 
			style={styles.container}
			colors={["#fcefe7", "#ffeadc"]}
			>
			<Text style={styles.titleText}>Choose your ally wisely</Text>
			<FlatList
				data={voices}
				keyExtractor={(item) => item.id}
				renderItem={renderVoiceItem}
				style={styles.voiceList}
				contentContainerStyle={{ paddingBottom: 20 }}
			/>
			<Pressable
				style={({ pressed }) => [
					styles.buttonWrapper,
					pressed && styles.buttonPressed
				]}

				onPress={() => router.back()}
			>

				<LinearGradient
					colors={["#ffbf84", "#ff5900"]}
					end={{ x: 0.5, y: 1}}
					start={{ x: 0.5, y: 0}}
					style={styles.buttonVoice}
				>
					<Text style={styles.buttonTextVoice}>Done</Text>
				</LinearGradient>

			</Pressable>
		</LinearGradient>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 30,
		paddingTop: 80,
		backgroundColor: '#f2f2f2',
	},
	titleText: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 30, // Perfect
		textAlign: 'center',
	},
	voiceList: {
		width: '100%',
		height: 'auto',
		overflow: 'visible'
	},
	VoiceItem: {
		padding: 15,
		backgroundColor: '#fafafa',
		borderRadius: 10,
		marginBottom: 10,
		alignItems: 'center',
		overflow: 'visible'
	},
	selectedVoice: {
		backgroundColor: '#E8E1DB',
	},
	voiceText: {
		fontSize: 18,
		fontWeight: '500',
		color: '#9b9b9b',
	},
	selectedText: {
		color: '#ffffff',
		fontWeight: 'bold',
		fontSize: 30,
		textShadowColor: 'rgba(0, 0, 0, 0.5)', // color of the shadow
		textShadowOffset: { width: 2, height: 2 }, // how far the shadow is offset
		textShadowRadius: 3, // how blurry the shadow is
	},
	selectedImage: {
		borderWidth: 3,          // thick border around the image
		borderColor: '#646464',  // same color as the selected background
		transform: [{ scale: 1.8 }], // slightly bigger image
	},
	voiceImage: {
		width: 80,
		height: 80,
		borderRadius: 40, // Circular
		marginBottom: 10,

		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 6,
		elevation: 6,
	},
	buttonWrapper: {
		borderRadius: 20,
		marginBottom: 60,

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
	buttonPressed: {
		transform: [{ scale: 0.97 }],
	},
	buttonTextVoice: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
})