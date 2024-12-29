import { generateText } from "ai";
import { inquire } from "./shared/inquire.js";
import { Provider } from "./shared/provider.js";
import { tool } from "ai";
import { z } from "zod";

const provider = new Provider({ functionId: "tools" });

const system = `
You are a helpful assistant capable of finding the current weather.
`.trim();

const tokenUsage = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
};

function updateUsage(usage: any) {
  if (usage) {
    tokenUsage.promptTokens += usage.promptTokens;
    tokenUsage.completionTokens += usage.completionTokens;
    tokenUsage.totalTokens += usage.totalTokens;
    console.log(`🪙 ${JSON.stringify(tokenUsage)}`);
  }
}

function toolCalled(data: any) {
  if (process.env.DEBUG) {
    console.log(`🧰 ${JSON.stringify(data)}`);
  }
}

async function chat(query: string) {
  const options = {
    model: provider.model,
    system: system,
    prompt: query,
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
          return {
            location: data.location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          };
        },
      }),
    },
    maxSteps: 2,
  };
  const result = await generateText(options);
  updateUsage(result.usage);
  console.log(result.text);
}

const query = process.env.QUERY || (await inquire());
await chat(query);
