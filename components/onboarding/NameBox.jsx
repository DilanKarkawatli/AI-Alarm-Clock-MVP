import { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

type Props = {
	onNext: () => void;
};

export default function NameBox( { onSubmit, onNext }: Props) {
	const [name, setName] = useState("");

	const handleSubmit = async () => {
		console.log(name);
		await onSubmit?.({ name });
	};

	return (
		<View style={styles.container}>
			
			<TextInput 
				style={styles.textInput}
				placeholder="Enter your name"
				value={name}
				onChangeText={setName}
			/>

			<TouchableOpacity 
				style={styles.button}
				onPress={() => {
					onNext();
					handleSubmit();
					}}
				>
				<Text style={styles.buttonContinue}>
					Continue
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