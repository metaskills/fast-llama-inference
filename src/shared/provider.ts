import type { LanguageModel } from "ai";
import { model } from "./models.ts";
import { generateText as _generateText, streamText as _streamText } from "ai";

class Provider {
  promptTokens: number = 0;
  completionTokens: number = 0;
  totalTokens: number = 0;

  model: LanguageModel;
  private _commonOptions: any;

  constructor(options: any = {}) {
    this.model = model;
    this.commonOptions.experimental_telemetry.functionId = options?.functionId;
  }

  get commonOptions() {
    if (!this._commonOptions) {
      this._commonOptions = {
        model: this.model,
        temperature: 0.1,
        maxSteps: 2,
        experimental_telemetry: {
          isEnabled: true,
          metadata: {
            provider: this.model.provider,
          },
        },
      };
    }
    return this._commonOptions;
  }

  async generateText(options: Partial<typeof _generateText> = {}) {
    const result = await _generateText({
      ...this.commonOptions,
      ...options,
    });
    this.#updateUsage(result.usage);
    return result;
  }

  async streamText(options: Partial<typeof _streamText> = {}) {
    const stream = _streamText({
      onFinish: async (result: any) => {
        this.#updateUsage(result.usage);
      },
      ...this.commonOptions,
      ...options,
    });
    return stream;
  }

  get usage() {
    return {
      promptTokens: this.promptTokens,
      completionTokens: this.completionTokens,
      totalTokens: this.totalTokens,
    };
  }

  #updateUsage(usage: any) {
    if (process.env.DEBUG) {
      console.log(`🧰 ${JSON.stringify(usage)}`);
    }
    this.promptTokens += usage?.promptTokens || 0;
    this.completionTokens += usage?.completionTokens || 0;
    this.totalTokens += usage?.totalTokens || 0;
    if (process.env.DEBUG) {
      console.log("\n");
    }
  }
}

export { Provider };
