/*
Based on user input, outputs the correct voice id
*/

const voice_ids = {
	"Daniel": "onwK4e9ZLuTAKqWW03F9",
	"Adam": "pNInz6obpgDQGcFmaJgB",
	"Wyatt": "YXpFCvM1S3JbWEJhoskW",
	"Myrrdin": "oR4uRy4fHDUGGISL0Rev",
	"Spuds Oxley": "NOpBlnGInO9m6vDvFkFC",
}

function randomVoice(dict) {
	const keys = Object.keys(dict);
	const randomKey = keys[Math.floor(Math.random() * keys.length)];
	return dict[randomKey];
}


export default function outputVoiceID(name) {
	if (name in voice_ids) {
		return voice_ids[name];
	} else {
		return randomVoice(voice_ids);
	}
}