import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/storage.js";

// Uploads the audio file to S3 and returns the public URL
export async function uploadAudio(buffer, filename) {
	const command = new PutObjectCommand({
		Bucket: process.env.R2_BUCKET,
		Key: filename,
		Body: buffer,
		ContentType: "audio/mpeg"
	});

	// Sends the command to S3 to upload the file
	await s3.send(command);

	return `${process.env.R2_DEFAULT_ENDPOINT}/${filename}`;
}