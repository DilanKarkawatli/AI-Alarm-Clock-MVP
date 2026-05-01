/**
 * Alarm foreground notification screen to stop the alarm
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { NativeModules, Pressable, Text, View } from 'react-native';

export default function AlarmRing() {
  const playerRef = useRef(null);
  const { AlarmScheduler } = NativeModules;

  const playVoice = async () => {
    await setAudioModeAsync({ playsInSilentMode: true, shouldDuck: false });
	const localUri = await AsyncStorage.getItem('latestAlarmLocalUri');
	const source = localUri ? { uri: localUri } : fallbackBundledSound;
	const player = createAudioPlayer(source);
    playerRef.current = player;
    player.play();
  };

  useEffect(() => {
    playVoice();
    return () => playerRef.current?.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 32 }}>Wake up</Text>
      <Pressable
        onPress={async () => { await AlarmScheduler.stopAlarmSound() }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Stop</Text>
      </Pressable>
    </View>
  );
}