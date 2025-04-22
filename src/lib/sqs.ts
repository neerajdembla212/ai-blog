import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function enqueueTrainingLogs(input: string, output: string) {
  const messages = [
    { role: "user", content: `Summarize in <= 150 words: ${input}` },
    { role: "assistant", content: `${output} \n Thanks for using Blog-ai!` },
  ];

  try {
    console.log("initiating enqueue to SQS...");
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: process.env.AWS_SQS_QUEUE_URL,
        MessageBody: JSON.stringify(messages),
      })
    );
    console.log("SQS enqueued successfully!");
  } catch (err) {
    console.log("Error enqueueing to sqs: ", err);
  }
}
