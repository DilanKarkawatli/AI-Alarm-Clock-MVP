import {
	Dimensions,
	StyleSheet,
	Text,
	View
} from 'react-native';
import {
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated';

import Animated from 'react-native-reanimated';

import { useEffect } from 'react';


import {
	Canvas,
	Circle,
	RadialGradient,
	Shadow,
	vec,
} from '@shopify/react-native-skia';
import { Easing, withTiming } from 'react-native-reanimated';

// import {
//   Canvas,
//   Circle,
//   Group,
//   RadialGradient,
//   Shadow,
//   vec,
// } from '@shopify/react-native-skia';


const { width } = Dimensions.get('window');
const CLOCK_SIZE = width * 0.7
const CENTER = CLOCK_SIZE / 2

const AnalogClock = () => {

	const hourRotation = useSharedValue(0)
	const minuteRotation = useSharedValue(0)
	const secondRotation = useSharedValue(0)

	useEffect(() => {
		const updateClock = () => {
			const now = new Date()
			const hours = now.getHours();
			const minutes = now.getMinutes();
			const seconds = now.getSeconds();

			const hours12 = (hours % 12 || 12).toString().padStart(2, '0');

			// ### Degree calculations
			const hourDeg = (hours % 12) * 30 + minutes * 0.5;
			const minuteDeg = minutes * 6; // 6 * 60deg == 360deg
			const secondDeg = seconds * 6;

			hourRotation.value = withTiming(hourDeg, {
				duration: 500,
				easing: Easing.linear,
			});
			
			minuteRotation.value = withTiming(minuteDeg, {
				duration: 500,
				easing: Easing.linear,
			});

			secondRotation.value = withTiming(secondDeg, {
				duration: 500,
				easing: Easing.linear,
			});
		}

		updateClock();
		const interval = setInterval(updateClock, 1000);
		return () => clearInterval(interval);
	}, []);

	const renderTicks = () => {
		const ticks = [];
		for (let i = 0; i < 60; i++) {
			const angle = (i * 6 * Math.PI) / 180;
			const outerR = CENTER - 10;
			const innerR = i % 5 === 0 ? outerR - 10 : outerR - 15;
			const x = CENTER + innerR * Math.sin(angle);
			const y = CENTER - innerR * Math.cos(angle);

			ticks.push(
				<View
					key={i}
					style={{
						position: 'absolute',
						width: 1 % 5 === 0 ? 3 : 1,
						height: i % 5 === 0 ? 6 : 6,
						backgroundColor: i % 5 === 0 ? '#b4a5a5' : '#6478B', // Hides everything inbetween modulo 5?
						left: x + 1,
						top: y + 4,
						transform: [
							{ translateX: i % 5 === 0 ? -1.5 : -0.5 }, // Ternary operator: If-then-else
							{ translateY: -(i % 5 === 0 ? 12 : 6) / 2 },
							{ rotate: `${i * 6}deg` },
						]
					}}
				/>
			);

		}
		return ticks;
	};

	const renderNumbers = () => {
		const numbers = [];
		for (let i = 1; i <= 12; i++) {
			const angle = (i * 30 * Math.PI) / 180;
			const r = CENTER - 35;
			const x = CENTER + r * Math.sin(angle) + 5;
			const y = CENTER - r * Math.cos(angle);

			numbers.push(
				<Text
					key={i}
					style={{
						position: 'absolute',
						left: x - 8,
						top: y - 5,
						fontSize: 8,
						fontWeight: '300',
						color: '#7c6767',
					}}
				>{i}</Text>
			);

		}
		return numbers;
	};

	const createHandStyle = (
		rotation: any,
		width: any,
		height: any,
		color: String,
		zIndex = 1
	) => useAnimatedStyle(() => ({
		position: 'absolute',

		transform: [
			{ translateY: height / 2 },
			{ rotateZ: `${rotation.value}deg` },
			{ translateY: -height / 2 },
		],

		width,
		height,

		backgroundColor: color,

		top: CENTER - height,
		left: CENTER - width / 2,

		borderRadius: width / 2,
	}));


	const hourStyle = createHandStyle(
		hourRotation,
		2.5,
		CENTER * 0.5,
		'#ff9447',
	);

	const minuteStyle = createHandStyle(
		minuteRotation,
		2,
		CENTER * 0.6,
		'#ffcca6',
	);

	// const secondStyle = createHandStyle(
	// 	secondRotation,
	// 	2,
	// 	CENTER * 0.7,
	// 	'#ffa600cc',
	// );

	return (
		<View style={styles.container}>
			{/* <View style={styles.clockContainer}>
				<View style={styles.outerGlow} />
				<View style={styles.clock}>
					{renderTicks()}
					{renderNumbers()}
					
					<View style={styles.innerGlow} />

					<View style={styles.centerDotBig} />
					<View style={styles.centerDot} />
					
					<Animated.View style={hourStyle} />
					<Animated.View style={minuteStyle} />

				</View>
			</View> */}

			<View style={styles.clockWrapper}>
				
				{/* Main Clock body */}
			<Canvas style={{ 
				width: CLOCK_SIZE, 
				height: CLOCK_SIZE,
				position: 'absolute'
				}}>
				<Circle
					cx={CENTER}
					cy={CENTER}
					r={((CLOCK_SIZE - 15)/2)}
					color="#fffaf7"
				>
					<RadialGradient
						c={vec(CENTER - 30, CENTER - 30)}
						r={CLOCK_SIZE * 0.4}
						colors={[
						'#fff0e7',
						'#ffeee5dc',
						]}
					/>
					<Shadow 
						dx={-5}
						dy={-7}
						blur={5}
						color="rgba(255, 255, 255, 0.73)"
					/>
					<Shadow 
						dx={1}
						dy={1}
						blur={5}
						color="rgba(0, 0, 0, 0.14)"
					/>
				</Circle>
						
				{/* <View style={styles.centerDotBig} />
				<View style={styles.centerDot} /> */}
				

				{/* Big Center Dot */}
				<Circle
					cx={CENTER}
					cy={CENTER}
					r={((CLOCK_SIZE - 20)/2) * 0.4}
					color="#fcefe7"
				>
					<RadialGradient
						c={vec(CENTER - 30, CENTER - 30)}
						r={CLOCK_SIZE * 0.7}
						colors={[
						'#fff0e7',
						'#ffe7d8dc',
						]}
					/>
					<Shadow 
						dx={-5}
						dy={-7}
						blur={5}
						color='#fcefe7'
					/>
					<Shadow 
						dx={2}
						dy={2}
						blur={3}
						color='#cfc5bf42'
					/>
				</Circle>
			</Canvas>

			{renderTicks()}
			{renderNumbers()}

			<Animated.View style={hourStyle} />
			<Animated.View style={minuteStyle} />

			<Canvas style={{ 
				width: CLOCK_SIZE, 
				height: CLOCK_SIZE,
				position: 'absolute',
				zIndex: 100,
				elevation: 100,

				}}>
					
				{/* Small Center Dot */}
				<Circle
					cx={CENTER}
					cy={CENTER}
					r={((CLOCK_SIZE - 20)/2) * 0.1}
					color="#fcefe7"
				>
					<RadialGradient
						c={vec(CENTER - 30, CENTER - 30)}
						r={CLOCK_SIZE * 0.7}
						colors={[
						'#fff0e7',
						'#fff2e9dc',
						]}
					/>
					<Shadow 
						dx={-2}
						dy={-3}
						blur={5}
						color='#7e7a7a27'
					/>
					<Shadow 
						dx={3}
						dy={8}
						blur={9}
						color='#29272742'
					/>
				</Circle>

			</Canvas>
			</View>
		</View>
	)
}

export default AnalogClock

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: CLOCK_SIZE,
		height: CLOCK_SIZE,
	},
	clockWrapper: {
		width: CLOCK_SIZE,
		height: CLOCK_SIZE,
		position: 'relative'
	},
	clockContainer: {
		backgroundColor: '#fcefe7',
		width: CLOCK_SIZE,
		height: CLOCK_SIZE,
		borderRadius: CLOCK_SIZE + 20 / 2,

		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 1,
		shadowRadius: 20,
		elevation: 16,
		justifyContent: 'center',
		alignItems: 'center'
	},
	clock: {
		width: CLOCK_SIZE,
		height: CLOCK_SIZE,
		borderRadius: CLOCK_SIZE / 2,
		borderWidth: 4,
		borderColor: '#fcefe7',
		backgroundColor: '#fcefe7',
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	innerGlow: {
		position: 'absolute',

		width: CLOCK_SIZE * 0.58,
		height: CLOCK_SIZE * 0.58,

		borderRadius: 999,

		backgroundColor: '#ffefe5',

		top: CENTER - (CLOCK_SIZE * 0.58) / 2,
		left: CENTER - (CLOCK_SIZE * 0.58) / 2,
	},
	outerGlow: {
		position: 'absolute',

		width: CLOCK_SIZE,
		height: CLOCK_SIZE,

		borderRadius: 999,

		backgroundColor: '#ffffff',
		opacity: 0.8,
		borderWidth: 1,
		borderColor: '#ffffff',

		top: CENTER - CLOCK_SIZE / 2 - 3,
		left: CENTER - CLOCK_SIZE / 2 - 3,
	},
	centerDot: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#fcefe7',
		borderWidth: 2,
		borderColor: '#fcefe7',
		zIndex: 30,
		position: 'absolute',
		top: CENTER - 16,
		left: CENTER - 16, 

		shadowColor: '#8f8f8f',
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.08,
		shadowRadius: 24,
		elevation: 6,
	},
	centerDotBig: {
		width: 128,
		height: 128,
		borderRadius: 64,
		backgroundColor: '#fcefe7',
		borderWidth: 2,
		borderColor: '#fcefe7',
		zIndex: 10,
		position: 'absolute',
		top: CENTER - 64,
		left: CENTER - 64,

		shadowColor: '#a0a0a0',
		shadowOffset: {
			width: 0,
			height: 20,
		},
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 6,
	},
	// hourStyle: {

	// },
	// minuteStyle: {

	// },
	// secondStyle: {

	// },
})