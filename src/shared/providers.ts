import type { LanguageModel } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const sambanova = createOpenAI({
  name: "sambanova",
  apiKey: process.env.SAMBANOVA_API_KEY,
  baseURL: "https://api.sambanova.ai/v1",
})("Meta-Llama-3.3-70B-Instruct");

const models: { [key: string]: LanguageModel } = { sambanova };
const model = process.env.MODEL ? models[process.env.MODEL] : sambanova;

export { model };
