/**
 * TO BE IMPLEMENTED:
 * Implemented using expo notifications, since there is no use in having a native notification 
 * in an on-app usecase.
 */

import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';

type Props = {
	onDone: () => void;
};

export default function NotificationComponent( { onDone }: Props) {

	// [] Improvement: Add a button that forces the notification to pop out to make more interactive
	// useEffect(() => {
	// 	const requestPermissions = async () => {
	// 		const { status } = 
	// 		await Notifications.requestPermissionsAsync();

	// 	if (status !== 'granted') {
	// 		alert('Permission not granted!');
	// 	}
	// 	}

	// 	requestPermissions();
	// }, []);

	// useEffect(() => {
	// 	Notifications.setNotificationChannelAsync('latest-alarm', {
	// 		name: 'Custom Sound',
	// 		importance: Notifications.AndroidImportance.MAX,
	// 		sound: 'latest-alarm-mp3',
	// 	});
	// }, []);

	// const triggerNotification = async () => {
	// 	await Notifications.scheduleNotificationAsync({
	// 		content: {
	// 			title: 'Welcome to WiseRise!',
	// 			body: "This is how the Alarm looks like.",
	// 			sound: 'latest-alarm.mp3',
	// 		},
	// 		trigger: null,
	// 	});
	// };

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Wait for it....
			</Text>

			<TouchableOpacity 
				style={styles.button}
				// onPress={triggerNotification}
				onPress={onDone}
				>
				<Text style={styles.buttonContinue}
				>
					Or don't...
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	
  container: {
	backgroundColor: '#ffe7cc',
	padding: 30,
	borderRadius: 24,
	width: 300,
	resizeMode: 'contain',
	alignSelf: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#ff7214',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  buttonContinue: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  buttonBack: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  textInput: {
	backgroundColor: '#ffffff',
	borderRadius: 10,
	marginBottom: 150,
	paddingLeft: 20,
	color: '#000000',
  },
})