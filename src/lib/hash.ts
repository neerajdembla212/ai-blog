import crypto from "crypto";

export const generateId = (input: string): string | undefined => {
  if (!input) {
    return undefined;
  }
  return crypto.createHash("md5").update(input).digest("hex");
};
