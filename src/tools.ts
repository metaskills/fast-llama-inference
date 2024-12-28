import { streamText } from "ai";
import { inquire } from "./shared/inquire.js";
import { model } from "./shared/providers.js";
import { tool, CoreMessage } from "ai";
import { z } from "zod";

let systemRoleName: "system" | "user" =
  model.modelId === "o1-mini" ? "user" : "system";

const system = `
You are a helpful assistant capable of finding the current weather.
`.trim();

const messages: CoreMessage[] = [{ role: systemRoleName, content: system }];

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

function toolCalled(data: any) {
  if (process.env.DEBUG) {
    console.log(`\n🧰 ${JSON.stringify(data)}`);
  }
}

function pushMessages(content: string) {
  messages.push({ role: "assistant", content: content });
  if (process.env.DEBUG) {
    console.log(`\n✍️ ${JSON.stringify(messages, null, 2)}`);
  }
}

async function chat(newUserMessage: string) {
  pushMessages(newUserMessage);
  const options = {
    model: model,
    messages: messages,
    temperature: 0.1,
    tools: {
      weather: tool({
        description: "Get the weather in a location.",
        parameters: z.object({
          location: z
            .string()
            .describe(
              "Location to get the weather for. Can be a city name, zipcode, IP address, or lat/lng coordinates. Example: 'London'"
            ),
        }),
        execute: async (data) => {
          toolCalled(data);
          const response = {
            location: data.location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          };
          pushMessages(JSON.stringify(response));
          return response;
        },
      }),
    },
    maxSteps: 2,
    onFinish: async (result: any) => {
      updateUsage(result.usage);
    },
  };
  const stream = streamText(options);
  let fullResponse = "";
  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
    fullResponse += chunk;
  }
  process.stdout.write("\n\n");
}

let firstMessage = process.env.QUERY;
while (true) {
  const newUserMessage = firstMessage || (await inquire());
  firstMessage = undefined;
  if (newUserMessage.toLowerCase() === "exit") {
    console.log(`\n${JSON.stringify(tokenUsage)}`);
    break;
  }
  await chat(newUserMessage);
}
