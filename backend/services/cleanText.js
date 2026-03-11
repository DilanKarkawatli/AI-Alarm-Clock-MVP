export default function cleanText(text) {
	return text
		.replace(/[*_]/g, "")          // remove markdown
		.replace(/[“”]/g, '"')         // normalize quotes
		.replace(/\n+/g, " ")          // remove line breaks
		.replace(/\s+/g, " ")          // normalize spaces
		.trim();
}

