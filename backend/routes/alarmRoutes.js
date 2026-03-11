import express from "express";

// import { cleanText } from "../services/cleanText.js";
import { generateMessage } from "../services/generateMessage.js";
import { generatePrompt } from "../services/generatePrompt.js";
import { generateSpeech } from "../services/generateSpeech.js";
import { uploadAudio } from "../services/uploadAudio.js";

// Router instance to define routes related to alarms
const router = express.Router();

router.post("/generate-alarm", async (req, res) => {
	const name = req.body.name;
	const wakeTime = req.body.wakeTime;

	// Plan to add name and wakeTime from user input
	const prompt = generatePrompt(name, wakeTime);

	// const cleanPrompt = cleanText(prompt);

	const text = await generateMessage(prompt);

	const audio = await generateSpeech(text);

	const filename = `alarm-${Date.now()}.mp3`; // Later, add username/ID, date & voiceID

	const url = await uploadAudio(audio, filename);

	res.json({
		audio_url: url
	});

	// res.setHeader("Content-Type", "audio/mpeg");
	// res.send(audio);
});

export default router;