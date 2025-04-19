import { OpenAI } from "openai";
import { withCache } from "../lib/withCache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeText = async (
  id: string,
  text: string
): Promise<string> => {
  const textSummary = await withCache(
    `text:${id}:summary`,
    300,
    async (): Promise<string> => {
      const summary = await openai.responses.create({
        model: "gpt-3.5-turbo",
        input: `Summarize in <150 words: ${text}`,
        max_output_tokens: 100,
      });
      return summary.output_text;
    }
  );
  return textSummary;
};
