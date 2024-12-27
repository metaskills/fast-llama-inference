import type { LanguageModel } from "ai";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { bedrock as _bedrock } from "@ai-sdk/amazon-bedrock";

const gpt4o = openai("gpt-4o");
const o1mini = openai("o1-mini");

const bedrock = _bedrock("us.meta.llama3-3-70b-instruct-v1:0");

const sambanova = createOpenAI({
  name: "sambanova",
  apiKey: process.env.SAMBANOVA_API_KEY,
  baseURL: "https://api.sambanova.ai/v1",
})("Meta-Llama-3.3-70B-Instruct");

const models: { [key: string]: LanguageModel } = {
  sambanova,
  gpt4o,
  o1mini,
  bedrock,
};
const model = process.env.MODEL ? models[process.env.MODEL] : sambanova;

export { model };
