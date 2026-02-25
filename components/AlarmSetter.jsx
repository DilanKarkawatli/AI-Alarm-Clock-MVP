import { View, Text, StyleSheet, TextInput, Pressable, Platform, NativeModules, Alert } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const { AlarmScheduler } = NativeModules;

// import { createAudioPlayer } from 'expo-audio';
// import { voices } from '../data/voices';

export default function AlarmSetter({ onAlarmChange, onClose }) {
  const [time, setTime] = useState('');
  const [alarmInfo, setAlarmInfo] = useState(null);

//   const timeoutRef = useRef(null);
//   const playerRef = useRef(null);

  const scheduleExpoAlarm = async (alarmTime) => {
	const id = await Notifications.scheduleNotificationAsync({
		content: {
			title: "Wake up",
			body: "Your wisdom awaits.",
			sound: true,
		},
		trigger: {
			date: alarmTime,
			type: Notifications.SchedulableTriggerInputTypes.DATE,
			channelId: 'default',
		},
	});
	console.log("Scheduled notification:", id);

	await AsyncStorage.setItem('alarmNotificationId', id);
  }

//   const playSelectedVoice = async () => {
//     try {
//       const savedVoiceId = await AsyncStorage.getItem('selectedVoice');

//       const voice = voices.find(v => v.id === savedVoiceId);

//       if (!voice) {
//         console.log('No voice selected');
//         return;
//       }

//       const player = createAudioPlayer(voice.sound);
//       playerRef.current = player;

//       player.play();
//     } catch (error) {
//       console.log('Error playing alarm:', error);
//     }
//   };

  const setAlarm = async () => {
    if (!time.includes(':')) return;

	// if (timeoutRef.current) {
	// 	clearTimeout(timeoutRef.current)
	// }

    const [hours, minutes] = time.split(':').map(Number);
	if (Number.isNaN(hours) || Number.isNaN(minutes)) return;

    const now = new Date();
    const alarm = new Date();
    alarm.setHours(hours);
	alarm.setMinutes(minutes);
    alarm.setSeconds(0);
	alarm.setMilliseconds(0);

    // If time already passed today → tomorrow
    if (alarm <= now) {
      alarm.setDate(alarm.getDate() + 1);
    }

	if (Platform.OS === 'android' && AlarmScheduler) {
		const canExact = await AlarmScheduler.canScheduleExactAlarms();
		console.log('canExact', canExact);
		if (!canExact) {
			Alert.alert(
				'Allow exact alarms',
				'Please allow exact alarms so your alarm can fire on time after reboot/sleep.'
			);
			AlarmScheduler.openExactAlarmSettings();
			return;
		}
		await AlarmScheduler.scheduleAlarm(alarm.getTime());
	} else {
		await scheduleExpoAlarm(alarm);
	}

	// await scheduleAlarm(alarm);

	await AsyncStorage.setItem('wakeTime', alarm.toISOString());

	const formatted = alarm.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	})

	setAlarmInfo(formatted)
	onAlarmChange?.(); // notify parent to refresh wake time display
	onClose?.();
  };

  const cancelAlarm = async () => {
	if (Platform.OS === 'android' && AlarmScheduler) {
		await AlarmScheduler.cancelAlarm();
	} else {
		const id = await AsyncStorage.getItem('alarmNotificationId');
		if (id) {
			await Notifications.cancelScheduledNotificationAsync(id);
		}
		await AsyncStorage.removeItem('alarmNotificationId');
	}

	// await AsyncStorage.removeItem('wakeTime');
    // setAlarmInfo(null);
	onAlarmChange?.(); // notify parent to refresh wake time display
	onClose?.();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder=" '7:30' "
        value={time}
        onChangeText={setTime}
      />

      <Pressable style={styles.button} onPress={setAlarm}>
        <Text style={styles.buttonText}>Set Alarm</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={cancelAlarm}>
        <Text style={styles.buttonText}>Cancel</Text>
      </Pressable>

      {alarmInfo &&
        <Text style={styles.info}>
          Alarm set for {alarmInfo}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#757575',
    padding: 12,
	
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#999',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  info: {
    marginTop: 15,
    fontSize: 16,
  },
});