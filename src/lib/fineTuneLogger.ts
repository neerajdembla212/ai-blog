/**
 * This file creates training data for fine tuning AI and stores in this backend server (for now)
 */
import fs from "fs";
import path from "path";

export const TRAINING_LOG_PATH = path.join(process.cwd(), "logs", "summary.jsonl");

export const fineTuneLogger = (input: string, output: string) => {
  const messages = [
    { role: "user", content: `Summarize in <= 150 words: ${input}` },
    { role: "assistant", content: output },
  ];

  const line = JSON.stringify(messages) + "\n";

  fs.mkdirSync(path.dirname(TRAINING_LOG_PATH), { recursive: true });
  fs.appendFileSync(TRAINING_LOG_PATH, line);
};
