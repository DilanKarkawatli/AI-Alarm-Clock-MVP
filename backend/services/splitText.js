function splitIntoSentences(text) {
	// Simple sentence splitter based on punctuation.
	return text
		.match(/[^.!?]+[.!?]+/g) || [text]; // keeps sentences intact
}

export default splitIntoSentences;