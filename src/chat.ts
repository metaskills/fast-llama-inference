import { inquire } from "./shared/inquire.js";
import { Provider } from "./shared/provider.js";
import type { CoreMessage } from "ai";

const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
const provider = new Provider({ functionId: "chat" });

let systemRoleName: "system" | "user" =
  provider.model.modelId === "o1-mini" ? "user" : "system";

const system = `
Cutting Knowledge Date: December 2023
Today Date: ${timestamp}

You are a helpful assistant.
`.trim();

const messages: CoreMessage[] = [{ role: systemRoleName, content: system }];

async function chat(content: string) {
  messages.push({ role: "user", content: content });
  const stream = await provider.streamText({ messages: messages });
  let firstChunk = false;
  let fullResponse = "";

  for await (const chunk of stream.textStream) {
    const text = firstChunk
      ? chunk.replace(/^\s+/, "") // Removes leading whitespace due from <think> models like DeepSeek-R1.
      : chunk;
    firstChunk = true;
    process.stdout.write(text);
    fullResponse += text;
  }

  process.stdout.write("\n");
}

while (true) {
  const content = await inquire();
  if (content.toLowerCase() === "exit") {
    console.log(`🪙 ${JSON.stringify(provider.usage)}`);
    break;
  }
  await chat(content);
}
