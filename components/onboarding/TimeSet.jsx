/**
 * This component picks the time to get set alongside the name and wakereason in the onDone button.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { NativeModules, Platform, Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from "react-native-date-picker";
import { generateAlarmAudio } from '../../service/AlarmService';
const { AlarmScheduler } = NativeModules;

type Props = {
	onNext: () => void;
	onSubmit?: (data: { time: string }) => Promise<void> | void;
};

export default function TimeSet({ onAlarmChange, onClose, onSubmit, onNext } : Props) {
  const [time, setTime] = useState('');
  const [alarmInfo, setAlarmInfo] = useState(null);
  const [repeatDaily, setRepeatDaily] = useState(false)
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

const setAlarm = async () => {
	const hours = date.getHours();
	const minutes = date.getMinutes();

	if (Number.isNaN(hours) || Number.isNaN(minutes)) return;

	const now = new Date();
	const alarm = new Date();

	alarm.setHours(hours);
	alarm.setMinutes(minutes);
	alarm.setSeconds(0);
	alarm.setMilliseconds(0);

	if (alarm <= now) {
		alarm.setDate(alarm.getDate() + 1);
	}

	await AsyncStorage.setItem("wakeTime", alarm.toISOString());
	console.log("wakeTime LOGGED: ", alarm.toISOString())

	await onSubmit?.({
		time: alarm.toISOString(),
	});

	await generateAlarmAudio(alarm);

	if (Platform.OS === 'android' && AlarmScheduler) {
		await AlarmScheduler.scheduleAlarm(alarm.getTime(), repeatDaily);
	}

};

  return (
    <View style={styles.container}>
		<Pressable
			style={styles.input}
			onPress={() => setOpen(true)}
			>
			<Text style={{ fontSize: 18 }}>
				{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
			</Text>
		</Pressable>
		<DatePicker
			modal
			open={open}
			date={date}
			mode="time"
			onConfirm={(selectedDate) => {
				setOpen(false);
				setDate(selectedDate);
			}}
			onCancel={() => {
				setOpen(false);
			}}
		/>
	  <View style={styles.repeatContainer}>
		<Text style={styles.repeatText}>Repeat Daily</Text>
		<Switch
			value={repeatDaily}
			onValueChange={setRepeatDaily}
			trackColor={{ false: '#0a0808', true: '#009719' }}
			thumbColor={repeatDaily ? '#f7f7f7' : '#f4f3f4'}
			style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
		/>
	  </View>

      {/* <TouchableOpacity 
	  	style={styles.button}
		disabled={loading}
	  	onPress={async () => {

			setLoading(true);

			await setAlarm();
			setLoading(false);
			onNext();
			setLoading(false);
			
			// try {
			// 	await setAlarm();
			// 	onNext();
			// } finally {
			// 	setLoading(false);
			// }
e

			// setAlarm();
			// onNext();
			}} >
        <Text style={styles.buttonText}>Set Alarm</Text>
      </TouchableOpacity> */}

	  {/* <Text style={styles.loading}>A small wait might occur</Text> */}

      <TouchableOpacity 
	  	style={styles.button}
		disabled={loading}
	  	onPress={async () => {

			setLoading(true);

			await setAlarm();
			setLoading(false);
			onNext();
			}} >
        <Text style={[
			styles.buttonText,
			loading && styles.buttonTextDisabled
		]}>{loading ? 'Setting Alarm...' : 'Set Alarm'}</Text>
      </TouchableOpacity>

	  <Text style={styles.loading}>A small wait might occur</Text>

	  {loading && (
			<Text style={styles.loading}>
				Loading...
			</Text>
		)}

      {alarmInfo &&
        <Text style={styles.info}>
          Alarm set for {alarmInfo}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8E1DB',
	padding: 50,
	borderRadius: 16,
	width: 350,
	resizeMode: 'contain',
	alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#ff7214',
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
  loading: {
	color: '#474747',
	textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: 'gray',
    fontWeight: 'bold',
  },
  info: {
    marginTop: 15,
    fontSize: 16,
  },
	input: {
		backgroundColor: "#ffffff",
		padding: 18,
		borderRadius: 12,
		width: "100%",
		alignItems: "center",
		marginBottom: 15,
	},
	repeatContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: 15,
		paddingHorizontal: 10,
	},
	repeatText: {
		fontSize: 16,
		fontWeight: '500',
	},
});