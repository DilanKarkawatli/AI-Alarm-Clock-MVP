/**
 * This component sets the alarm and creates the UI screen for setting the alarm
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { Alert, NativeModules, Platform } from 'react-native';
const { AlarmScheduler } = NativeModules;



  export async function ensureAlarmPermissions() {
	if (Platform.OS === 'android') return true; // Handled by native module
	
	const notif = await Notifications.requestPermissionsAsync()
	const notifGranted = notif.granted || notif.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

	if (!notifGranted) {
		Alert.alert("Notifcations required", "Enable notifcations so alarms can fire in prod. builds.");
		return false;
	}

	if (AlarmScheduler?.canScheduleExactAlarms) {
		const canExact = await AlarmScheduler.canScheduleExactAlarms();
	if (!canExact) {
		Alert.alert(
			'Exact alarms required',
			'Please allow exact alarms for this app in system settings.',
			[
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Open settings',
				onPress: () => AlarmScheduler?.openExactAlarmSettings?.(),
			},
			]
		);
		return false;
		}
	}

	return true;
  }



  export async function generateAlarmAudio() {
	const voiceKey = (await AsyncStorage.getItem('selectedVoice')) || 'julian';

	console.log(
		"RAW USER_DATA:",
		await AsyncStorage.getItem('user_data')
	);

	const onboardingRaw = await AsyncStorage.getItem('user_data');

	console.log("RAW USER DATA:", onboardingRaw);

	const onboarding = onboardingRaw
		? JSON.parse(onboardingRaw)
		: {};

	console.log("PARSED USER DATA:", onboarding);

	const name = onboarding?.name || 'friend';
	const wakeReason = onboarding?.goal || 'No goal provided';
	const wakeTime = onboarding?.wakeTime || 'No Date';

	console.log("NAME USED:", name);
	console.log("GOAL USED:", wakeReason);
	console.log("TIME USED:", wakeTime);

	const baseUrl = process.env.EXPO_PUBLIC_API_URL;

	if (!baseUrl) {
		throw new Error('API base URL not working');
	}

	const response = await fetch(`${baseUrl}/generate-alarm`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json' },
		body: JSON.stringify({ 
			name, 
			wakeTime, 
			voiceKey, 
			wakeReason 
		}),
	});

	const data = await response.json();
	
	if (!response.ok) throw new Error(data.error || 'Failed to generate alarm');
	console.log('Alarm audio URL stored:', data.file_key);

	const signedRes = await fetch(`${baseUrl}/alarms/${encodeURIComponent(data.file_key)}/download-url`);
	const signedData = await signedRes.json();
	if (!signedRes.ok || !signedData.download_url) throw new Error(signedData.error || 'Failed to get signed URL');


	const alarmsDir = new Directory(Paths.document, 'alarms');
	alarmsDir.create({ intermediates: true, idempotent: true });
	const targetFile = new File(alarmsDir, 'latest-alarm.mp3');

	if (!data.file_key) throw new Error("Missing file_key from backend");
	const downloadedFile = await File.downloadFileAsync(signedData.download_url, targetFile, { idempotent: true });

	await AsyncStorage.setItem('latestAlarmLocalUri', downloadedFile.uri);
	await AsyncStorage.setItem('latestAlarmRemoteUrl', data.file_key);
	console.log('Alarm audio downloaded to:', downloadedFile.uri);
	console.log('Alarm audio URL stored:', data.file_key);

	if (AlarmScheduler?.setAlarmSoundUri) {
		await AlarmScheduler.setAlarmSoundUri(downloadedFile.uri);
	}
	console.log('Alarm sound URI set for native scheduler:', downloadedFile.uri);

	return downloadedFile.uri
  }




	export async function setAlarm(
		date: Date,
		repeatDaily: boolean
	) {

	const allowed = await ensureAlarmPermissions();

	if (!allowed) {
		return null;
	}

	const hours = date.getHours();
	const minutes = date.getMinutes();

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

	await AsyncStorage.setItem('wakeTime', alarm.toISOString());

	return alarm
  };





  export async function cancelAlarm() {
	if (Platform.OS === 'android' && AlarmScheduler) {

		await AlarmScheduler.setAlarmSoundUri(null);
		await AlarmScheduler.cancelAlarm();
		console.log("Cancel alarm triggered");

	} else {
		const id = await AsyncStorage.getItem('alarmNotificationId');
		if (id) {
			await Notifications.cancelScheduledNotificationAsync(id);
		}
		await AsyncStorage.removeItem('alarmNotificationId');
	}
  };
  