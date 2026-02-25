import fs from "node:fs/promises";
import path from "node:path";
import { userData } from "./userData.js";

const templatePath = path.join(process.cwd(), "scripts", "personas", "alarmPrompt.txt");

export async function buildPrompt() {
	let template = await fs.readFile(templatePath, "utf-8");

	// Replace placeholders with user data
	Object.entries(userData).forEach(([key, value]) => {
		template = template.replaceAll(`{{${key}}}`, value);
	});

	return template;
}