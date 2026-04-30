/*
Based on user input, outputs the correct voice id
*/
const VOICE_CATALOG = {
  julian: { key: "julian", label: "Wise Friend", providerVoiceId: "7p1Ofvcwsv7UBPoFNcpI" },
  myrrdin: { key: "myrrdin", label: "Socratic Monologue", providerVoiceId: "oR4uRy4fHDUGGISL0Rev" },
  wyatt: { key: "wyatt", label: "Aurelian Meditations", providerVoiceId: "YXpFCvM1S3JbWEJhoskW" },
  best_female_friend: { key: "best_female_friend", label: "Calm Narrator", providerVoiceId: "aj0fZfXTBc7E3By4X8L2" },
  mid30s_female: { key: "mid30s_female", label: "Wise Big Sister", providerVoiceId: "xYa75LlayhWHCRl1yJSH" },
};

export function listVoices() {
	return Object.values(VOICE_CATALOG).map(({ key, label }) => ({ key, label }));
}

export function isValidVoiceKey(voiceKey) {
	return Boolean(voiceKey && VOICE_CATALOG[voiceKey.toLowerCase()]);
}

export default function outputVoiceID(voiceKey) {
  const key = (voiceKey || "julian").toLowerCase();
  console.log(`Outputting voice ID for key: ${key}`);
  return VOICE_CATALOG[key]?.providerVoiceId ?? VOICE_CATALOG.julian.providerVoiceId;
}