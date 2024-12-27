import { streamText } from "ai";
import { inquire } from "./shared/inquire.js";
import { model } from "./shared/providers.js";
import type { CoreMessage } from "ai";

const messages: CoreMessage[] = [];
const tokenUsage = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
};

function updateUsage(usage: any) {
  if (usage) {
    console.log(`\n${JSON.stringify(usage)}`);
    tokenUsage.promptTokens += usage.promptTokens;
    tokenUsage.completionTokens += usage.completionTokens;
    tokenUsage.totalTokens += usage.totalTokens;
  }
}

async function chat(newUserMessage: string) {
  messages.push({ role: "user", content: newUserMessage });
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  const stream = streamText({
    model: model,
    system: `
Cutting Knowledge Date: December 2023
Today Date: ${timestamp}

You are a helpful assistant.
`.trim(),
    messages: messages,
    temperature: 0.1,
    maxTokens: 2000,
    onFinish: async (result) => {
      updateUsage(result.usage);
    },
  });
  let fullResponse = "";
  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
    fullResponse += chunk;
  }
  process.stdout.write("\n\n");
}

while (true) {
  const newUserMessage = await inquire();
  if (newUserMessage.toLowerCase() === "exit") {
    console.log(`\n${JSON.stringify(tokenUsage)}`);
    break;
  }
  await chat(newUserMessage);
}
