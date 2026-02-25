# ClockAI

ClockAI is an Expo + React Native alarm clock MVP focused on motivation-first wakeups.
You can set an alarm, choose a wake-up voice, and save your personal “why” so the app reinforces your reason for getting up.

## Features

- Set and cancel alarms from the home screen modal.
- Persist wake time locally with `AsyncStorage`.
- Choose a voice profile for alarm playback.
- Save a personal wake reason (“your why”).
- Android native exact-alarm scheduling support (with fallback behavior in JS flow).

## Tech Stack

- Expo SDK 54
- React Native 0.81 / React 19
- Expo Router (file-based routing)
- `expo-notifications` for scheduled notifications
- `expo-audio` for alarm voice playback
- `@react-native-async-storage/async-storage` for local persistence
- Android native module: `AlarmScheduler` (`android/app/src/main/java/com/dilank/alarmclockai/alarm`)

## Project Structure

```text
ClockAI/
	app/
		(tabs)/
			index.jsx          # Home screen + alarm modal
			choose-voice.jsx   # Voice selection screen
			wake-reason.jsx    # Save motivation/goal
			alarm-ring.jsx     # Ringing UI + stop action
			_layout.tsx        # Stack config
	components/
		AlarmSetter.jsx      # Alarm set/cancel logic
	data/
		voices.js            # Voice metadata + assets
		profileTemplate.js   # Default profile shape
	android/
		app/src/main/java/com/dilank/alarmclockai/alarm/
												 # Native Android alarm scheduler/service/receivers
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or compatible package manager)
- Android Studio (for Android emulator/device builds)
- Xcode (for iOS builds on macOS)

### Install

```bash
npm install
```

### Run

```bash
# Start Metro/Expo
npm run start

# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
```

## Available Scripts

- `npm run start` - Start Expo dev server
- `npm run android` - Build/run Android app
- `npm run ios` - Build/run iOS app
- `npm run web` - Run web build
- `npm run lint` - Run lint checks
- `npm run reset-project` - Reset scaffolded starter files

## Alarm Behavior Notes

- On Android, the app attempts to use native exact alarms via `AlarmScheduler`.
- If exact-alarm permission is required, the app can open system settings for user approval.
- For non-native paths, alarms are scheduled with `expo-notifications`.
- Voice selection and wake reason are stored locally and loaded on app start.

## Android Permissions Used

Defined in `android/app/src/main/AndroidManifest.xml`:

- `SCHEDULE_EXACT_ALARM`
- `RECEIVE_BOOT_COMPLETED`
- `FOREGROUND_SERVICE`
- `FOREGROUND_SERVICE_MEDIA_PLAYBACK`
- `VIBRATE`
- plus standard network/audio permissions used by the app

## Development Notes

- Route scheme is `alarmclockai://`.
- Package ID: `com.dilank.alarmclockai`.
- EAS project/build profiles are configured in `eas.json`.

## Troubleshooting

- Alarm does not fire on Android:
	- Ensure exact alarms are allowed in system settings.
	- Disable aggressive battery optimization for the app.
- No sound when alarm triggers:
	- Confirm a voice is selected in “Choose Voice”.
	- Verify device media volume and silent mode behavior.
- Time not appearing on home screen:
	- Re-set the alarm and ensure `wakeTime` is present in local storage.

## License

No license file is currently included in this repository.
