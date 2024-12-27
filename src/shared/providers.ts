import type { LanguageModel } from "ai";
import { openai, createOpenAI } from "@ai-sdk/openai";

const gpt4o = openai("gpt-4o");
const o1mini = openai("o1-mini");

const sambanova = createOpenAI({
  name: "sambanova",
  apiKey: process.env.SAMBANOVA_API_KEY,
  baseURL: "https://api.sambanova.ai/v1",
})("Meta-Llama-3.3-70B-Instruct");

const models: { [key: string]: LanguageModel } = { sambanova, gpt4o, o1mini };
const model = process.env.MODEL ? models[process.env.MODEL] : sambanova;

export { model };
