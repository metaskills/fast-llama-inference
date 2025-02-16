import { inquire } from "./shared/inquire.ts";
import { Provider } from "./shared/provider.ts";
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
  let firstOutput = false;
  let fullResponse = "";

  for await (const chunk of stream.textStream) {
    if (!firstOutput) {
      if (chunk.trim() === "") {
        // Skip writing if the chunk is only whitespace
        continue;
      } else {
        // For the first non-empty chunk, remove leading whitespace. This is specifically to account for thinking models like DeepSeek R1, as the strip middleware (e.g., in models.ts) already handles leading whitespace for these models.
        const text = chunk.replace(/^\s+/, "");
        process.stdout.write(text);
        fullResponse += text;
        firstOutput = true;
        continue;
      }
    }
    process.stdout.write(chunk);
    fullResponse += chunk;
  }

  messages.push({ role: "assistant", content: fullResponse });
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
