import openai from "../config/openai.js";

// Input: Prompt with name (sting)
// Output: AI generated message using AI API (string)
export async function generateMessage(prompt) {

	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{
				role: "user",
				content: prompt
			}
		]
	});

	return completion.choices[0].message.content;
}