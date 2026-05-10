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

export default function NameBox( { onNext }: Props) {
	return (
		<View style={styles.container}>
			<TextInput style={styles.textInput}
				placeholder="Enter your name"
			/>

			<TouchableOpacity 
				style={styles.button}
				onPress={onNext}
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
		padding: 24,
		borderRadius: 24,
		width: '90%',
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