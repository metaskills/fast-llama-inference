import env from "../shared/env.js";
import { Eval } from "braintrust";
import { ValidJSON } from "autoevals";
import { extractClaims } from "../agents/extractClaims.js";

await Eval("Extract Claims", {
  data: () => {
    return [
      {
        input: env.readFile("data/bedrock-cross-region.md"),
        expected: 1,
      },
    ];
  },
  task: async (input) => {
    return await extractClaims(input);
  },
  scores: [
    ValidJSON.partial({
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            claim: { type: "string" },
            original_text: { type: "string" },
          },
          required: ["claim", "original_text"],
          additionalProperties: false,
        },
        minItems: 1,
        maxItems: 5,
      },
    }),
  ],
  trialCount: 3,
});
