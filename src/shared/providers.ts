import type { LanguageModel } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { bedrock as _bedrock } from "@ai-sdk/amazon-bedrock";

const gpt4o = openai("gpt-4o");
const o1mini = openai("o1-mini");

const bedrock = _bedrock("us.meta.llama3-3-70b-instruct-v1:0");

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})("llama-3.3-70b-versatile");

const sambanova = createOpenAI({
  name: "sambanova",
  apiKey: process.env.SAMBANOVA_API_KEY,
  baseURL: "https://api.sambanova.ai/v1",
})("Meta-Llama-3.3-70B-Instruct");

const models: { [key: string]: LanguageModel } = {
  sambanova,
  "gpt-4o": gpt4o,
  "o1-mini": o1mini,
  bedrock,
  groq,
};
const model = process.env.MODEL ? models[process.env.MODEL] : sambanova;

export { model };
