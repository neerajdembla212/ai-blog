import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { TextDecoder } from "util";

const s3 = new S3Client({ region: "us-west-1" });

const BUCKET_NAME = "blog-ai-finetune-data";
const LOG_KEY = "logs/summary.jsonl";

const streamToString = async (stream: Readable) => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export const handler = async (event: any) => {
  const records = event.Records ?? [];
  for (const record of records) {
    const newLine = JSON.stringify(JSON.parse(record.body)) + "\n";
    let existingData = "";
    try {
      const getObjectCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: LOG_KEY,
      });
      const response = await s3.send(getObjectCommand);
      if (response.Body) {
        existingData = await streamToString(response.Body as Readable);
      }
    } catch (error: any) {
      if (error.name === "NoSuchKey") {
        existingData = "";
        console.log(`No existing data found, creating ${LOG_KEY}`);
      } else {
        console.log("Unexpected error occured while reafing file from s3");
        throw error;
      }
    }

    const updatedData = existingData + newLine;
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: LOG_KEY,
      Body: updatedData,
      ContentType: "application/jsonl",
    }));
  }

  return {
    statusCode: 200
  };
};
