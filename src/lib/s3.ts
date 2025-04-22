/**
 * This file communicates with AWS s3 service to upload the training data we create on each request on s3 bucket (configured in env variable)
 */
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadTrainingData(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);
  const key = `logs/${Date.now()}-${fileName}`;

  const uploadParams: PutObjectCommandInput = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: "application/jsonl",
  };

  await s3.send(new PutObjectCommand(uploadParams));
}
