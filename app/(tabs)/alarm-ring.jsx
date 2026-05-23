/**
 * Alarm foreground notification screen to stop the alarm
 */

import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { NativeModules, Pressable, StyleSheet, Text, View, } from 'react-native';

export default function AlarmRing() {
  const router = useRouter();
  const playerRef = useRef(null);
  const { AlarmScheduler } = NativeModules;

  const cancelAlarm = async () => {
	playerRef.current?.pause();
	playerRef.current?.remove();
  }

  useEffect(() => {
    return () => {
		playerRef.current?.pause();
		playerRef.current?.remove();
	};
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={{ fontSize: 32 }}>Wake up</Text> */}
	  <Pressable
		onPress={async () => {
			playerRef.current?.pause();
			playerRef.current?.remove();

			await AlarmScheduler.cancelAlarm();

			router.back(); // Brings the page back to previous page
		}}
		style={({ pressed }) => [
			styles.stopButton,
			pressed && styles.stopButtonPressed
		]}
		>
        <Text style={styles.stopText}>Stop Alarm</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f2f2f2',
	},
	stopButton: {
		backgroundColor: '#DB6828',
		fontSize: 18,
		fontWeight: 'bold',
		borderRadius: 20,
		paddingVertical: 20,
		paddingHorizontal: 60,
	},
	stopButtonPressed: {
		backgroundColor: '#ce5717',
		fontSize: 18,
		fontWeight: 'bold',
		borderRadius: 20,
		paddingVertical: 20,
		paddingHorizontal: 60,
	},
	stopText: {
		fontSize: 24, 
		fontWeight: 'bold',
		color: 'white'
	}
})